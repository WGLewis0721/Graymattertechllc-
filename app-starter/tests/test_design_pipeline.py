"""Offline regression tests for the design deliverables generator and structural gates."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
STARTER = REPO / "app-starter"
GEN = STARTER / "scripts" / "new-app.sh"
CHECK = STARTER / "scripts" / "check-design.py"


class DesignWorkflowTests(unittest.TestCase):
    def invoke(self, *args):
        return subprocess.run(args, text=True, capture_output=True, cwd=REPO)

    def test_rejects_duplicates_before_writing(self):
        with tempfile.TemporaryDirectory() as td:
            result = self.invoke("bash", str(GEN), "web", "MyApp", td,
                                 "--screens", "Home, home")
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Duplicate screen ID", result.stderr)
            self.assertFalse((Path(td) / "MyApp").exists())

    def test_rejects_invalid_website_platform(self):
        with tempfile.TemporaryDirectory() as td:
            result = self.invoke("bash", str(GEN), "ios", "MyApp", td,
                                 "--kind", "website", "--screens", "Home")
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((Path(td) / "MyApp").exists())

    def test_web_full_gates_and_missing_screen(self):
        with tempfile.TemporaryDirectory() as td:
            res = self.invoke("bash", str(GEN), "web", "DemoWeb", td,
                              "--kind", "website", "--screens", "Home,Menu,Ordering,Events,Contact")
            self.assertEqual(res.returncode, 0, res.stderr)
            dest = Path(td) / "DemoWeb"
            manifest_path = dest / "design/screens.json"
            manifest = json.loads(manifest_path.read_text())
            self.assertEqual([v["name"] for v in manifest["screens"]],
                             ["Home", "Menu", "Ordering", "Events", "Contact"])
            self.assertTrue((dest / ".github/workflows/design-gates.yml").is_file())
            self.assertTrue((dest / "app-design/DESIGN_TO_BUILD_CONTRACT.md").is_file())
            self.assertNotEqual(self.invoke(sys.executable, str(CHECK), "--stage", "plan", "--root", str(dest)).returncode, 0)
            brief = dest / "design/BRIEF.md"
            brief.write_text(brief.read_text().replace("[[FILL]]", "Owner approved"))
            self.assertEqual(self.invoke(sys.executable, str(CHECK), "--stage", "plan", "--root", str(dest)).returncode, 0)
            self.assertNotEqual(self.invoke(sys.executable, str(CHECK), "--stage", "design", "--root", str(dest)).returncode, 0)

            # Simulate an agent completing verifiable visual/design deliverables.
            for doc in ["BRAND_BOARD.md", "UI_KIT.md", "SCREEN_MAP.md", "QA.md"]:
                path = dest / "design" / doc
                path.write_text(path.read_text().replace("[[FILL]]", "Approved sample"), encoding="utf-8")
            (dest / "design/QA.md").write_text((dest / "design/QA.md").read_text().replace("- [ ]", "- [x]"))
            evidence = dest / "design/evidence"
            evidence.mkdir()
            for name in ("brand.svg", "kit.svg", "home.svg", "menu.svg", "ordering.svg", "events.svg", "contact.svg", "test-log.txt"):
                (evidence / name).write_text("verified fixture")
            manifest["brand_board_proofs"] = ["design/evidence/brand.svg"]
            manifest["ui_kit_proofs"] = ["design/evidence/kit.svg"]
            manifest["ui_kit_implementation_files"] = ["src/styles.css"]
            manifest["release_evidence"] = ["design/evidence/test-log.txt"]
            for screen in manifest["screens"]:
                path = dest / screen["spec"]
                path.write_text(path.read_text().replace("[[FILL]]", "Approved sample"))
                screen["purpose"] = "A working visitor journey"
                screen["route_or_destination"] = "/" + screen["id"]
                screen["design_proofs"] = ["design/evidence/" + screen["id"] + ".svg"]
                screen["implementation_files"] = ["src/App.tsx"]
                screen["test_evidence"] = ["design/evidence/test-log.txt"]
                screen["status"] = "verified"
            manifest_path.write_text(json.dumps(manifest))
            for stage in ("design", "build", "release"):
                passed = self.invoke(sys.executable, str(CHECK), "--stage", stage, "--root", str(dest))
                self.assertEqual(passed.returncode, 0, passed.stdout + passed.stderr)
            # Path existence does not equal behavior, but a missing page source must fail.
            manifest["screens"][3]["implementation_files"] = ["src/screens/Events.tsx"]
            manifest_path.write_text(json.dumps(manifest))
            failed = self.invoke(sys.executable, str(CHECK), "--stage", "build", "--root", str(dest))
            self.assertNotEqual(failed.returncode, 0)
            self.assertIn("src/screens/Events.tsx", failed.stdout)

    def test_ios_scaffold_and_default_screen(self):
        with tempfile.TemporaryDirectory() as td:
            res = self.invoke("bash", str(GEN), "ios", "DemoIOS", td)
            self.assertEqual(res.returncode, 0, res.stderr)
            dest = Path(td) / "DemoIOS"
            manifest = json.loads((dest / "design/screens.json").read_text())
            self.assertEqual(manifest["platform"], "ios")
            self.assertEqual([s["name"] for s in manifest["screens"]], ["Tasks"])
            self.assertIn("DemoIOS", (dest / "project.yml").read_text())
            self.assertNotEqual(self.invoke(sys.executable, str(CHECK), "--stage", "plan", "--root", str(dest)).returncode, 0)
            brief = dest / "design/BRIEF.md"
            brief.write_text(brief.read_text().replace("[[FILL]]", "Owner approved"))
            self.assertEqual(self.invoke(sys.executable, str(CHECK), "--stage", "plan", "--root", str(dest)).returncode, 0)
            self.assertNotEqual(self.invoke(sys.executable, str(CHECK), "--stage", "release", "--root", str(dest)).returncode, 0)


if __name__ == "__main__":
    unittest.main()
