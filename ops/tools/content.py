#!/usr/bin/env python3
"""Gray Matter marketing content engine. Standard library only.

  python3 ops/tools/content.py validate
  python3 ops/tools/content.py index
  python3 ops/tools/content.py search <words...> [--pillar X] [--service X] [--status X]
  python3 ops/tools/content.py export-muse --start 2026-11-23 --days 14 [--include-drafts]
  python3 ops/tools/content.py approve <id> [<id> ...]
  python3 ops/tools/content.py mark-posted <id> --date 2026-11-23 --url https://...
"""
import argparse
import csv
import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MKT = ROOT / "ops" / "marketing"
POSTS, RESEARCH, MUSE, INDEX = MKT / "posts", MKT / "research", MKT / "muse", MKT / "index"
POSTED_LOG = MKT / "posted-log.csv"

POST_FIELDS = ["id", "status", "platform", "pillar", "topic", "service", "industry",
               "format", "hook", "cta", "image", "hashtags", "created"]
BRIEF_FIELDS = ["id", "title", "pillar", "services", "audience", "researched"]
BRIEF_SECTIONS = ["## The problem in the owner's words", "## What is actually going on",
                  "## Post angles", "## What Gray Matter does about it", "## Sources"]
BANNED = ["in today's digital", "game-changer", "game changer", "unlock", "leverage",
          "seamless", "cutting-edge", "cutting edge", "revolutioniz", "next level",
          "digital landscape", "are you tired of", "look no further", "it's no secret",
          "elevate", "supercharge", "robust", "empower", "fast-paced", "in this day and age"]
BODY_WORDS = (45, 130)
DUP_BODY, DUP_HOOK = 0.30, 0.60
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿]")


