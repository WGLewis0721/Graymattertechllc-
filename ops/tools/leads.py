#!/usr/bin/env python3
"""Gray Matter lead intelligence. Standard library only.

Lead records are private. They live in $GM_LEADS_DIR (default ops/leads/private/,
which is gitignored) and never in this public repository.

  python3 ops/tools/leads.py init
  python3 ops/tools/leads.py add --business "Name" --industry barbers-salons [--website URL] ...
  python3 ops/tools/leads.py audit <url>                  # quick public website check
  python3 ops/tools/leads.py audit-lead <lead-id>         # audit and record signals
  python3 ops/tools/leads.py signal <lead-id> no_website slow_response [--remove]
  python3 ops/tools/leads.py update <lead-id> --problem "..." --status qualified ...
  python3 ops/tools/leads.py list [--tier A] [--status new]
  python3 ops/tools/leads.py campaign morning|afternoon [--date 2026-11-18] [--sender William]
  python3 ops/tools/leads.py log <lead-id> --channel email --step 0 --outcome sent [--note ...]
  python3 ops/tools/leads.py due [--date 2026-11-18]
  python3 ops/tools/leads.py report
"""
import argparse
import csv
import datetime as dt
import html
import json
import os
import re
import ssl
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LEADS = ROOT / "ops" / "leads"
OUTREACH = LEADS / "outreach"
FIELDS = ["id", "business", "industry", "city", "contact_name", "first_name", "email", "phone",
          "facebook", "website", "source", "signals", "problem", "evidence", "service",
          "score", "tier", "status", "next_step", "next_date", "created", "updated"]
ACTIVITY = ["date", "lead_id", "channel", "step", "outcome", "note"]
SERVED = {"barbers-salons", "detailers", "contractors", "real-estate", "appointment-businesses",
          "entrepreneurs", "food-trucks", "cleaning-services", "professional-services"}
APPOINTMENT = {"barbers-salons", "detailers", "appointment-businesses", "cleaning-services"}
LOCAL = re.compile(r"montgomery|prattville|millbrook|wetumpka|pike road|river region", re.I)
OPEN = {"new", "researched", "qualified", "contacted", "replied", "call-booked", "proposal-sent"}

# Per-signal copy for tailored outreach. {business} is filled in.
PITCH = {
    "no_website": ("being found outside Facebook",
                   "I looked for {business} online and could only find the Facebook page, so anyone searching Google lands somewhere else.",
                   "A simple site with your services, hours and a way to reach you fixes that, and you keep the Facebook page.",
                   "add your hours, phone number and services to your free Google Business Profile so searches show them."),
    "site_not_mobile": ("the site on a phone",
                        "I pulled up {business}'s website on my phone and it's hard to read and tap.",
                        "Most people will see it on a phone first, so making it mobile-friendly is usually the quickest win.",
                        "open your site on your own phone and try to call you or find your hours in under ten seconds."),
    "site_no_https": ("the 'not secure' warning",
                      "{business}'s website shows a 'not secure' warning in the browser.",
                      "That's usually a quick certificate fix, and it stops scaring off visitors.",
                      "ask whoever hosts your site to turn on a free HTTPS certificate."),
    "no_online_booking": ("online booking",
                          "I couldn't find a way to book {business} online, only to call or message.",
                          "Letting people pick a time themselves, with automatic reminders, tends to cut the back-and-forth.",
                          "turn on the reminder feature in whatever calendar or booking tool you already use."),
    "slow_response": ("missed calls and messages",
                      "A few of {business}'s reviews mention calls or messages that didn't get answered.",
                      "An automatic reply with a booking or quote link means nobody waits on you to call back.",
                      "set up an away message on your Facebook page and a voicemail that points to how to book."),
    "manual_orders": ("orders that come in by DM",
                      "It looks like {business} takes most orders through DMs.",
                      "We set up a way for those orders to land in one list automatically, with confirmations sent for you.",
                      "make one simple order form and pin the link at the top of your page."),
    "outdated_site": ("the website being out of date",
                      "{business}'s website looks like it hasn't been updated in a while (old dates and details).",
                      "A refresh that you can update yourself keeps it from going stale again.",
                      "check your site's hours, phone and prices against what's true today."),
    "security_red_flag": ("account security",
                          "I noticed something on {business}'s public pages that looked like an account problem.",
                          "Locking down who has access to the email, page and payment accounts usually takes an afternoon.",
                          "turn on two-step sign-in for your business email and your Facebook page today."),
    "growing": ("the technology side of growing",
                "Congratulations on {business} growing.",
                "Growth is the best time to get accounts, files and access set up properly before it gets messy.",
                "write down every account the business uses and who can sign in to each one."),
}


