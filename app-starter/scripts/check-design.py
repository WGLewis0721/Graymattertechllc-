#!/usr/bin/env python3
"""Conservative structural gates for research, wireframes, build and corrective QA."""
import argparse
import json
import re
import sys
from pathlib import Path

MARKER = '[[FILL]]'
STATUSES = ['planned', 'designed', 'implemented', 'verified']
IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.html', '.pdf'}


def audit(root: Path, stage: str):
    errors = []

    def read(rel):
        path = root / rel
        if not path.is_file():
            errors.append(f'Missing required file: {rel}')
            return None
        try:
            return path.read_text(encoding='utf-8')
        except UnicodeError:
            errors.append(f'Unreadable text file: {rel}')
            return None

    def load_json(rel):
        content = read(rel)
        if content is None:
            return None
        try:
            return json.loads(content)
        except json.JSONDecodeError as exc:
            errors.append(f'Invalid JSON: {rel}: {exc}')
            return None

    def proof(rel, label, visual=False):
        if not isinstance(rel, str) or not rel.strip():
            errors.append(f'Invalid {label} reference')
            return
        target = (root / rel).resolve()
        if not target.is_relative_to(root) or not target.is_file() or target.stat().st_size == 0:
            errors.append(f'Missing, empty or out-of-project {label}: {rel}')
            return
        if visual and target.suffix.lower() not in IMAGE_EXTS:
            errors.append(f'Visual {label} must be image/SVG/HTML/PDF: {rel}')
        if target.suffix.lower() == '.png' and target.read_bytes()[:8] != b'\x89PNG\r\n\x1a\n':
            errors.append(f'Invalid PNG signature for {label}: {rel}')

    def refs(values, label, visual=False, required=True):
        if not isinstance(values, list) or (required and not values):
            errors.append(f'{label} requires valid evidence path(s)')
        else:
            for v in values:
                proof(v, label, visual=visual)

    manifest = load_json('design/screens.json')
    if not isinstance(manifest, dict) or manifest.get('schema_version') != 1:
        return errors + ['design/screens.json must contain a schema version 1 object']
    screens = manifest.get('screens')
    if not isinstance(screens, list) or not screens:
        return errors + ['At least one screen is required']
    requested = load_json('design/requested-screens.json')
    if isinstance(requested, dict):
        actual = [{'id': s.get('id'), 'name': s.get('name')} for s in screens if isinstance(s, dict)]
        if requested.get('requested') != actual:
            errors.append('Screen inventory drifted from design/requested-screens.json; restore it or document owner-approved scope change')
    else:
        errors.append('Original requested screen list missing or invalid')
    mode = manifest.get('mode', 'new')
    if mode not in ('new', 'upgrade'):
        errors.append('Invalid project mode')

    for rel in ('design/BRIEF.md', 'design/PREBUILD_PLAN.md', 'design/REFERENCES.md'):
        body = read(rel)
        if body is not None and MARKER in body:
            errors.append(f'Incomplete pre-build spec or research document: {rel}')
    register = load_json('design/references.json')
    if not isinstance(register, dict) or not isinstance(register.get('sources'), list) or not register['sources']:
        errors.append('design/references.json requires at least one documented source/inspiration')
    else:
        for index, source in enumerate(register['sources'], 1):
            if not isinstance(source, dict):
                errors.append(f'Reference #{index} is not an object')
                continue
            for key in ('title', 'category', 'why_use', 'what_not_to_copy', 'license_or_terms', 'checked_on'):
                if not isinstance(source.get(key), str) or not source[key].strip() or MARKER in source[key]:
                    errors.append(f'Reference #{index} missing {key}')
            url = source.get('url')
            local = source.get('path')
            if isinstance(url, str) and re.match(r'^https?://[^\s]+$', url):
                pass
            elif isinstance(local, str) and local:
                proof(local, f'reference #{index}')
            else:
                errors.append(f'Reference #{index} needs original HTTPS URL or local source path')
            if source.get('inspected') is not True:
                errors.append(f'Reference #{index} must be inspected before plan approval')

    if mode == 'upgrade':
        audit_text = read('design/UPGRADE_AUDIT.md')
        if audit_text is not None and MARKER in audit_text:
            errors.append('Upgrade audit must document source code and screenshot limitations')
        refs(manifest.get('baseline_screenshots'), 'baseline_screenshots', visual=True)

    for rel in ('design/BRAND_BOARD.md', 'design/UI_KIT.md', 'design/SCREEN_MAP.md', 'design/QA.md',
                'design/CORRECTIVE_ACTION.md'):
        body = read(rel)
        if stage != 'plan' and rel not in ('design/QA.md', 'design/CORRECTIVE_ACTION.md') and body is not None and MARKER in body:
            errors.append(f'Incomplete required design document: {rel}')
    if stage == 'release':
        qa = read('design/QA.md')
        if qa is not None and (MARKER in qa or '- [ ]' in qa):
            errors.append('design/QA.md contains unreviewed acceptance requirements')

    if stage != 'plan':
        refs(manifest.get('brand_board_proofs'), 'brand_board_proofs', visual=True)
        refs(manifest.get('ui_kit_proofs'), 'ui_kit_proofs', visual=True)
    if stage in ('build', 'release'):
        refs(manifest.get('ui_kit_implementation_files'), 'ui_kit_implementation_files')
    if stage == 'release':
        refs(manifest.get('release_evidence'), 'release_evidence')
        if mode == 'upgrade':
            refs(manifest.get('after_screenshots'), 'after_screenshots', visual=True)
            refs(manifest.get('comparison_images'), 'comparison_images', visual=True)

    seen_ids = set()
    seen_names = set()
    visual_proofs = set()
    for i, s in enumerate(screens, 1):
        if not isinstance(s, dict):
            errors.append(f'Screen #{i} is not an object')
            continue
        sid, name = s.get('id'), s.get('name')
        if not isinstance(sid, str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', sid):
            errors.append(f'Screen #{i} needs safe lowercase ID')
            continue
        if sid in seen_ids:
            errors.append(f'Duplicate screen ID: {sid}')
        seen_ids.add(sid)
        if not isinstance(name, str) or not name.strip() or name in seen_names:
            errors.append(f'Invalid or duplicate screen name: {sid}')
        seen_names.add(name)
        spec = f'design/screens/{sid}.md'
        if s.get('spec') != spec:
            errors.append(f'Screen {sid}: incorrect spec path')
        body = read(spec)
        if stage != 'plan' and body is not None and MARKER in body:
            errors.append(f'Screen {sid}: incomplete specification')

        # Draft wireframes are real generated artifacts but do not count as approved design proofs.
        wire = load_json(f'design/wireframes/{sid}.json')
        if not isinstance(wire, dict) or wire.get('screen_id') != sid or not isinstance(wire.get('sections'), list):
            errors.append(f'Screen {sid}: missing structured wireframe source')
        for size in ('desktop', 'mobile'):
            for ext in ('png', 'svg'):
                path = f'design/wireframes/exports/{sid}-{size}.{ext}'
                proof(path, f'wireframe {sid} {size}', visual=True)
        status = s.get('status')
        if status not in STATUSES or STATUSES.index(status) < STATUSES.index(
                {'plan':'planned','design':'designed','build':'implemented','release':'verified'}[stage]):
            errors.append(f'Screen {sid}: status {status!r} below {stage} gate')
        if stage != 'plan':
            for key in ('purpose', 'route_or_destination'):
                val = s.get(key)
                if not isinstance(val, str) or not val.strip() or MARKER in val:
                    errors.append(f'Screen {sid}: missing {key}')
            proofs = s.get('design_proofs')
            refs(proofs, f'screen {sid} design_proofs', visual=True)
            if isinstance(proofs, list):
                for file in proofs:
                    if isinstance(file, str) and file in visual_proofs:
                        errors.append(f'Screen {sid}: duplicate screen design proof {file}')
                    if isinstance(file, str):
                        visual_proofs.add(file)
        if stage in ('build', 'release'):
            refs(s.get('implementation_files'), f'screen {sid} implementation_files')
        if stage == 'release':
            refs(s.get('test_evidence'), f'screen {sid} test_evidence')
            if mode == 'upgrade' and s.get('existing_page'):
                refs(s.get('after_screenshots'), f'screen {sid} after_screenshots', visual=True)
                refs(s.get('comparison_images'), f'screen {sid} comparison_images', visual=True)

    corrections = load_json('design/corrections.json')
    if not isinstance(corrections, dict) or not isinstance(corrections.get('issues'), list):
        errors.append('Missing correction register: design/corrections.json')
    else:
        ids = set()
        for i, issue in enumerate(corrections['issues'], 1):
            if not isinstance(issue, dict) or not issue.get('id') or issue['id'] in ids:
                errors.append(f'Invalid or duplicate correction #{i}')
                continue
            ids.add(issue['id'])
            spec = issue.get('spec', '')
            if not isinstance(spec, str) or not spec.startswith('design/corrections/'):
                errors.append(f'Invalid correction spec for {issue["id"]}')
                continue
            content = read(spec)
            refs(issue.get('observed_evidence'), f'correction {issue["id"]} observed_evidence')
            if stage == 'release':
                if issue.get('status') != 'closed':
                    errors.append(f'Unresolved correction blocks release: {issue["id"]}')
                else:
                    if not isinstance(content, str) or MARKER in content:
                        errors.append(f'Closed correction still has incomplete spec: {issue["id"]}')
                    refs(issue.get('changed_files'), f'correction {issue["id"]} changed_files')
                    refs(issue.get('regression_evidence'), f'correction {issue["id"]} regression_evidence')
                    if not isinstance(issue.get('reviewer_approval'), str) or len(issue['reviewer_approval'].strip()) < 5:
                        errors.append(f'Closed correction missing reviewer approval: {issue["id"]}')
    return errors


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--stage', choices=('plan','design','build','release'), default='design')
    p.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
    args = p.parse_args()
    errors = audit(args.root.resolve(), args.stage)
    if errors:
        print(f'FAIL {args.stage.upper()} gate ({len(errors)} issue(s))')
        for error in errors:
            print('  -', error)
        sys.exit(1)
    print(f'PASS {args.stage.upper()} structural gate. Manual visual and functional verification remain required.')


if __name__ == '__main__':
    main()
