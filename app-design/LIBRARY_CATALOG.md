# UI Library Catalog | 13 Resources from the Video

Verified November 11, 2026. These are primarily **React/web UI** sources. **None is a drop-in native SwiftUI dependency.** For optional native SwiftUI examples and additional web accessibility/motion resources collected from Spread, see [NATIVE_UI_REFERENCES.md](NATIVE_UI_REFERENCES.md). Their usefulness is different: some provide accessible behavior, others notifications or drawers, while others are visual galleries.

## A. Foundational libraries: pick one primitive base

| Source | Official URL | Best use | Watch out for |
| --- | --- | --- | --- |
| **shadcn/ui** | https://ui.shadcn.com/ | Owned, editable React components, themes and registry CLI | A source-code distribution approach, not a magical design system; match framework/Tailwind version |
| **Base UI** | https://base-ui.com/react/overview/about | Accessible unstyled React controls: menus, popovers, dialogs, forms | Choose as headless foundation for a Base-based project |
| **Radix Primitives** | https://www.radix-ui.com/primitives | Accessible unstyled controls, focus handling and keyboard interaction | Alternative primitive base, not something to automatically mix with Base UI |

**Recommended for a new React app:** React + TypeScript, compatible Tailwind setup and shadcn/ui with **either Base UI or Radix** as the chosen primitive base. Check the actual **components.json** before installing. Do not migrate an existing stable app for novelty.

## B. Specific interaction and feedback

| Source | Official URL | Best use | Adopt only when |
| --- | --- | --- | --- |
| **Sonner** | https://sonner.emilkowal.ski/ ; https://github.com/emilkowalski/sonner | Toasters: saved, error, loading, undo feedback | Existing feedback doesn't already do the job |
| **Vaul** | https://vaul.emilkowal.ski/ | Touch-friendly React drawers and bottom sheets | Needed for web sheets; native apps use system sheets |
| **cmdk** | https://cmdk.paco.me/ ; https://github.com/dip/cmdk | Fast searchable command menu / keyboard palette | Multiple actions truly benefit from searchable commands |
| **NumberFlow** | https://number-flow.barvian.me/ | Motion for updating counters, hours, money and percentages | Number transitions improve comprehension; respect reduced motion |
| **pick-ui-library skill** | https://www.skills.sh/emilkowalski/skills/pick-ui-library | AI agent lookup that chooses a library for a specific frontend task | You have reviewed external skill behavior; this is **not a UI package** |

Sonner's reference shows a root **Toaster** plus toast calls. NumberFlow provides accessible animated value transitions. Don't use toasts as a substitute for validation or persistent error states.

## C. Visual inspiration, effects and component galleries

| Source | Official URL | Best use | Caution |
| --- | --- | --- | --- |
| **Beautiful UI** | https://www.beautifului.dev/ | AI-native UI: chat, streaming results, approval cards, task states, prompt bars | Exact source from screenshot; see naming caveat below |
| **RareUI** | https://rareui.in/ | Stylized animated React controls and card interactions | Review licensing, performance, dependency claims |
| **Magic UI** | https://magicui.design/ | Landing pages, hero effects, animated graphics and callouts | Predominantly promotional surfaces, not all-day productivity interfaces |
| **Aceternity UI** | https://ui.aceternity.com/ | Expressive React/Next.js components, hero, card and motion examples | Free items **and** paid blocks/templates; review terms |
| **21st.dev** | https://21st.dev/ | Community UI components, themes, AI-agent-ready React/Tailwind code | Quality varies by author; free-use quotas and paid plans |

**Important name collision:** https://www.beautifului.dev/ (the screenshot source) is **different** from https://beautiful-ui.dev/ (Notchset, a separate shadcn component system). Do not silently substitute the latter.

## Which one should an app use?

| Requirement | Default choice |
| --- | --- |
| Accessible dropdown/dialog | Existing shadcn components backed by the project's Base **or** Radix setup |
| Save/error/undo message | Sonner or existing toast |
| Mobile-web bottom sheet | Vaul if the framework and gestures fit |
| Search commands | cmdk, only for real power-user needs |
| Numbers that change | NumberFlow, with reduced-motion fallback |
| AI assistant patterns | Study Beautiful UI; build coherent app-owned components |
| Distinctive marketing hero | Study Magic UI / Aceternity and customize substantially |
| Reference exploration | RareUI, 21st.dev, curated pick-ui-library skill |

## Adoption checklist

1. Check the **existing** stack before recommending another library.
2. Verify framework versions, primitive compatibility, dependency list, current license and paid entitlements.
3. Audit external component code and agent skill instructions; do not execute blindly copied commands.
4. Install one component for one purpose, align it to the app's typography/tokens and keep source ownership clear.
5. Test responsiveness, focus, screen readers, scrolling conflicts, reduced motion, touch, error and loading states.
6. Record what was adopted and why in the new app's decision log.

Official references: https://ui.shadcn.com/docs/cli ; https://www.radix-ui.com/primitives/docs/overview/introduction ; https://base-ui.com/react/overview/about ; https://magicui.design/docs ; https://ui.aceternity.com/components ; https://21st.dev/community/components .

Prices, quotas and version support change. Links are curated references, **not endorsements or license grants**.
