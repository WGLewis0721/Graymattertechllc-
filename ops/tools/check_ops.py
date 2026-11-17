#!/usr/bin/env python3
"""Contract check for the whole ops system. Exit 1 on any problem.

  python3 ops/tools/check_ops.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OPS = ROOT / "ops"
KIT_SECTIONS = ["## Who it is for", "## Fit check", "## Scope included", "## Scope excluded",
                "## Client inputs", "## Default stack", "## Build steps", "## QA checklist",
                "## Handoff", "## Maintenance option"]
REQUIRED_TEMPLATES = ["DISCOVERY_CALL", "PROPOSAL", "ESTIMATE", "QUOTE", "INVOICE", "ONBOARDING",
                      "QA_CHECKLIST", "HANDOFF", "MAINTENANCE_PLAN", "CHANGE_REQUEST", "CLOSEOUT"]
REQUIRED_KITS = ["website", "automation", "business-security", "cloud-access", "backup-recovery",
                 "tech-checkup", "cost-cleanup", "process-docs", "ai-command-center"]
LEAD_FIELDS = {"business_name", "first_name", "sender_name", "subject_hook", "problem_short",
               "observation", "suggestion", "free_tip", "proposed_time"}
PRIVATE_DIRS = ["ops/leads/private/", "ops/delivery/private/"]


def sections(text):
    return [line.strip() for line in text.splitlines() if line.startswith("## ")]


def check_kits(problems):
    book = json.loads((OPS / "delivery" / "price-book.json").read_text())["items"]
    services = set(re.findall(r"url: 'services/([a-z0-9-]+)\.html'", (ROOT / "js" / "data.js").read_text()))
    found = {p.parent.name for p in (OPS / "delivery" / "starter-kits").glob("*/kit.json")}
    for kit_id in REQUIRED_KITS:
        if kit_id not in found:
            problems.append(f"kit missing: {kit_id}")
    for path in sorted((OPS / "delivery" / "starter-kits").glob("*/kit.json")):
        where = path.parent.relative_to(ROOT)
        try:
            k = json.loads(path.read_text())
        except json.JSONDecodeError as e:
            problems.append(f"{where}/kit.json: {e}")
            continue
        if k.get("id") != path.parent.name:
            problems.append(f"{where}: id must equal folder name")
        if k.get("service") not in services:
            problems.append(f"{where}: unknown service {k.get('service')}")
        for line in k.get("default_lines", []):
            if line.get("item") not in book:
                problems.append(f"{where}: item {line.get('item')} not in price book")
        if not k.get("default_lines"):
            problems.append(f"{where}: no default_lines")
        for ref in k.get("reuses", []):
            if not (ROOT / ref).exists():
                problems.append(f"{where}: reuses missing path {ref}")
        md = path.parent / "KIT.md"
        if not md.exists():
            problems.append(f"{where}: KIT.md missing")
            continue
        text = md.read_text()
        got = [s for s in sections(text) if s in KIT_SECTIONS]
        if got != KIT_SECTIONS:
            problems.append(f"{where}/KIT.md: sections must be, in order: {', '.join(KIT_SECTIONS)}")
        qa = text.split("## QA checklist")[-1].split("## Handoff")[0]
        if len(re.findall(r"^- \[ \] ", qa, re.M)) < 5:
            problems.append(f"{where}/KIT.md: QA checklist needs at least 5 '- [ ]' items")
        for ref in sorted(set(re.findall(r"`([A-Z_]+\.md)`", text))):
            if not (path.parent / ref).exists() and not list(ROOT.glob(f"**/{ref}")):
                problems.append(f"{where}/KIT.md: references {ref}, which does not exist")


def check_templates(problems):
    tdir = OPS / "delivery" / "templates"
    allowed = set(re.findall(r"\{\{(\w+)\}\}", (tdir / "FIELDS.md").read_text()))
    for name in REQUIRED_TEMPLATES:
        path = tdir / f"{name}.md"
        if not path.exists():
            problems.append(f"template missing: {name}.md")
            continue
        for field in set(re.findall(r"\{\{(\w+)\}\}", path.read_text())) - allowed:
            problems.append(f"{path.relative_to(ROOT)}: field {{{{{field}}}}} not defined in FIELDS.md")


def check_outreach(problems):
    for path in sorted((OPS / "leads" / "outreach").glob("*.md")):
        text = path.read_text()
        for field in set(re.findall(r"\{\{(\w+)\}\}", text)) - LEAD_FIELDS:
            problems.append(f"{path.relative_to(ROOT)}: unknown field {{{{{field}}}}}")
        if "channel: email" in text and 'Reply "stop"' not in text and "Closing the loop" not in text:
            problems.append(f"{path.relative_to(ROOT)}: email needs an opt-out line")
        if "channel: email" in text and "Gray Matter" not in text:
            problems.append(f"{path.relative_to(ROOT)}: email must identify Gray Matter")


def check_private(problems):
    ignore = (OPS / ".gitignore").read_text()
    for d in PRIVATE_DIRS:
        if d.replace("ops/", "") not in ignore:
            problems.append(f"ops/.gitignore must ignore {d}")
    try:
        tracked = subprocess.run(["git", "ls-files", *PRIVATE_DIRS], cwd=ROOT, capture_output=True,
                                 text=True, check=True).stdout.split()
    except (OSError, subprocess.CalledProcessError):
        tracked = []
    for t in tracked:
        problems.append(f"private file is tracked by git: {t}")


def main():
    problems = []
    check_kits(problems)
    check_templates(problems)
    check_outreach(problems)
    check_private(problems)
    sys.path.insert(0, str(Path(__file__).parent))
    import content  # noqa: PLC0415
    problems += [f"content: {p}" for p in content.validate(quiet=True)]
    for p in problems:
        print("FAIL", p)
    print(f"ops check: {len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
