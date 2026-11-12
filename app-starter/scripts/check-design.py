#!/usr/bin/env python3
"""Structural gates for required design artifacts. Not a substitute for visual/human or automated app tests."""
import argparse
import json
import re
import sys
from pathlib import Path

MARKER = "[[FILL]]"
STATUSES = ["planned", "designed", "implemented", "verified"]


def audit(root: Path, stage: str):
    errors = []
    design = root / "design"

    def read(rel):
        path = root / rel
        if not path.is_file():
            errors.append(f"Missing required file: {rel}")
            return None
        try:
            return path.read_text(encoding="utf-8")
        except UnicodeError:
            errors.append(f"Unreadable UTF-8 file: {rel}")
            return None

    def proof(rel, label):
        if not isinstance(rel, str) or not rel.strip():
            errors.append(f"Invalid file reference for {label}")
            return
        path = (root / rel).resolve()
        if not path.is_relative_to(root) or not path.is_file() or path.stat().st_size == 0:
            errors.append(f"Missing, empty or out-of-project {label}: {rel}")

    raw = read("design/screens.json")
    if raw is None:
        return errors
    try:
        manifest = json.loads(raw)
    except json.JSONDecodeError as exc:
        return [f"Invalid design/screens.json: {exc}"]
    if not isinstance(manifest, dict) or manifest.get("schema_version") != 1:
        return ["design/screens.json must be a version 1 object"]
    if not isinstance(manifest.get("screens"), list) or not manifest["screens"]:
        return ["design/screens.json must list at least one screen"]

    for rel in ("design/BRAND_BOARD.md", "design/UI_KIT.md", "design/SCREEN_MAP.md", "design/QA.md"):
        body = read(rel)
        if stage != "plan" and rel != "design/QA.md" and body is not None:
            if MARKER in body:
                errors.append(f"Incomplete required design document: {rel}")
    if stage == "release":
        qa = read("design/QA.md")
        if qa is not None and (MARKER in qa or "- [ ]" in qa):
            errors.append("design/QA.md must explain completed or N/A checks; it still has open items")

    if stage != "plan":
        for key in ("brand_board_proofs", "ui_kit_proofs"):
            values = manifest.get(key)
            if not isinstance(values, list) or not values:
                errors.append(f"{key} requires at least one actual visual artifact")
            else:
                for file in values:
                    proof(file, key)
    if stage in ("build", "release"):
        sources = manifest.get("ui_kit_implementation_files")
        if not isinstance(sources, list) or not sources:
            errors.append("ui_kit_implementation_files must list real shared component/token source files")
        else:
            for file in sources:
                proof(file, "ui_kit_implementation_files")
    if stage == "release":
        ev = manifest.get("release_evidence")
        if not isinstance(ev, list) or not ev:
            errors.append("release_evidence must contain real build, test and accessibility records")
        else:
            for file in ev:
                proof(file, "release_evidence")

    ids = set()
    names = set()
    for i, item in enumerate(manifest["screens"], 1):
        if not isinstance(item, dict):
            errors.append(f"Screen #{i} must be an object")
            continue
        sid = item.get("id")
        name = item.get("name")
        if not isinstance(sid, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", sid):
            errors.append(f"Screen #{i} needs a safe lowercase ID")
            continue
        if sid in ids:
            errors.append(f"Duplicate screen ID: {sid}")
        ids.add(sid)
        if not isinstance(name, str) or not name.strip() or name in names:
            errors.append(f"Invalid or duplicate screen name at #{i}")
        else:
            names.add(name)
        spec = item.get("spec")
        if spec != f"design/screens/{sid}.md":
            errors.append(f"Screen {sid}: spec must be design/screens/{sid}.md")
        else:
            content = read(spec)
            if stage != "plan" and content is not None and MARKER in content:
                errors.append(f"Screen {sid}: incomplete specification")
        if stage != "plan":
            for key in ("purpose", "route_or_destination"):
                value = item.get(key)
                if not isinstance(value, str) or not value.strip() or MARKER in value:
                    errors.append(f"Screen {sid}: missing {key}")
            proofs = item.get("design_proofs")
            if not isinstance(proofs, list) or not proofs:
                errors.append(f"Screen {sid}: needs a visual screen design proof")
            else:
                for file in proofs:
                    proof(file, f"screen {sid} design_proofs")
        status = item.get("status")
        if status not in STATUSES:
            errors.append(f"Screen {sid}: invalid status {status!r}")
        elif STATUSES.index(status) < STATUSES.index({"plan":"planned","design":"designed","build":"implemented","release":"verified"}[stage]):
            errors.append(f"Screen {sid}: {status} is below {stage} gate")
        if stage in ("build", "release"):
            source_files = item.get("implementation_files")
            if not isinstance(source_files, list) or not source_files:
                errors.append(f"Screen {sid}: implementation_files must list real source files")
            else:
                for file in source_files:
                    proof(file, f"screen {sid} implementation_files")
        if stage == "release":
            ev = item.get("test_evidence")
            if not isinstance(ev, list) or not ev:
                errors.append(f"Screen {sid}: no tested navigation/interaction evidence")
            else:
                for file in ev:
                    proof(file, f"screen {sid} test_evidence")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--stage", choices=("plan", "design", "build", "release"), default="design")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()
    root = args.root.resolve()
    errors = audit(root, args.stage)
    if errors:
        print(f"FAIL {args.stage.upper()} gate ({len(errors)} issue(s)):")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    print(f"PASS {args.stage.upper()} structural gate. This does NOT prove visual quality, runtime behavior or release readiness.")


if __name__ == "__main__":
    main()
