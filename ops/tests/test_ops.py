"""Acceptance tests for the Gray Matter ops system. Run: python3 -m unittest discover -s ops/tests -v"""
import csv
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TOOLS = ROOT / "ops" / "tools"
sys.path.insert(0, str(TOOLS))
import content  # noqa: E402


def run(tool, *args, env=None, ok=True):
    r = subprocess.run([sys.executable, str(TOOLS / tool), *args], cwd=ROOT, capture_output=True,
                       text=True, env={**os.environ, **(env or {})})
    if ok and r.returncode:
        raise AssertionError(f"{tool} {args} failed:\n{r.stdout}\n{r.stderr}")
    return r


GOOD_POST = """---
id: {id}
status: draft
platform: facebook
pillar: protect
topic: T08
service: backup-recovery
industry: contractors
format: tip
keyword: estimate office laptop
question: {question}
hook: {hook}
cta: fit-check
image: assets/gray-matter/social/gm-social-digital-solutions-square.png
hashtags: #GrayMatter #MontgomeryAL
created: 2026-11-17
---
{hook}

{body}
"""
BODY = ("Pick one estimate from last month and look for it somewhere other than the office laptop. "
        "Check the shared drive, your phone and your email. If the only copy is on that one machine, "
        "write down the three folders that matter most and copy them to cloud storage you already pay for. "
        "Then open one file from the copy to be sure it works.")


