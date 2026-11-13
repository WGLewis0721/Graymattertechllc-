# App Starter | Validation

Install Pillow (the renderer dependency): `python3 -m pip install -r app-starter/scripts/requirements-design.txt`. The tests cover real PNG/SVG exports, exact screen inventories, native iOS, pre-build source registers, screenshot upgrades, before/after comparisons and correction tracking.

## Generator regression tests

From the business repository checkout:

~~~bash
bash -n app-starter/scripts/new-app.sh
python3 -m unittest discover -s app-starter/tests -p 'test_*.py' -v
~~~

The tests cover exact named-screen scaffolding for a website, unchanged native iOS support, duplicate screen rejection, invalid website/iOS combinations, incomplete brief/design gate failures, successful structural gates given simulated evidence, missing implementation and silent removal of a requested page.

The parent repository workflow .github/workflows/app-starter-validation.yml runs these checks on changes to the generator and templates.

## Per-product stages

~~~bash
python3 scripts/check-design.py --stage plan
python3 scripts/check-design.py --stage design
python3 scripts/check-design.py --stage build
python3 scripts/check-design.py --stage release
~~~

The generated GitHub workflow tests the design stage for PRs and main-branch pushes. The repository owner must configure branch protection separately to prevent bypassing it.

**Limits:** The structural checker confirms documented files and evidence paths, not image quality, accurate business facts, reachable routes, payment correctness or functioning interactions. Simulated test artifacts used by this repository's regression tests are not proof of a generated client's product.

For real products, separately run npm builds/tests and browser E2E checks, or Xcode/XCTest and physical-device UI/accessibility checks. This repository change does **not** establish App Store acceptance, a deployed product or production readiness.
