# Product Design: Identity, UI/UX and Motion

Build a **product** that feels deliberately designed, not a pile of attractive library components. Use for web and native apps.

## 1. Define the job before the art

Document: intended user, current pain, primary action, first useful result, measurable success, failure/offline experience and reason to return. Map **Open → Understand → Act → Receive feedback → Return**. A feature that doesn't serve that loop needs justification.

## 2. Research visual directions

Make a small mood board with **typography, color, imagery, illustration, shape, physical metaphor and motion**. Label *what* each reference contributes, not "make it look exactly like this."

Useful sources:
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Real app screenshots and flows: https://mobbin.com/
- Visual inspiration and art-direction collections: https://www.pinterest.com/
- Typeface research: https://fonts.google.com/ and https://www.fontshare.com/
- Palette exploration: https://coolors.co/
- Web component examples: [LIBRARY_CATALOG.md](LIBRARY_CATALOG.md)

Do not copy another company's logo, branded illustrations, distinctive entire experience, or unlicensed assets. Check font licensing.

## 3. Make a semantic design token system

Create one source for these **semantic roles**, with light/dark and accessibility variants:
- Color: canvas, surface, elevated, primary, accent, text, secondary text, outline, destructive, success and warning.
- Type: display, heading, body, caption, numbers; family, weights, sizes, line heights and letter spacing.
- Space: consistent 4-point or 8-point modular system; density rules.
- Shape: corners for controls, cards and sheets; shadows and borders.
- Motion: response, transition, settle, duration/easing/spring, interruption and reduced-motion fallback.

Example **names only**, not required colors:
~~~text
color.background, color.surface, color.text, color.action
type.title, type.body, type.caption, type.numeric
space.1, space.2, space.3, space.4
radius.control, radius.card, radius.sheet
motion.fast, motion.normal, motion.deliberate
~~~

Do not scatter hardcoded animation values, fonts and component colors across files.

## 4. Design ALL states

For each control: default, pressed, focus, selected, disabled, loading, success, error; hover where supported. For each screen: first-run, empty, partial data, full data, slow request, offline, error, permissions denied, deletion/undo.

Specify navigation and interactions: tap, long press, swipe, drag, keyboard, VoiceOver/screen reader, back and undo. Validate actual content lengths and edge cases. Only promise gestures that the implementation can preserve through app restart.

## 5. Motion with tactile precision

Write a motion contract: **trigger → immediate response → movement → snap/settle → state commit → haptic** where supported. Motion should be interruptible, consistent, non-blocking and reversible where appropriate.

Cards, drawers, bottom sheets and radial selectors must honor vertical/horizontal scroll conflicts, system navigation gestures, safe areas and content overflow. Test on the device. Use reduced-motion alternatives and avoid gratuitous glow, blur and spring effects.

## 6. Responsive and accessible by default

Check small and large phones, tablet, landscape/rotation, keyboard shown, text scaling, light and dark, high-contrast needs and assistive technologies. Use WCAG 2.2 as the web accessibility reference: https://www.w3.org/TR/WCAG22/ . For iOS, follow Apple HIG and native accessibility APIs.

## Required deliverables

- Product-specific logo/app icon, typography, palette and image/illustration specification.
- Component states and reusable tokens; screen map for the core journey.
- Motion/gesture specification including haptics and reduced-motion behavior.
- Real screenshots/video of each major interaction; empty/error states included.
- Asset source and license list. No false claims or placeholder graphics at release.
- [FEATURE_SPEC template](templates/FEATURE_SPEC.md) with acceptance evidence.

**Done means** the user can clearly complete the task, the interface stays coherent on devices and in failure states, and no major developer behavior is left to guesswork.
