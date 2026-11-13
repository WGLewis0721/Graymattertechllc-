#!/usr/bin/env python3
"""Register a corrective-action ticket with a dedicated spec; open issues block release."""
import argparse
import json
import re
from pathlib import Path


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', type=Path, default=Path.cwd())
    p.add_argument('--id', required=True)
    p.add_argument('--screen', required=True)
    p.add_argument('--problem', required=True)
    p.add_argument('--evidence', required=True, help='Project-relative screenshot/video/test path')
    args = p.parse_args()
    root = args.root.resolve()
    ticket = args.id.lower()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', ticket):
        p.error('ID must be lowercase kebab-case')
    evidence = (root / args.evidence).resolve()
    if not evidence.is_relative_to(root) or not evidence.is_file():
        p.error('Evidence file must already exist inside the project')
    registry = root/'design/corrections.json'
    if not registry.exists():
        p.error('Missing design/corrections.json; initialize project first')
    data = json.loads(registry.read_text())
    if any(i.get('id') == ticket for i in data['issues']):
        p.error('A correction with this ID already exists')
    screens = json.loads((root/'design/screens.json').read_text())['screens']
    if args.screen not in [s['id'] for s in screens]:
        p.error('Screen ID is not in the requested inventory')
    relative = f'design/corrections/{ticket}.md'
    spec = root / relative
    spec.parent.mkdir(parents=True, exist_ok=True)
    spec.write_text(f'''# Correction {ticket} | {args.screen}

Status: Open

## Observed defect
{args.problem}

## Evidence
{args.evidence}

## Expected behavior and approved reference
[[FILL]]

## Root cause and options considered
[[FILL]]

## Proposed targeted fix and affected files
[[FILL]]

## Implementation and rollback
[[FILL]]

## Verification: before/after, regression and device evidence
[[FILL]]

## Approval and closeout
[[FILL]]
''')
    data['issues'].append({'id':ticket,'screen_id':args.screen,'problem':args.problem,
                           'spec':relative,'status':'open','observed_evidence':[args.evidence],
                           'changed_files':[],'regression_evidence':[], 'reviewer_approval':''})
    registry.write_text(json.dumps(data, indent=2)+'\n')
    print(f'Opened correction {ticket}: {relative}. Release remains blocked until verified/closed.')


if __name__ == '__main__':
    main()
