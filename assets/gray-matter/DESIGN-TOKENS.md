# Gray Matter LLC — Design Tokens

## Direction
**Practical Operating System.** Translate a business goal into a clear, guided working state. It is outcome-led, founder-accountable and technically credible without using generic cloud/cyber imagery.

## Color
| Token | Value | Use |
|---|---:|---|
| `--gm-ink` | `#13233B` | Primary text, anchors, dark cards |
| `--gm-paper` | `#F6F5F1` | Default page ground |
| `--gm-white` | `#FFFFFF` | Cards |
| `--gm-blue` | `#356AE6` | Action / selected states |
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
Use 4px round-capped ink lines at 188px base; blue lines only to show direction/action. Fill hierarchy: paper/white → mint/gold → blue. Never use gradients, neon, circuitry, brains, stock server racks, fake dashboard copy, or text inside images needed for meaning.

## Motion
150–220ms ease-out on hover/focus; cards translate Y -3px max; roadmap nodes can reveal in order only when reduced motion is not requested. No looping decorative animation.

## Breakpoints
320/375/430: one column, vertical roadmap. 768: 2-up where useful. 1024: 3-up service grid. 1440+: full hero and horizontal roadmap. Use `prefers-reduced-motion`.