def rel(path):
    """Repository-relative path when inside the repo, else the absolute path."""
    try:
        return str(Path(path).resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def load_json(name):
    return json.loads((MKT / "data" / name).read_text(encoding="utf-8"))


def service_slugs():
    js = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
    services = set(re.findall(r"url: 'services/([a-z0-9-]+)\.html'", js))
    industries = set(re.findall(r"url: 'industries/([a-z0-9-]+)\.html'", js))
    return services, industries


def parse(path):
    """Return (front matter dict, body) for a Markdown file with flat front matter."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}, text
    head, _, body = text[4:].partition("\n---\n")
    meta = {}
    for line in head.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, sep, value = line.partition(":")
        if sep:
            meta[key.strip()] = re.sub(r"\s+#\s.*$", "", value).strip()
    return meta, body.strip()


def words(text):
    return re.findall(r"[a-z0-9']+", text.lower())


def shingles(text, n=3):
    w = words(text)
    return {" ".join(w[i:i + n]) for i in range(max(len(w) - n + 1, 1))}


def jaccard(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0


def load_posts():
    return [(p, *parse(p)) for p in sorted(POSTS.glob("*.md"))]


def load_briefs():
    return [(p, *parse(p)) for p in sorted(RESEARCH.glob("*.md"))]


def posted_ids():
    if not POSTED_LOG.exists():
        return set()
    with POSTED_LOG.open(encoding="utf-8") as f:
        return {row["id"] for row in csv.DictReader(f)}


def check_post(path, meta, body, cfg, ctas, services, industries):
    errs = []
    for field in POST_FIELDS:
        if not meta.get(field):
            errs.append(f"missing field '{field}'")
    if errs:
        return errs
    if meta["id"] != path.stem:
        errs.append("id does not match filename")
    if meta["status"] not in cfg["statuses"]:
        errs.append(f"status '{meta['status']}' not allowed")
    if meta["platform"] != "facebook":
        errs.append("platform must be facebook")
    if meta["pillar"] not in cfg["pillars"]:
        errs.append(f"unknown pillar '{meta['pillar']}'")
    topic = cfg["topics"].get(meta["topic"])
    if not topic:
        errs.append(f"unknown topic '{meta['topic']}'")
    elif topic["pillar"] != meta["pillar"]:
        errs.append(f"pillar should be '{topic['pillar']}' for topic {meta['topic']}")
    if meta["service"] not in services:
        errs.append(f"unknown service '{meta['service']}'")
    if meta["industry"] != "any" and meta["industry"] not in industries:
        errs.append(f"unknown industry '{meta['industry']}'")
    if meta["format"] not in cfg["formats"]:
        errs.append(f"unknown format '{meta['format']}'")
    if meta["cta"] not in ctas["ctas"]:
        errs.append(f"unknown cta '{meta['cta']}'")
    if meta["cta"] == "comment" and not meta.get("cta_question", "").endswith("?"):
        errs.append("cta 'comment' needs cta_question ending in '?'")
    if not (ROOT / meta["image"]).is_file():
        errs.append(f"image not found: {meta['image']}")
    tags = meta["hashtags"].split()
    if not 1 <= len(tags) <= 4 or any(not t.startswith("#") for t in tags):
        errs.append("hashtags: 1 to 4, each starting with #")
    try:
        dt.date.fromisoformat(meta["created"])
    except ValueError:
        errs.append("created must be YYYY-MM-DD")
    first = body.splitlines()[0].strip() if body else ""
    if first != meta["hook"]:
        errs.append("first body line must equal hook")
    count = len(words(body))
    if not BODY_WORDS[0] <= count <= BODY_WORDS[1]:
        errs.append(f"body is {count} words, needs {BODY_WORDS[0]} to {BODY_WORDS[1]}")
    low = body.lower()
    for phrase in BANNED:
        if phrase in low:
            errs.append(f"banned phrase '{phrase}'")
    if "%" in body:
        errs.append("no percentages in a post body")
    for price in re.findall(r"\$[\d,]+", body):
        if price not in ctas["approved_prices"]:
            errs.append(f"price {price} is not an approved public price")
    if "#" in body or "http" in low:
        errs.append("no hashtags or links in the body; the exporter appends them")
    if len(EMOJI.findall(body)) > 2:
        errs.append("more than 2 emoji")
    return errs


def check_brief(path, meta, body, cfg):
    errs = [f"missing field '{f}'" for f in BRIEF_FIELDS if not meta.get(f)]
    if errs:
        return errs
    if meta["id"] not in cfg["topics"]:
        errs.append(f"unknown topic id '{meta['id']}'")
    if not path.name.startswith(meta["id"] + "-"):
        errs.append("filename must start with '<id>-'")
    for section in BRIEF_SECTIONS:
        if section not in body:
            errs.append(f"missing section '{section}'")
    sources = body.split("## Sources")[-1] if "## Sources" in body else ""
    urls = set(re.findall(r"https://[^\s)>\]]+", sources))
    if len(urls) < 2:
        errs.append("needs at least 2 https sources")
    facts = body.split("## What is actually going on")[-1].split("## Post angles")[0]
    if not re.search(r"\[\d+\]", facts):
        errs.append("facts section has no [n] source markers")
    angles = body.split("## Post angles")[-1].split("## What Gray Matter")[0]
    if len(re.findall(r"^\s*[-*\d]", angles, re.M)) < 5:
        errs.append("needs at least 5 post angles")
    return errs


def validate(quiet=False):
    cfg, ctas = load_json("pillars.json"), load_json("ctas.json")
    services, industries = service_slugs()
    problems = []
    posts = load_posts()
    for path, meta, body in posts:
        for err in check_post(path, meta, body, cfg, ctas, services, industries):
            problems.append(f"{rel(path)}: {err}")
    seen_hooks = {}
    sh = [(p, m, shingles(b), shingles(m.get("hook", ""), 2)) for p, m, b in posts]
    for i, (p, m, body_sh, hook_sh) in enumerate(sh):
        hook = m.get("hook", "").lower()
        if hook in seen_hooks:
            problems.append(f"{p.name}: hook duplicates {seen_hooks[hook]}")
        seen_hooks[hook] = p.name
        for q, _, other_body, other_hook in sh[:i]:
            if jaccard(body_sh, other_body) > DUP_BODY:
                problems.append(f"{p.name}: body is a near-duplicate of {q.name}")
            elif jaccard(hook_sh, other_hook) > DUP_HOOK:
                problems.append(f"{p.name}: hook is a near-duplicate of {q.name}")
    openers = {}
    for p, m, _ in posts:
        openers.setdefault(" ".join(words(m.get("hook", ""))[:3]), []).append(p.name)
    for opener, names in openers.items():
        if opener and len(names) > 2:
            problems.append(f"{len(names)} hooks open with '{opener}': {', '.join(names)}")
    briefs = load_briefs()
    for path, meta, body in briefs:
        for err in check_brief(path, meta, body, cfg):
            problems.append(f"{rel(path)}: {err}")
    if not quiet:
        for line in problems:
            print("FAIL", line)
        print(f"{len(posts)} posts, {len(briefs)} briefs, {len(problems)} problems")
    return problems


def build_index():
    posts, briefs, done = load_posts(), load_briefs(), posted_ids()
    INDEX.mkdir(exist_ok=True)
    rows = []
    for path, meta, body in posts:
        status = "posted" if meta["id"] in done else meta["status"]
        rows.append({**{k: meta.get(k, "") for k in POST_FIELDS}, "status": status,
                     "words": len(words(body)), "path": str(rel(path)),
                     "body": body})
    data = {"generated": dt.date.today().isoformat(), "posts": rows,
            "briefs": [{"id": m.get("id"), "title": m.get("title"), "pillar": m.get("pillar"),
                        "services": m.get("services"), "path": str(rel(p))}
                       for p, m, _ in briefs]}
    (INDEX / "content-index.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    out = ["# Content index", "", f"Generated {data['generated']} by `ops/tools/content.py index`.",
           "", "## Posts", "", "| ID | Status | Pillar | Topic | Service | Format | Hook |",
           "|---|---|---|---|---|---|---|"]
    for r in rows:
        out.append(f"| [{r['id']}](../posts/{r['id']}.md) | {r['status']} | {r['pillar']} | "
                   f"{r['topic']} | {r['service']} | {r['format']} | {r['hook']} |")
    out += ["", "## Research briefs", "", "| ID | Title | Pillar | Services |", "|---|---|---|---|"]
    for b in data["briefs"]:
        name = Path(b["path"]).name
        out.append(f"| [{b['id']}](../research/{name}) | {b['title']} | {b['pillar']} | {b['services']} |")
    (INDEX / "content-index.md").write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"indexed {len(rows)} posts and {len(briefs)} briefs")
    return data


def search(args):
    terms = [t.lower() for t in args.words]
    hits = 0
    for path, meta, body in load_posts() + load_briefs():
        hay = (json.dumps(meta) + " " + body).lower()
        if not all(t in hay for t in terms):
            continue
        if args.pillar and meta.get("pillar") != args.pillar:
            continue
        if args.service and args.service not in (meta.get("service", "") + meta.get("services", "")):
            continue
        if args.status and meta.get("status") != args.status:
            continue
        hits += 1
        print(f"{rel(path)}  [{meta.get('pillar')}]  {meta.get('hook') or meta.get('title')}")
    print(f"{hits} match(es)")


def caption(meta, body, ctas):
    cta = ctas["ctas"][meta["cta"]]
    cta = cta.replace("{service_url}", f"{ctas['site']}/services/{meta['service']}.html")
    cta = cta.replace("{question}", meta.get("cta_question", ""))
    return body, cta, meta["hashtags"]


def pick_queue(posts, done, days, include_drafts):
    """Round-robin across pillars so consecutive days never repeat a pillar or topic."""
    ok = {"approved", "queued"} | ({"draft"} if include_drafts else set())
    pool = [(m, b) for _, m, b in posts if m["status"] in ok and m["id"] not in done]
    by_pillar = {}
    for item in pool:
        by_pillar.setdefault(item[0]["pillar"], []).append(item)
    order, queue, used_topics = sorted(by_pillar), [], []
    i = 0
    while len(queue) < days and any(by_pillar.values()):
        bucket = by_pillar[order[i % len(order)]]
        i += 1
        if not bucket:
            continue
        recent = used_topics[-3:]
        choice = min(bucket, key=lambda x: (used_topics.count(x[0]["topic"]), x[0]["topic"] in recent))
        bucket.remove(choice)
        queue.append(choice)
        used_topics.append(choice[0]["topic"])
    return queue


def export_muse(args):
    problems = validate(quiet=True)
    if problems:
        sys.exit(f"refusing to export: {len(problems)} validation problem(s). Run validate.")
    ctas, posts = load_json("ctas.json"), load_posts()
    queue = pick_queue(posts, posted_ids(), args.days, args.include_drafts)
    if not queue:
        sys.exit("nothing to export: no approved, unposted posts (use --include-drafts for a review queue)")
    start = dt.date.fromisoformat(args.start)
    unapproved = sum(1 for m, _ in queue if m["status"] == "draft")
    state = ("APPROVAL QUEUE. Contains drafts the owner has not approved. Do not publish."
             if unapproved else "Approved by the owner in GitHub. Confirm schedule before publishing.")
    items, caps = [], [
        "# GRAY MATTER — FACEBOOK DAILY CAPTIONS", "",
        f"**Status:** {state}  ",
        "**Source of truth:** GitHub `ops/marketing/posts/` (this file is generated; do not edit it here).  ",
        f"**Sequence:** Day 1 through Day {len(queue)}, one post per day starting {start:%a %b %d, %Y}. "
        "Dates are suggestions, not a scheduled automation.", "",
        "## Platform CTA rules", "",
        "- **Facebook:** post the caption, then the Facebook CTA as its own paragraph, then the hashtags.",
        "- Use the caption exactly as written. Do not add statistics, prices, claims or emoji.", ""]
    for n, (meta, body) in enumerate(queue, 1):
        day = start + dt.timedelta(days=n - 1)
        text, cta, tags = caption(meta, body, ctas)
        image = Path(meta["image"]).name
        items.append({"day": n, "date": day.isoformat(), "id": meta["id"], "status": meta["status"],
                      "platform": "facebook", "pillar": meta["pillar"], "topic": meta["topic"],
                      "image": image, "image_repo_path": meta["image"], "caption": text,
                      "cta": cta, "hashtags": tags,
                      "full_text": f"{text}\n\n{cta}\n\n{tags}"})
        caps += ["---", "", f"## Day {n} — {meta['hook']}", "",
                 f"**Post ID:** `{meta['id']}`  ", f"**Image:** `{image}`  ",
                 f"**Suggested date:** {day:%a %b %d, %Y}  ",
                 f"**Approval:** {'approved' if meta['status'] != 'draft' else 'NOT YET APPROVED'}", "",
                 "### Post caption", "", text, "",
                 f"**Facebook CTA:** {cta}  ", f"**Hashtags:** {tags}", ""]
    images = sorted({i["image"] for i in items})
    flow = [
        "# GRAY MATTER — MUSE SOCIAL POSTING WORKFLOW", "",
        f"**Status:** {state}  ",
        "**Owner:** Gray Matter LLC. **Channel:** the Gray Matter Facebook page.  ",
        "**Captions:** `README_DAILY_CAPTIONS.md` in this folder. **Machine-readable copy:** `queue.json`.", "",
        "## Purpose", "",
        f"Post {len(queue)} Facebook posts, one per day, in Day order. Each post pairs one caption with one "
        "approved Gray Matter image from this folder. The goal is inquiries from small-business owners "
        "through the Gray Matter website.", "",
        "## Required setup", "",
        "1. Confirm Muse is connected to the Gray Matter Facebook page, not a personal profile or another page.",
        "2. Confirm every image listed below is present in this folder.",
        "3. Confirm the start date, daily time and time zone (America/Chicago) with the owner.",
        "4. Show the owner a preview of every post (image, caption, date) and get approval before "
        "unattended publishing. Any entry marked NOT YET APPROVED must be approved individually.", "",
        "## Images used", ""] + [f"- `{name}`" for name in images] + ["",
        "## Daily workflow", "",
        "1. Check the Facebook page for that day's Post ID or caption. Never double-post.",
        "2. Use the matching image unchanged: no cropping, filters, AI edits or new logos.",
        "3. Publish caption, then CTA paragraph, then hashtags, exactly as written.",
        "4. Record Post ID, date and time, post URL and outcome. Report failures; do not blindly retry.",
        "5. Send the record back so `ops/marketing/posted-log.csv` can be updated in GitHub. "
        "Posts in that log are never queued again.", "",
        "## Safeguards", "",
        "- Do not invent statistics, prices, client names, testimonials or results.",
        "- Prices may only appear as written in the caption.",
        "- Do not edit, rename or delete files in this folder. It is regenerated from GitHub.",
        "- If a link fails to open, pause that post and report it.", "",
        "## Definition of done", "",
        f"- {len(queue)} posts published in order, one per day, each with its matching image.",
        "- No duplicates. A post URL recorded for every Post ID.", ""]
    MUSE.mkdir(exist_ok=True)
    (MUSE / "README_MUSE_WORKFLOW.md").write_text("\n".join(flow), encoding="utf-8")
    (MUSE / "README_DAILY_CAPTIONS.md").write_text("\n".join(caps), encoding="utf-8")
    (MUSE / "queue.json").write_text(json.dumps(
        {"generated": dt.date.today().isoformat(), "start": start.isoformat(),
         "approved": unapproved == 0, "images": images, "posts": items}, indent=2) + "\n",
        encoding="utf-8")
    print(f"exported {len(queue)} posts ({unapproved} unapproved) to {rel(MUSE)}")


def set_status(ids, status):
    for post_id in ids:
        path = POSTS / f"{post_id}.md"
        if not path.exists():
            sys.exit(f"no such post: {post_id}")
        text = path.read_text(encoding="utf-8")
        path.write_text(re.sub(r"^status:.*$", f"status: {status}", text, count=1, flags=re.M),
                        encoding="utf-8")
        print(f"{post_id} -> {status}")


def mark_posted(args):
    new = not POSTED_LOG.exists()
    if args.id in posted_ids():
        sys.exit(f"{args.id} is already in the posted log")
    with POSTED_LOG.open("a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if new:
            writer.writerow(["id", "platform", "date", "url"])
        writer.writerow([args.id, "facebook", args.date, args.url])
    set_status([args.id], "posted")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("validate")
    sub.add_parser("index")
    s = sub.add_parser("search")
    s.add_argument("words", nargs="*")
    s.add_argument("--pillar")
    s.add_argument("--service")
    s.add_argument("--status")
    e = sub.add_parser("export-muse")
    e.add_argument("--start", required=True)
    e.add_argument("--days", type=int, default=14)
    e.add_argument("--include-drafts", action="store_true")
    a = sub.add_parser("approve")
    a.add_argument("ids", nargs="+")
    m = sub.add_parser("mark-posted")
    m.add_argument("id")
    m.add_argument("--date", required=True)
    m.add_argument("--url", required=True)
    args = ap.parse_args()
    if args.cmd == "validate":
        sys.exit(1 if validate() else 0)
    elif args.cmd == "index":
        build_index()
    elif args.cmd == "search":
        search(args)
    elif args.cmd == "export-muse":
        export_muse(args)
    elif args.cmd == "approve":
        set_status(args.ids, "approved")
    elif args.cmd == "mark-posted":
        mark_posted(args)


if __name__ == "__main__":
    main()
