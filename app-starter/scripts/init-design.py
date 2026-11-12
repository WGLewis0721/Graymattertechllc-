#!/usr/bin/env python3
"""Scaffold a product's design contract; this does not generate completed designs."""
import argparse
import json
import re
from pathlib import Path

MARKER = "[[FILL]]"


def screen_list(raw):
    names = [part.strip() for part in raw.split(",")]
    if not names or any(not name for name in names):
        raise ValueError("Screen names must be nonempty, comma-separated labels")
    if len(names) > 30:
        raise ValueError("At most 30 screens per product; split larger projects into scopes")
    result = []
    seen = set()
    for name in names:
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9 &_-]{0,63}", name):
            raise ValueError(f"Invalid screen name {name!r}; use letters, digits, spaces, &, - or _")
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        if slug in seen:
            raise ValueError(f"Duplicate screen ID {slug!r}: rename duplicate screens")
        seen.add(slug)
        result.append((slug, name))
    return result


def render(template, name, platform, kind, screen_name=""):
    return (template.replace("{{PRODUCT}}", name)
            .replace("{{PLATFORM}}", platform)
            .replace("{{KIND}}", kind)
            .replace("{{SCREEN}}", screen_name))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--screens", required=True, help="Comma-separated exact screen/page names")
    parser.add_argument("--name", required=True)
    parser.add_argument("--platform", choices=("web", "ios"), required=True)
    parser.add_argument("--kind", choices=("app", "website"), default="app")
    parser.add_argument("--check-only", action="store_true")
    parser.add_argument("--dest", type=Path)
    parser.add_argument("--templates", type=Path)
    args = parser.parse_args()
    try:
        screens = screen_list(args.screens)
    except ValueError as exc:
        parser.error(str(exc))
    if args.kind == "website" and args.platform != "web":
        parser.error("Websites require the web platform. Use --kind app for native iOS")
    if args.check_only:
        print(f"Valid {args.platform} {args.kind}: {len(screens)} named screens")
        return
    if not args.dest or not args.templates:
        parser.error("--dest and --templates are required except with --check-only")
    dest = args.dest.resolve()
    design = dest / "design"
    if design.exists():
        parser.error("Destination already has a design folder; refusing to overwrite")
    (design / "screens").mkdir(parents=True)
    for template, target in (
        ("BRAND_BOARD.md", "BRAND_BOARD.md"),
        ("UI_KIT.md", "UI_KIT.md"),
        ("SCREEN_MAP.md", "SCREEN_MAP.md"),
        ("DESIGN_QA.md", "QA.md"),
    ):
        content = (args.templates / template).read_text(encoding="utf-8")
        (design / target).write_text(render(content, args.name, args.platform, args.kind), encoding="utf-8")

    brief_name = "WEBSITE_BRIEF.md" if args.kind == "website" else "PROJECT_BRIEF.md"
    brief_body = (args.templates / brief_name).read_text(encoding="utf-8")
    (design / "BRIEF.md").write_text(
        "<!-- [[FILL]] Complete and approve this brief before design starts. -->\n"
        + brief_body.replace("[APP NAME]", args.name).replace("[BUSINESS / PROJECT]", args.name),
        encoding="utf-8")
    spec = (args.templates / "SCREEN_SPEC.md").read_text(encoding="utf-8")
    inventory = {
        "schema_version": 1,
        "project": args.name,
        "kind": args.kind,
        "platform": args.platform,
        "brand_board_proofs": [],
        "ui_kit_proofs": [],
        "ui_kit_implementation_files": [],
        "release_evidence": [],
        "screens": [],
    }
    for slug, label in screens:
        path = design / "screens" / f"{slug}.md"
        path.write_text(render(spec, args.name, args.platform, args.kind, label), encoding="utf-8")
        inventory["screens"].append({
            "id": slug,
            "name": label,
            "purpose": MARKER,
            "route_or_destination": MARKER,
            "spec": f"design/screens/{slug}.md",
            "design_proofs": [],
            "implementation_files": [],
            "test_evidence": [],
            "status": "planned",
        })
    (design / "screens.json").write_text(json.dumps(inventory, indent=2) + "\n", encoding="utf-8")
    print(f"Scaffolded design contract for {len(screens)} required screens in {design}")


if __name__ == "__main__":
    main()
