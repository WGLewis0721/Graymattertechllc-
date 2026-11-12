# Optional Native and Cross-Platform UI References

**Provenance:** Adapted from Spread's [external UI reference catalog](https://github.com/WGLewis0721/spread-app/blob/main/docs/design/ui-kit/REFERENCE_LIBRARIES.md), dated November 11, 2026. This Gray Matter transfer is an **inventory of places to study**, not independent current verification of each project's license, release or maintenance state. Check all before adoption.

## Native SwiftUI

| Resource | Study for | Selection caution |
| --- | --- | --- |
| [Apple Food Truck](https://github.com/apple/sample-food-truck) | Apple multi-device SwiftUI navigation, layout and native techniques | Example architecture, not a data model for your app |
| [SwiftUI Catalog](https://github.com/barbaramartina/swiftuicatalog) | Native controls, containers, accessibility and Dynamic Type | Learning resource, not a complete theme |
| [SwiftfulUI](https://github.com/SwiftfulThinking/SwiftfulUI) | Reusable press/gesture/scrolling implementations | Use native system APIs first; check support |
| [ThemeKit](https://github.com/isamercan/ThemeKit) | Token-based SwiftUI system and component conventions | Spread noted pre-1.0 and potential Swift tools compatibility differences |
| [swiftcn-ui](https://github.com/Mobilecn-UI/swiftcn-ui) | Source-owned native component inspiration | Spread raised maintenance concerns; not a default dependency |

**Native search order:** Apple HIG and working product → Apple samples and catalogs → one missing primitive → evaluate optional implementation → compile and test on target hardware.

## Web/React references beyond the 13-resource screenshot catalog

| Resource | Study for | Boundary |
| --- | --- | --- |
| [Meta Astryx](https://github.com/meta/astryx) | Agent-readable design systems and component conventions | React/StyleX, not native SwiftUI |
| [React Aria / Spectrum](https://github.com/adobe/react-spectrum) | Keyboard, focus, accessibility and controls | Web only |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | Shared transitions and component motion concepts | React/Motion; translate intent into native APIs |
| [shadcn/lint](https://github.com/shadcn-ui/lint) | Enforceable Tailwind/component conventions for AI coding | Check Tailwind version and toolchain |
| [21st.dev MCP](https://21st.dev/mcp) | AI-assisted discovery of component examples | Account/API access varies; audit tool permissions |

For the original **shadcn/ui, Base UI, Radix, Sonner, Vaul, cmdk, NumberFlow, Beautiful UI, RareUI, Magic UI, Aceternity, 21st.dev and pick-ui-library** references, see [LIBRARY_CATALOG.md](LIBRARY_CATALOG.md).

## Dependency adoption gate

1. Name the real UX problem and target platform.
2. Check whether native/system or existing components already solve it.
3. Evaluate two or three relevant sources, not the whole catalog.
4. Inspect current license, attribution/assets, dependency chain, support versions, security and maintenance.
5. Use product-specific tokens, states and accessibility; don't add a second design system.
6. Test on hardware when motion, haptics or native controls are involved.
7. Document approval and rollback in the product's decision log.

**Research does not authorize installing packages or copying proprietary branding.** The Gray Matter marketing website remains static HTML/CSS/JS.