def data_dir():
    d = Path(os.environ.get("GM_LEADS_DIR", LEADS / "private"))
    d.mkdir(parents=True, exist_ok=True)
    return d


def cfg():
    return json.loads((LEADS / "scoring.json").read_text(encoding="utf-8"))


def today():
    return dt.date.today().isoformat()


def read(name, fields):
    path = data_dir() / name
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return [{k: row.get(k, "") or "" for k in fields} for row in csv.DictReader(f)]


def write(name, fields, rows):
    path = data_dir() / name
    tmp = path.with_suffix(".tmp")
    with tmp.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    tmp.replace(path)


def load():
    return read("leads.csv", FIELDS)


def save(rows):
    write("leads.csv", FIELDS, rows)


def find(rows, lead_id):
    for r in rows:
        if r["id"] == lead_id:
            return r
    sys.exit(f"no lead {lead_id}")


def score(lead, c=None):
    """Recompute score, tier and primary service from signals and lead facts."""
    c = c or cfg()
    sig = {s for s in lead["signals"].split() if s}
    if lead["industry"] in SERVED:
        sig.add("served_industry")
    if LOCAL.search(lead["city"] or ""):
        sig.add("local")
    if lead["contact_name"] and (lead["email"] or lead["phone"] or lead["facebook"]):
        sig.add("decision_maker_known")
    unknown = sig - set(c["signals"])
    if unknown:
        sys.exit(f"unknown signal(s): {', '.join(sorted(unknown))}")
    total = sum(c["signals"][s]["points"] for s in sig)
    total += int(c.get("priority_segments", {}).get(lead["industry"], 0))
    has_problem = len(lead["problem"].split()) >= 4
    tier = next(t["tier"] for t in c["tiers"]
                if total >= t["min_score"] and (has_problem or not t["requires_problem"]))
    best = max((s for s in sig if c["signals"][s].get("service")),
               key=lambda s: c["signals"][s]["points"], default="")
    lead["score"] = str(total)
    lead["tier"] = tier
    if best and not lead["service"]:
        lead["service"] = c["signals"][best]["service"]
    return lead


def next_id(rows):
    nums = [int(r["id"][1:]) for r in rows if re.fullmatch(r"L\d+", r["id"])]
    return f"L{(max(nums) + 1 if nums else 1):04d}"


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def cmd_init(_):
    d = data_dir()
    for name, fields in (("leads.csv", FIELDS), ("activity.csv", ACTIVITY)):
        if not (d / name).exists():
            write(name, fields, [])
    dnc = d / "do-not-contact.txt"
    if not dnc.exists():
        dnc.write_text("# One email, phone or business name per line. Never contacted again.\n", encoding="utf-8")
    print(f"lead store ready at {d}")


