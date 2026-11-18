# Ads and fliers

Source for Gray Matter's social ads and print fliers. Copy lives in `ads.json`
and comes only from `js/data.js` (service problem, outcome and benefit lines) and
`pricing.html` (prices). Change the copy there, then re-render:

```bash
NODE_PATH=$(npm root -g) node ops/marketing/ads/render.js            # everything
NODE_PATH=$(npm root -g) node ops/marketing/ads/render.js --only=checkup-349,flier-barbers
```

| Output | Where |
|---|---|
| 9 social ads × 4 sizes (square 1200, portrait 1080×1350, landscape 1200×627, story 1080×1920) | `assets/gray-matter/ads/gm-ad-<id>-<size>.png` |
| Half-letter print fliers (5.5 × 8.5 in), barbers and detailers | `assets/gray-matter/print/gm-flier-<audience>-half-letter.pdf`, plus a PNG preview |
| QR codes (plan builder, tagged `utm_campaign=<audience>`) | `assets/gray-matter/print/qr-<audience>.svg` |

The renderer flags any layout where text runs into the footer band. QR codes were
generated with `segno` and verified by decoding the rendered fliers.

**Printing:** print the PDF at 100% (no "fit to page") on 5.5 × 8.5 in card stock,
or two-up on letter paper and cut. Matte 80–100 lb cover stock holds up in shops.
