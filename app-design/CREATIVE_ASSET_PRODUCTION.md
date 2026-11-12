# Creative Asset Production | Research, Generate, Compose, Prove

**Purpose:** Turn visual references into editable, trustworthy, reproducible app and website assets. For premium editorial cards, product imagery, campaigns, front/back collectibles, icons, and social artwork. This extends [EDITORIAL_CARD_AND_ARTWORK.md](EDITORIAL_CARD_AND_ARTWORK.md), which defines runtime card separation; this guide describes the **production pipeline**.

**Adapted from Arooma:** [collectible card production handbook](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/brand/COLLECTIBLE_CARD_PRODUCTION.md), [collectible art direction](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/brand/COLLECTIBLE_CARD_ART_DIRECTION.md), [photo filter spec](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/specs/2026-10-31-native-card-studio-photo-filters.md), [icon handoff](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/brand/ICON_HANDOFF.md) and [third-party content policy](https://github.com/WGLewis0721/Arooma-App/blob/main/docs/design/brand/THIRD_PARTY_CONTENT_POLICY.md). Arooma-specific fragrance facts, approved card styles, dimensions, foil masks and brand photos are **not** copied into this general library.

## 1. One verified job ticket per asset

Complete [the reusable asset manifest](templates/ASSET_JOB_MANIFEST.md) before prompting an image model.

Required fields: unique asset ID/version, target product/surface, exact subject or item variant, user goal, aspect/crop/size, approved reference and its **limited role**, approved copy/facts with source and verification date, original/third-party media rights, art-direction language, target formats, reviewer, and final status.

**Facts are data, not an image-generation output.** Generated typography, product labels, scientific attributes, dates, performance, product edition, prices, customer claims and customer photos cannot become official source material because they appear plausible in an AI image.

## 2. Generate component plates, not one flattened poster

A production-ready visual can be assembled from separable parts:

| Component | Example | Quality requirement |
| --- | --- | --- |
| Subject / product cutout | Real authorized photo or original object | Preserve identity, silhouette, markings, geometry and colors; no hallucinated changes |
| Background environment | Room, table, scenery, paper texture | Cohesive perspective, one controllable main light, quiet regions for copy |
| Secondary props | Ingredients, tools, environmental objects | Support verified subject; believable placement and scale |
| Contact / reflected light | Soft support shadow and ambient reflections | No floating products or contradictory shadow directions |
| Typography and fact layers | Title, features, identifiers, price, disclosure | Human-reviewed **editable text** sourced outside the image model |
| Finishing layer | Grain, illustration detail, frame, decorative foil | Controlled and independent, no effect over essential text |
| Non-export guides | Safe areas, grid, bleed, crop zones | Removable from deliverables |

An image model can create or retouch individual plates. An editor or well-tested code composition step owns typography, masks, proportions, and final export. **Do not ask the image generator to invent tiny factual type and then pretend it has been proofread.**

Illustrative editable project structure:

    assets/jobs/<asset-id>/
      00_sources/       Approved source photos, URLs, consent, license/rights evidence
      01_manifest/      Source facts, art brief, version and review decisions
      02_generations/   Inputs/prompts, image model/date, raw candidate plates
      03_composite/     Layered native designer file, linked images, vector masks, editable text
      04_proofs/        Small-screen, full-resolution, dark/light and layout/crop proofs
      05_exports/       Approved optimized web/native assets and optional print outputs

The exact folders are illustrative. Do not commit confidential source materials or unpublished client photos to a public repository.

## 3. Make art physically coherent

- Compare subject identity against authorized references at full resolution: shape, label, color and edition should not drift.
- Use consistent focal length, surface plane, light direction, color temperature, contact shadows, reflection and scale.
- Use negative space deliberately; let text and meaningful UI remain legible.
- If making a front/back pair, produce two actual editable faces with matching outer geometry and aligned typography; a side-by-side composite is only a proof.
- Keep effects like foil or glow in distinct masked/vector layers; they must not obscure content or impersonate real product capabilities.
- Verify optical alignment at normal use size and at small phone thumbnail size. Proofreads cannot rely on zoomed-in artwork alone.
- For a card rendered by an app, keep **live values, actions and labels** in actual SwiftUI/React/HTML, not flattened exported graphics.

## 4. Non-destructive photo editing by default

Arooma's native photo-filter spec suggests a broadly reusable pattern: **save the original approved pixels, plus a selected filter/grade identifier**, then deterministically render the derived appearance for preview and export.

- Previews must show the **user's actual image**, not a generic sample thumbnail.
- Preserve untouched original pixels and a way to reset to Original.
- Separate optional subject isolation/background removal from color grading. Segmentation can remove hands incorrectly or lose occluded content; it is not automatically reversible unless the unmodified original is retained.
- Preserve the selected grade on reopen, backup/restore and image sharing. Static share exports must match the approved rendered state and hide transient animations.
- When migrating older saved records, support a safe default filter and test decode/backward compatibility.
- Where privacy warrants it, process images on-device; avoid uploading photos or location metadata without explicit purpose and consent.

## 5. Source, license and third-party rights gate

| Input type | Conservative release default |
| --- | --- |
| First-party original artwork | Track creator, model/tool if applicable, source files and permitted distribution |
| Client/user-supplied photograph | Record permission, approved scope (private, web, public share, ads), removal method |
| Licensed photo/font/brand asset | Retain license proof, attribution requirement, territories, duration and permitted media |
| Publicly visible brand/site image | **Research reference only** unless further rights clearance supports distribution |
| Generative re-render of protected source | Requires separate rights/trademark review; generation does not erase IP obligations |
| User's private upload | Private by default; do not promote to a shared public catalog without express permission |

A “not affiliated” disclaimer is not a copyright license or automatic fair-use defense. Trademark use, image distribution, and App Store review can require separate professional assessment. Document a path to remove disputed assets and fall back to original graphical treatment without corrupting product records.

Refer to [SECURITY_AND_RELEASE.md](SECURITY_AND_RELEASE.md) for privacy/security gates and the [source-derived asset manifest](templates/ASSET_JOB_MANIFEST.md) for review status.

## 6. Icon and delivery discipline

Keep **one editable vector or layered master** for icons and derivatives. Generate approved raster sizes from that source, and verify masks/safe area, dark/light variants and real Home Screen appearance. Do not hand-edit multiple generated PNG outputs and lose consistency. Keep brand fonts, credit requirements and master asset ownership documented.

Deliver: original/licensed source, editable layered composition, approved factual copy, rights/approval record, small-scale visual proof, optimized exports, version/hash and rollback location. **A generated still is a draft asset, not proof that it functions in the target application.**

## Acceptance

- [ ] Verified facts, subject variant and rights evidence exist independently of generated imagery.
- [ ] Source images and editable layers can be replaced without destroying the composition.
- [ ] All meaningful text was typeset/proofread from approved copy, not trusted to image generation.
- [ ] Physical materials, masks, light and frame align.
- [ ] Mobile-scale preview, real layout/crop and accessibility pass.
- [ ] User originals remain recoverable when the feature claims non-destructive editing.
- [ ] Approved export exists in intended dimensions/format and is recorded with its origin and review status.