def dnc_list():
    p = data_dir() / "do-not-contact.txt"
    if not p.exists():
        return set()
    return {norm(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")}


def cmd_add(a):
    rows = load()
    for r in rows:
        if norm(r["business"]) == norm(a.business) or (a.website and norm(r["website"]) == norm(a.website)):
            sys.exit(f"duplicate of {r['id']} {r['business']}")
    lead = {k: "" for k in FIELDS}
    lead.update({k: getattr(a, k) or "" for k in FIELDS if hasattr(a, k) and getattr(a, k)})
    lead["first_name"] = lead["first_name"] or (lead["contact_name"].split()[0] if lead["contact_name"] else "")
    lead.update(id=next_id(rows), status="new", created=today(), updated=today(),
                signals=" ".join(a.signals or []))
    rows.append(score(lead))
    save(rows)
    print(f"{lead['id']} {lead['business']}: score {lead['score']} tier {lead['tier']}")


def fetch(url):
    if not re.match(r"https?://", url):
        url = "https://" + url
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (site check)"})
    ctx = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or None)
    with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
        return r.geturl(), r.read(2_000_000).decode("utf-8", "replace")


def audit(url):
    """Facts from a public homepage. Returns (facts dict, suggested signals)."""
    facts, signals = {"url": url}, []
    try:
        final, page = fetch(url)
    except Exception as e:  # noqa: BLE001 - report any failure as a fact
        facts["error"] = f"{type(e).__name__}: {e}"[:200]
        if re.match(r"https://", url) or "://" not in url:
            try:
                final, page = fetch("http://" + re.sub(r"^https?://", "", url))
                facts["error"] += " (http works)"
            except Exception:  # noqa: BLE001
                return facts, signals
        else:
            return facts, signals
    low = page.lower()
    title = re.search(r"<title[^>]*>(.*?)</title>", page, re.I | re.S)
    years = [int(y) for y in re.findall(r"(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})", low)]
    facts.update({
        "final_url": final,
        "https": final.startswith("https://"),
        "title": html.unescape(title.group(1).strip())[:120] if title else "",
        "mobile_viewport": 'name="viewport"' in low or "name='viewport'" in low,
        "tel_link": "tel:" in low,
        "form": "<form" in low,
        "booking_link": bool(re.search(r"book(ing)?|schedule|appointment|calendly|square\.site|acuity|vagaro|booksy|setmore", low)),
        "copyright_year": max(years) if years else None,
        "facebook_only": bool(re.search(r"facebook\.com|fb\.com", final)),
        "size_kb": len(page) // 1024,
    })
    if facts["facebook_only"]:
        signals.append("no_website")
    if not facts["https"]:
        signals.append("site_no_https")
    if not facts["mobile_viewport"]:
        signals.append("site_not_mobile")
    if facts["copyright_year"] and facts["copyright_year"] < dt.date.today().year - 2:
        signals.append("outdated_site")
    return facts, signals


def cmd_audit(a):
    facts, signals = audit(a.url)
    print(json.dumps(facts, indent=2))
    print("suggested signals:", " ".join(signals) or "(none)")


def cmd_audit_lead(a):
    rows = load()
    lead = find(rows, a.lead_id)
    if not lead["website"]:
        sig = set(lead["signals"].split()) | {"no_website"}
        facts = {"note": "no website on record"}
    else:
        facts, found = audit(lead["website"])
        sig = set(lead["signals"].split()) | set(found)
    lead["signals"] = " ".join(sorted(sig))
    lead["evidence"] = (lead["evidence"] + " | " if lead["evidence"] else "") + \
        f"audit {today()}: " + ", ".join(f"{k}={v}" for k, v in facts.items() if k != "url")
    if lead["status"] == "new":
        lead["status"] = "researched"
    lead["updated"] = today()
    score(lead)
    save(rows)
    print(f"{lead['id']}: signals {lead['signals']} -> score {lead['score']} tier {lead['tier']}")


def cmd_signal(a):
    rows = load()
    lead = find(rows, a.lead_id)
    sig = set(lead["signals"].split())
    sig = sig - set(a.signals) if a.remove else sig | set(a.signals)
    lead["signals"], lead["updated"] = " ".join(sorted(sig)), today()
    score(lead)
    save(rows)
    print(f"{lead['id']}: score {lead['score']} tier {lead['tier']}")


def cmd_update(a):
    rows = load()
    lead = find(rows, a.lead_id)
    statuses = cfg()["statuses"]
    for k in FIELDS:
        v = getattr(a, k, None)
        if v is not None:
            if k == "status" and v not in statuses:
                sys.exit(f"status must be one of {statuses}")
            lead[k] = v
    lead["updated"] = today()
    score(lead)
    save(rows)
    print(f"{lead['id']}: {lead['status']} score {lead['score']} tier {lead['tier']}")


def cmd_list(a):
    rows = sorted(load(), key=lambda r: (r["tier"], -int(r["score"] or 0)))
    for r in rows:
        if (a.tier and r["tier"] != a.tier) or (a.status and r["status"] != a.status):
            continue
        print(f"{r['id']}  {r['tier']} {r['score']:>3}  {r['status']:<13} {r['business']:<32} {r['problem'][:50]}")


def activity():
    return read("activity.csv", ACTIVITY)


def last_step(lead_id, acts):
    steps = [int(x["step"]) for x in acts if x["lead_id"] == lead_id and x["step"].isdigit()
             and x["outcome"] in {"sent", "called", "voicemail"}]
    return max(steps) if steps else None


def due_followups(rows, acts, on):
    cadence = cfg()["cadence_days"]
    out = []
    for r in rows:
        if r["status"] not in {"contacted"}:
            continue
        step = last_step(r["id"], acts)
        if step is None or step + 1 >= len(cadence):
            continue
        first = min(x["date"] for x in acts if x["lead_id"] == r["id"] and x["step"] == "0")
        when = dt.date.fromisoformat(first) + dt.timedelta(days=cadence[step + 1])
        if when <= on:
            out.append((r, step + 1, when))
    return out


def template(name):
    text = (OUTREACH / f"{name}.md").read_text(encoding="utf-8")
    return text.split("\n---\n", 1)[1].strip() if text.startswith("---") else text


def fill(text, lead, sender, extra=None):
    sig = [s for s in lead["signals"].split() if s in PITCH]
    sig.sort(key=lambda s: -cfg()["signals"][s]["points"])
    hook, obs, sug, tip = (PITCH[sig[0]] if sig else
                           ("a quick idea", "I came across {business} and had one idea.",
                            "", "write down the one task you redo every week; that's usually the first thing to automate."))
    vals = {"business_name": lead["business"], "first_name": lead["first_name"] or "there",
            "sender_name": sender, "subject_hook": hook, "problem_short": hook,
            "observation": obs, "suggestion": sug, "free_tip": tip,
            "proposed_time": "tomorrow morning or afternoon"}
    vals.update(extra or {})
    vals = {k: v.replace("{business}", lead["business"]) for k, v in vals.items()}
    out = re.sub(r"\{\{(\w+)\}\}", lambda m: vals.get(m.group(1), m.group(0)), text)
    left = re.findall(r"\{\{\w+\}\}", out)
    if left:
        sys.exit(f"unfilled fields {left} for {lead['id']}")
    return out


def cmd_campaign(a):
    c, rows, acts = cfg(), load(), activity()
    on = dt.date.fromisoformat(a.date) if a.date else dt.date.today()
    dnc = dnc_list()
    blocked = lambda r: any(norm(v) in dnc for v in (r["business"], r["email"], r["phone"]) if v)  # noqa: E731
    lines = [f"# {a.slot.title()} campaign — {on:%a %b %d, %Y}", "",
             f"Window: {c['campaigns'][a.slot]['window']}. {c['campaigns'][a.slot]['purpose']}.", "",
             "Send each message yourself, then log it: "
             "`python3 ops/tools/leads.py log <id> --channel <channel> --step <n> --outcome sent`.",
             "Edit any line that is not true for that business before sending.", ""]
    picked = 0
    if a.slot == "morning":
        pool = [r for r in rows if r["status"] in {"new", "researched", "qualified"} and r["tier"] in {"A", "B"}
                and last_step(r["id"], acts) is None and not blocked(r)]
        pool.sort(key=lambda r: (r["tier"], -int(r["score"])))
        for r in pool[:c["campaigns"]["morning"]["max"]]:
            channel = "first-touch-email" if r["email"] else "first-touch-dm" if r["facebook"] else "call-opener"
            picked += 1
            lines += [f"## {r['id']} · {r['business']} · tier {r['tier']} ({r['score']})", "",
                      f"- Problem: {r['problem']}", f"- Evidence: {r['evidence'] or '(none recorded)'}",
                      f"- Reach: {r['email'] or r['facebook'] or r['phone']}  ·  template `{channel}` step 0", "",
                      "```", fill(template(channel), r, a.sender), "```", ""]
    else:
        for r, step, when in due_followups(rows, acts, on)[:c["campaigns"]["afternoon"]["max"]]:
            if blocked(r):
                continue
            picked += 1
            lines += [f"## {r['id']} · {r['business']} · follow-up {step} (due {when})", "",
                      "```", fill(template(f"follow-up-{step}"), r, a.sender), "```", ""]
        replied = [r for r in rows if r["status"] in {"replied", "call-booked"}]
        if replied:
            lines += ["## Replies and calls to handle", ""]
            lines += [f"- {r['id']} {r['business']}: {r['status']}, next: {r['next_step'] or 'decide'}"
                      for r in replied]
            picked += len(replied)
    if not picked:
        lines.append("Nothing due. Add or research leads (`leads.py add`, `leads.py audit-lead`).")
    out = data_dir() / "campaigns" / f"{on}-{a.slot}.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{picked} item(s) -> {out}")