class ContentEngine(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.saved = (content.POSTS, content.RESEARCH, content.MUSE, content.INDEX, content.POSTED_LOG)
        content.POSTS = self.tmp / "posts"
        content.RESEARCH = self.tmp / "research"
        content.MUSE = self.tmp / "muse"
        content.INDEX = self.tmp / "index"
        content.POSTED_LOG = self.tmp / "posted-log.csv"
        content.POSTS.mkdir()
        content.RESEARCH.mkdir()

    def tearDown(self):
        (content.POSTS, content.RESEARCH, content.MUSE, content.INDEX, content.POSTED_LOG) = self.saved
        shutil.rmtree(self.tmp)

    def post(self, pid, hook, body=BODY, question=""):
        (content.POSTS / f"{pid}.md").write_text(GOOD_POST.format(id=pid, hook=hook, body=body, question=question))

    def test_good_post_passes(self):
        self.post("gm-fb-9001", "The office laptop holds every estimate you have ever sent.")
        self.assertEqual(content.validate(quiet=True), [])

    def test_rejects_filler_stats_and_unapproved_price(self):
        self.post("gm-fb-9001", "In today's digital world backups matter.",
                  BODY + " Seventy % of owners pay $999 to unlock this.")
        errors = " ".join(content.validate(quiet=True))
        for expected in ("in today's digital", "unlock", "percentages", "$999"):
            self.assertIn(expected, errors)

    def test_rejects_engagement_bait_and_long_hook(self):
        self.post("gm-fb-9001", "The office laptop holds every estimate you have ever sent. " * 3,
                  question="Like this if your files live on one laptop?")
        errors = " ".join(content.validate(quiet=True))
        self.assertIn("engagement bait", errors)
        self.assertIn("characters", errors)

    def test_exports_facebook_and_instagram_text(self):
        self.post("gm-fb-9001", "The office laptop holds every estimate you have ever sent.",
                  question="Where does your newest estimate live right now?")
        content.set_status(["gm-fb-9001"], "approved")

        class A:
            start, days, include_drafts = "2026-11-23", 7, False
        content.export_muse(A)
        p = json.loads((content.MUSE / "queue.json").read_text())["posts"][0]
        self.assertIn("Where does your newest estimate live", p["full_text"])
        self.assertIn("https://", p["full_text"])
        self.assertNotIn("https://", p["instagram_text"])
        self.assertIn("bio", p["instagram_text"])
        self.assertLessEqual(p["instagram_text"].split("\n")[-1].count("#"), 5)

    def test_rejects_near_duplicate(self):
        self.post("gm-fb-9001", "The office laptop holds every estimate you have ever sent.")
        self.post("gm-fb-9002", "Your truck cab is not a filing cabinet for paper invoices.")
        self.assertIn("near-duplicate", " ".join(content.validate(quiet=True)))

    def test_export_skips_drafts_unless_asked_and_never_reposts(self):
        self.post("gm-fb-9001", "The office laptop holds every estimate you have ever sent.")

        class A:
            start, days, include_drafts = "2026-11-23", 7, False
        with self.assertRaises(SystemExit):
            content.export_muse(A)
        content.set_status(["gm-fb-9001"], "approved")
        content.export_muse(A)
        queue = json.loads((content.MUSE / "queue.json").read_text())
        self.assertTrue(queue["approved"])
        self.assertIn("### Instagram text", (content.MUSE / "README_DAILY_CAPTIONS.md").read_text())
        self.assertIn("graymatterdigitalsolutions.com", queue["posts"][0]["full_text"])

        class P:
            id, date, url = "gm-fb-9001", "2026-11-23", "https://facebook.com/x"
        content.mark_posted(P)
        with self.assertRaises(SystemExit):
            content.export_muse(A)


class RealRepository(unittest.TestCase):
    def test_ops_contract_passes(self):
        r = run("check_ops.py", ok=False)
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_real_content_exports_review_queue(self):
        tmp = tempfile.mkdtemp()
        try:
            saved = content.MUSE
            content.MUSE = Path(tmp)

            class A:
                start, days, include_drafts = "2026-11-23", 14, True
            content.export_muse(A)
            q = json.loads((Path(tmp) / "queue.json").read_text())
            self.assertEqual(len(q["posts"]), 14)
            pillars = [p["pillar"] for p in q["posts"]]
            self.assertTrue(all(a != b for a, b in zip(pillars, pillars[1:])), "pillar repeated on consecutive days")
            self.assertGreaterEqual(len({p["topic"] for p in q["posts"]}), 10, "too few distinct topics in 14 days")
            for p in q["posts"]:
                self.assertTrue((ROOT / p["image_repo_path"]).is_file())
        finally:
            content.MUSE = saved
            shutil.rmtree(tmp)


class Leads(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.env = {"GM_LEADS_DIR": self.tmp}
        run("leads.py", "init", env=self.env)

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def add(self, *args):
        return run("leads.py", "add", *args, env=self.env)

    def test_scoring_needs_a_real_problem_for_tier_a(self):
        self.add("--business", "Alpha (fictional)", "--industry", "barbers-salons", "--city", "Montgomery",
                 "--signals", "no_website", "slow_response", "no_online_booking")
        self.add("--business", "Beta (fictional)", "--industry", "barbers-salons", "--city", "Montgomery",
                 "--signals", "no_website", "slow_response", "no_online_booking",
                 "--problem", "Clients cannot book after hours and calls go unanswered")
        self.add("--business", "Hotel (fictional)", "--industry", "real-estate", "--city", "Montgomery",
                 "--signals", "no_website", "slow_response", "no_online_booking",
                 "--problem", "Clients cannot book after hours and calls go unanswered")
        rows = {r["business"]: r for r in csv.DictReader(open(Path(self.tmp) / "leads.csv"))}
        self.assertGreater(int(rows["Beta (fictional)"]["score"]), int(rows["Hotel (fictional)"]["score"]),
                           "beachhead segment from GTM.md must outrank an equal lead outside it")
        self.assertEqual(rows["Alpha (fictional)"]["tier"], "C")
        self.assertEqual(rows["Beta (fictional)"]["tier"], "A")
        self.assertEqual(rows["Beta (fictional)"]["service"], "business-websites")

    def test_duplicates_and_unknown_signals_rejected(self):
        self.add("--business", "Gamma Co (fictional)", "--industry", "detailers")
        self.assertNotEqual(run("leads.py", "add", "--business", "gamma co (FICTIONAL)", "--industry", "detailers",
                                env=self.env, ok=False).returncode, 0)
        self.assertNotEqual(run("leads.py", "add", "--business", "Delta", "--industry", "detailers",
                                "--signals", "made_up", env=self.env, ok=False).returncode, 0)

    def test_campaign_cycle_and_do_not_contact(self):
        self.add("--business", "Echo Shop (fictional)", "--industry", "detailers", "--city", "Prattville",
                 "--contact-name", "Pat Example", "--email", "pat@example.com",
                 "--signals", "no_website", "manual_orders", "--problem", "Orders arrive by DM and get lost")
        run("leads.py", "campaign", "morning", "--date", "2026-11-18", env=self.env)
        morning = (Path(self.tmp) / "campaigns" / "2026-11-18-morning.md").read_text()
        self.assertIn("Hi Pat", morning)
        self.assertIn('Reply "stop"', morning)
        self.assertNotIn("{{", morning)
        run("leads.py", "log", "L0001", "--channel", "email", "--outcome", "sent", "--date", "2026-11-18", env=self.env)
        self.assertIn("follow-up 1", run("leads.py", "due", "--date", "2026-11-21", env=self.env).stdout)
        self.assertNotIn("L0001", run("leads.py", "due", "--date", "2026-11-20", env=self.env).stdout)
        run("leads.py", "log", "L0001", "--channel", "email", "--step", "1", "--outcome", "stop", env=self.env)
        run("leads.py", "campaign", "afternoon", "--date", "2026-11-30", env=self.env)
        self.assertNotIn("Echo", (Path(self.tmp) / "campaigns" / "2026-11-30-afternoon.md").read_text())
        self.assertIn("Echo Shop", (Path(self.tmp) / "do-not-contact.txt").read_text())
        report = run("leads.py", "report", env=self.env).stdout
        self.assertIn("vs weekly targets", report)


class Engagements(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.env = {"GM_CLIENTS_DIR": self.tmp}

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_quote_and_invoices_from_published_prices(self):
        run("engage.py", "new", "--client", "Foxtrot (fictional)", "--kit", "website",
            "--add", "addon-seo=500", env=self.env)
        folder = Path(self.tmp) / "foxtrot-fictional"
        quote = (folder / "QUOTE.md").read_text()
        self.assertIn("$2,000", quote)
        self.assertIn("$1,000", quote)
        self.assertTrue((folder / "KIT_CHECKLIST.md").exists())
        self.assertNotEqual(run("engage.py", "invoice", "foxtrot-fictional", "balance", env=self.env, ok=False).returncode, 0)
        run("engage.py", "invoice", "foxtrot-fictional", "deposit", env=self.env)
        run("engage.py", "invoice", "foxtrot-fictional", "balance", env=self.env)
        invoices = sorted(folder.glob("INVOICE-*.md"))
        self.assertEqual(len(invoices), 2)
        self.assertNotIn("{{", invoices[0].read_text())

    def test_refuses_unpriced_and_off_list_prices(self):
        for args in (["--kit", "automation"],
                     ["--kit", "website", "--price", "website-business=900"],
                     ["--kit", "website", "--add", "addon-seo=2000"]):
            r = run("engage.py", "new", "--client", "Golf", *args, env=self.env, ok=False)
            self.assertNotEqual(r.returncode, 0, args)
        run("engage.py", "new", "--client", "Golf", "--kit", "automation",
            "--price", "workflow-automation=1200", env=self.env)


if __name__ == "__main__":
    unittest.main()
