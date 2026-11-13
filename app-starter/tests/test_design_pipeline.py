"""Regressions: design plans, named screens, real PNG wireframes, upgrade baseline and corrections."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "app-starter/scripts"


def invoke(*args):
    return subprocess.run(args, cwd=ROOT, text=True, capture_output=True, timeout=90)


def fill_plan(dest, upgrade=False):
    for name in ("BRIEF.md", "PREBUILD_PLAN.md", "REFERENCES.md"):
        p = dest / "design" / name
        p.write_text(p.read_text().replace("[[FILL]]", "Reviewed and approved"))
    if upgrade:
        p = dest / "design/UPGRADE_AUDIT.md"
        p.write_text(p.read_text().replace("[[FILL]]", "Existing code reviewed"))
    (dest / "design/references.json").write_text(json.dumps({"sources": [{
        "title": "Apple Human Interface Guidelines", "category": "platform",
        "url": "https://developer.apple.com/design/human-interface-guidelines/",
        "why_use": "Platform interaction guidance", "what_not_to_copy": "Brand identity",
        "license_or_terms": "Documentation reference", "checked_on": "2026-11-12",
        "inspected": True
    }]}))


class StarterDesignTests(unittest.TestCase):
    def check(self, dest, stage):
        return invoke(sys.executable, str(SCRIPTS / "check-design.py"),
                      "--root", str(dest), "--stage", stage)

    def test_web_png_svg_and_prebuild_gate(self):
        with tempfile.TemporaryDirectory() as tmp:
            result = invoke("bash", str(SCRIPTS/"new-app.sh"), "web", "NewSite",
                            tmp, "--kind", "website", "--screens", "Home,Menu,Contact")
            self.assertEqual(result.returncode, 0, result.stderr)
            dest = Path(tmp) / "NewSite"
            manifest = json.loads((dest/"design/screens.json").read_text())
            self.assertEqual([s["name"] for s in manifest["screens"]], ["Home","Menu","Contact"])
            self.assertEqual(manifest["mode"], "new")
            self.assertEqual(json.loads((dest/"design/requested-screens.json").read_text())["requested"][1]["name"],"Menu")
            for name in ("home","menu","contact"):
                for device in ("desktop", "mobile"):
                    png = dest/f"design/wireframes/exports/{name}-{device}.png"
                    svg = dest/f"design/wireframes/exports/{name}-{device}.svg"
                    with Image.open(png) as img:
                        self.assertEqual(img.format, "PNG")
                    self.assertTrue(svg.read_text().startswith("<svg"))
            self.assertNotEqual(self.check(dest,"plan").returncode,0)
            fill_plan(dest)
            self.assertEqual(self.check(dest,"plan").returncode,0)
            self.assertNotEqual(self.check(dest,"design").returncode,0)
            manifest["screens"].pop()
            (dest/"design/screens.json").write_text(json.dumps(manifest))
            self.assertIn("Screen inventory drifted",self.check(dest,"plan").stdout)

    def test_ios_and_input_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            result=invoke("bash",str(SCRIPTS/"new-app.sh"),"ios","MyIOS",tmp)
            self.assertEqual(result.returncode,0,result.stderr)
            dest=Path(tmp)/"MyIOS"
            self.assertEqual(json.loads((dest/"design/screens.json").read_text())["screens"][0]["name"],"Tasks")
            self.assertIn("MyIOS",(dest/"project.yml").read_text())
            self.assertTrue((dest/"design/wireframes/exports/tasks-mobile.png").exists())
            duplicate=invoke("bash",str(SCRIPTS/"new-app.sh"),"web","Wrong",tmp,
                            "--screens","Home,home")
            self.assertNotEqual(duplicate.returncode,0)
            self.assertFalse((Path(tmp)/"Wrong").exists())
            self.assertNotEqual(invoke("bash",str(SCRIPTS/"new-app.sh"),"ios",
                            "Wrong",tmp,"--kind","website","--screens","Home").returncode,0)

    def test_upgrade_comparison_and_correction_block(self):
        with tempfile.TemporaryDirectory() as tmp:
            temp=Path(tmp)
            site=temp/"client";site.mkdir()
            (site/"index.html").write_text("<h1>Existing client website</h1>")
            original=(site/"index.html").read_bytes()
            screenshot=temp/"baseline.png"
            Image.new("RGB",(420,600),"white").save(screenshot)
            prep=invoke("bash",str(SCRIPTS/"upgrade-site.sh"),str(site),
                        "--name","ClientSite","--screens","Home,Services",
                        "--reference",str(screenshot))
            self.assertEqual(prep.returncode,0,prep.stderr)
            self.assertEqual((site/"index.html").read_bytes(),original)
            manifest=json.loads((site/"design/screens.json").read_text())
            self.assertEqual(manifest["mode"],"upgrade")
            self.assertEqual(len(manifest["baseline_screenshots"]),1)
            self.assertNotEqual(self.check(site,"plan").returncode,0)
            fill_plan(site,upgrade=True)
            self.assertEqual(self.check(site,"plan").returncode,0)
            self.assertNotEqual(invoke("bash",str(SCRIPTS/"upgrade-site.sh"),str(site),
                       "--name","ClientSite","--screens","Home",
                       "--reference",str(screenshot)).returncode,0)
            after=site/"design/evidence/after/home.png"
            after.parent.mkdir(parents=True)
            Image.new("RGB",(420,600),"#eeeeff").save(after)
            bad=invoke(sys.executable,str(SCRIPTS/"compare-screenshots.py"),
                       "--before",str(screenshot),
                       "--after",str(site/"design/wireframes/exports/home-mobile.png"),
                       "--out",str(temp/"fake.png"))
            self.assertNotEqual(bad.returncode,0)
            comparison=site/"design/evidence/comparisons/home-before-after.png"
            result=invoke(sys.executable,str(SCRIPTS/"compare-screenshots.py"),
                "--before",str(site/"design/evidence/before/original.png"),
                "--after",str(after),"--out",str(comparison),
                "--root",str(site),"--screen","home")
            self.assertEqual(result.returncode,0,result.stderr)
            with Image.open(comparison) as image:
                self.assertEqual(image.format,"PNG")
            manifest=json.loads((site/"design/screens.json").read_text())
            self.assertTrue(manifest["comparison_images"])
            self.assertTrue(manifest["screens"][0]["comparison_images"])
            issue=invoke(sys.executable,str(SCRIPTS/"open-correction.py"),
                         "--root",str(site),"--id","broken-nav",
                         "--screen","home","--problem","Menu not responding",
                         "--evidence","design/evidence/before/original.png")
            self.assertEqual(issue.returncode,0,issue.stderr)
            self.assertEqual(json.loads((site/"design/corrections.json").read_text())["issues"][0]["status"],"open")
            self.assertIn("Unresolved correction blocks release",self.check(site,"release").stdout)
            self.assertEqual((site/"index.html").read_bytes(),original)


if __name__ == "__main__":
    unittest.main()