def cmd_log(a):
    rows = load()
    lead = find(rows, a.lead_id)
    acts = activity()
    acts.append({"date": a.date or today(), "lead_id": a.lead_id, "channel": a.channel,
                 "step": str(a.step), "outcome": a.outcome, "note": a.note or ""})
    write("activity.csv", ACTIVITY, acts)
    transitions = {"sent": "contacted", "called": "contacted", "voicemail": "contacted",
                   "replied": "replied", "booked": "call-booked", "declined": "lost",
                   "stop": "do-not-contact"}
    new = transitions.get(a.outcome)
    if new and not (new == "contacted" and lead["status"] in {"replied", "call-booked", "proposal-sent"}):
        lead["status"] = new
    if a.outcome == "stop":
        with (data_dir() / "do-not-contact.txt").open("a", encoding="utf-8") as f:
            f.write("\n".join(v for v in (lead["business"], lead["email"], lead["phone"]) if v) + "\n")
    cadence = cfg()["cadence_days"]
    if lead["status"] == "contacted" and a.step + 1 < len(cadence):
        lead["next_step"], lead["next_date"] = f"follow-up {a.step + 1}", ""
    elif lead["status"] == "contacted":
        lead["status"], lead["next_step"] = "nurture", "check in next quarter"
    lead["updated"] = today()
    save(rows)
    print(f"{lead['id']}: logged {a.outcome}, status {lead['status']}")


