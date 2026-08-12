# Gray Matter LLC — Design Tokens

## Direction
**Practical Operating System.** Translate a business goal into a clear, guided working state. It is outcome-led, founder-accountable and technically credible without using generic cloud/cyber imagery.

## Identity
The approved primary symbol is the **GM brain mark** from `source/gm-approved-logo-reference.png`: a rounded deep-ink monoline brain whose continuous structure forms the `G` and `M`. Use `brand/gm-logo-horizontal.svg` in site headers, `brand/gm-logo-stacked.svg` where vertical space is available, and `icons/gm-mark.svg` for icon-only use. The primary symbol is one color; cobalt appears in the lockup rule and favicon background. Do not reinterpret the mark as filled hemispheres or add separate letters.

## Color
| Token | Value | Use |
|---|---:|---|
| `--gm-ink` | `#152238` | Primary text, anchors, dark cards |
| `--gm-paper` | `#F7F4ED` | Default page ground |
| `--gm-white` | `#FFFFFF` | Cards |
| `--gm-blue` | `#2F64D6` | Action / selected states |
| `--gm-mint` | `#B8E1D0` | Progress / helpful state |
| `--gm-gold` | `#F3C969` | Recommendation / attention |
| `--gm-coral` | `#E9785D` | Friction / risk only |
| `--gm-line` | `#D5DBE4` | Borders / connectors |

## Typography
Use **Manrope** (600/700/800) for headings and **Inter** (400/500/600) for UI/body. System fallback: `Arial, sans-serif`. H1 clamp 42–72px; H2 32–48px; body 16–18px; eyebrow 11–13px at .1em tracking.

## Layout
Max content 1200px, 24px side padding (16px below 375px), 12-column desktop / 6-column tablet / 4-column mobile. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.

## Components
Radius: 12px controls, 20px cards, 28px feature panels. Border: 1px `#D5DBE4`; emphasize with 2px ink only for selected/primary objects. Shadows: none by default; `0 12px 30px rgba(19,35,59,.10)` for raised interactive cards only.

## Illustration and icon rules
Use 4px round-capped ink lines at 188px base; blue lines only to show direction/action. Fill hierarchy: paper/white → mint/gold → blue. Outside the approved favicon, avoid gradients. Do not introduce decorative brains, neon, circuitry, stock server racks, fake dashboard copy, or text inside images needed for meaning.

## Motion
150–220ms ease-out on hover/focus; cards translate Y -3px max; roadmap nodes can reveal in order only when reduced motion is not requested. No looping decorative animation.

## Breakpoints
320/375/430: one column, vertical roadmap. 768: 2-up where useful. 1024: 3-up service grid. 1440+: full hero and horizontal roadmap. Use `prefers-reduced-motion`.

## Brand mark tokens

- `--gm-logo-ink: #152238`
- `--gm-logo-rule: #2F64D6`
- `--gm-logo-reversed: #FFFFFF`
- Primary mark background: warm off-white or white only.
- Reversed mark background: deep ink.
- Favicon background: deep-ink-to-cobalt gradient only.
- Mint, gold, and coral remain diagram/UI colors and never appear in the logo.