def cmd_due(a):
    on = dt.date.fromisoformat(a.date) if a.date else dt.date.today()
    for r, step, when in due_followups(load(), activity(), on):
        print(f"{r['id']}  follow-up {step} due {when}  {r['business']}")


def cmd_report(_):
    rows, acts = load(), activity()
    by = {}
    for r in rows:
        by.setdefault(r["status"], []).append(r)
    print(f"{len(rows)} leads, {len(acts)} logged touches")
    for s in cfg()["statuses"]:
        if s in by:
            print(f"  {s:<14} {len(by[s])}")
    tiers = {t: sum(1 for r in rows if r["tier"] == t and r["status"] in OPEN) for t in "ABC"}
    print(f"open by tier: A {tiers['A']}  B {tiers['B']}  C {tiers['C']}")
    targets = cfg().get("weekly_targets", {})
    since = (dt.date.today() - dt.timedelta(days=7)).isoformat()
    week = [x for x in acts if x["date"] >= since]
    done = {
        "leads_added": sum(1 for r in rows if r["created"] >= since),
        "first_touches": sum(1 for x in week if x["step"] == "0" and x["outcome"] in {"sent", "called", "voicemail"}),
        "in_person": sum(1 for x in week if x["channel"] == "in-person"),
        "calls_booked": sum(1 for x in week if x["outcome"] == "booked"),
        "proposals": sum(1 for r in rows if r["status"] == "proposal-sent" and r["updated"] >= since),
    }
    print("last 7 days vs weekly targets (ops/GTM.md):")
    for key, value in done.items():
        goal = targets.get(key)
        mark = "" if not isinstance(goal, int) else ("  ok" if value >= goal else f"  short by {goal - value}")
        print(f"  {key:<14} {value:>3} / {goal if goal is not None else '-'}{mark}")
    won = len(by.get("won", []))
    contacted = len({x['lead_id'] for x in acts if x['step'] == '0'})
    if contacted:
        print(f"won {won} of {contacted} contacted")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("init").set_defaults(fn=cmd_init)
    p = sub.add_parser("add")
    for k in ("business", "industry"):
        p.add_argument(f"--{k}", required=True)
    for k in ("city", "contact_name", "first_name", "email", "phone", "facebook", "website",
              "source", "problem", "evidence", "service"):
        p.add_argument(f"--{k.replace('_', '-')}", dest=k)
    p.add_argument("--signals", nargs="*")
    p.set_defaults(fn=cmd_add)
    p = sub.add_parser("audit")
    p.add_argument("url")
    p.set_defaults(fn=cmd_audit)
    p = sub.add_parser("audit-lead")
    p.add_argument("lead_id")
    p.set_defaults(fn=cmd_audit_lead)
    p = sub.add_parser("signal")
    p.add_argument("lead_id")
    p.add_argument("signals", nargs="+")
    p.add_argument("--remove", action="store_true")
    p.set_defaults(fn=cmd_signal)
    p = sub.add_parser("update")
    p.add_argument("lead_id")
    for k in FIELDS:
        if k not in {"id", "score", "tier", "created", "updated", "signals"}:
            p.add_argument(f"--{k.replace('_', '-')}", dest=k)
    p.set_defaults(fn=cmd_update)
    p = sub.add_parser("list")
    p.add_argument("--tier")
    p.add_argument("--status")
    p.set_defaults(fn=cmd_list)
    p = sub.add_parser("campaign")
    p.add_argument("slot", choices=["morning", "afternoon"])
    p.add_argument("--date")
    p.add_argument("--sender", default=os.environ.get("GM_SENDER", "William"))
    p.set_defaults(fn=cmd_campaign)
    p = sub.add_parser("log")
    p.add_argument("lead_id")
    p.add_argument("--channel", required=True, choices=["email", "facebook-dm", "phone", "in-person", "other"])
    p.add_argument("--step", type=int, default=0)
    p.add_argument("--outcome", required=True,
                   choices=["sent", "called", "voicemail", "replied", "booked", "declined", "stop", "note"])
    p.add_argument("--note")
    p.add_argument("--date")
    p.set_defaults(fn=cmd_log)
    p = sub.add_parser("due")
    p.add_argument("--date")
    p.set_defaults(fn=cmd_due)
    sub.add_parser("report").set_defaults(fn=cmd_report)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
