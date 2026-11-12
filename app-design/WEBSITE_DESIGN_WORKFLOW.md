# Clean, Professional Websites with ChatGPT

**Reusable Gray Matter workflow.** Adapted from Tega Designs' user-supplied guide, *How to Create Clean, Professional Websites Using ChatGPT* (November 2026), with additional requirements for honest business content, original design, accessibility, security, and QA.

**Core principle:** A strong website begins with clear business outcomes and visual direction, not a generic “make a beautiful site” prompt.

This guide is for **client sites, service websites, landing pages, and marketing websites**. Use [WEB_PLAYBOOK.md](WEB_PLAYBOOK.md) for application architecture and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for cross-platform principles. Existing production-repo rules still take precedence.

## Step 0: Define the website job

Fill in [the website brief](templates/WEBSITE_BRIEF.md) before making screens. Record who the website serves, the single most important action (book, call, buy, inquire, subscribe), approved services/content, user questions, integrations, and how success will be measured.

**Only approved facts appear on the public site.** Never fabricate prices, awards, staff identities, testimonials, business hours, client results, or before-and-after evidence. Mark missing details as requiring client approval.

## Step 1: Study visual references

Gather two to four relevant site references and annotate exactly what to borrow as *design principles*, not as copied layouts or copyrighted art.

| Inspiration | What to look for |
| --- | --- |
| [Pinterest](https://pinterest.com) | Industry mood boards, color, photo direction, branding |
| [Dribbble](https://dribbble.com) | Type hierarchy, cards, navigation; note that concepts may not be functional |
| [Behance](https://behance.net) | Cohesive brand systems and full case studies |
| [Awwwards](https://awwwards.com) | High-end presentation and motion; avoid copying effects that hinder usability |

Try searches such as “modern cleaning service website,” “premium local service homepage,” or “restaurant preorder landing page.” Include **real mobile references** when possible.

For every example, evaluate: typography, whitespace, grid/alignment, palette, header/navigation, hero, image/card placement, motion, call to action, and suitability for the business type.

**Deliverable:** A concise art-direction board with reference screenshots, what each teaches, type/palette hypotheses, layout rhythm, and anti-patterns to avoid.

## Step 2: Make a coherent visual asset library

Prepare approved real photos, product images, logo, service illustrations, hero image, and lightweight motion assets where relevant. Image-generation options include [ChatGPT](https://chatgpt.com/), [Higgsfield](https://higgsfield.ai/), and [Google Flow](https://labs.google/fx/tools/flow). Check current licensing, terms, and usage rights.

**Illustrative hero image prompt:**

> Create a photorealistic editorial hero image for a fictional premium residential cleaning service. Two workers in coordinated neutral uniforms clean a bright contemporary living room. Natural daylight, authentic materials and textures, commercial photography, warm neutral tones. Leave generous empty space on the left for a heading and CTA rendered later as HTML. Wide 16:9 composition. No lettering, logos, or watermark.

Customize the scene and style for each brand. Keep lighting, composition, color, and cropping consistent across images. Export optimized images and design separate focal-point crops for mobile.

**Accuracy rule:** Do not present AI-generated models as actual employees/customers, fabricated product photography as real merchandise, or synthetic before-and-after images as real results. Use authorized photography for factual depictions. Record source, permissions, and required attribution. Heading text and CTA belong in accessible HTML, not embedded in a hero image.

## Step 3: Build with ChatGPT using concrete inputs

Give ChatGPT:
1. The completed business/website brief.
2. Reference screenshots with annotations (**art direction, not images to insert**).
3. Approved assets with instructions on which section should use them.
4. Existing repo context and design tokens, if editing a real site.

### Copyable website-build prompt

> Build a premium, fully responsive website for **[BUSINESS]**, serving **[AUDIENCE / LOCATION]**.
>
> **Primary visitor outcome:** [BOOK / CONTACT / BUY / ETC.]. **Success means:** [AN OBSERVABLE COMPLETED ACTION].
>
> I've attached annotated design references. They establish **art direction**: typography, spacing, grid, color relationships, hierarchy, image placement, and navigation. Do not paste the reference screenshots into the website or duplicate another site's distinctive design. Create an original design appropriate to this client.
>
> Use only the supplied and approved brand assets, real business facts, services, policies, reviews, and imagery. Identify missing information for approval rather than inventing content. Prefer a limited, consistent palette and no more than two complementary font families, with appropriate licenses.
>
> **Approved pages and sections:** [HEADER / NAV / HERO + CTA / SERVICES / REAL GALLERY / VERIFIED REVIEWS IF PROVIDED / CONTACT / FOOTER / OTHER NECESSARY SECTIONS].
>
> Prioritize clear typography, generous but purposeful whitespace, consistent spacing, readable contrast, attractive imagery and restrained shadows. Motion should be subtle, interruptible and respect reduced-motion preferences. Avoid arbitrary gradients, heavy effects, crowded cards, and decorative animations without a purpose.
>
> Work within the **existing site's technology stack**, design tokens, navigation and content rules. Make mobile, tablet, and desktop layouts functional. Use semantic HTML, accessible keyboard focus, optimized images, working form validation, honest loading/success/error states, genuine links and search-friendly page content.
>
> Before implementation, state the proposed design direction and page architecture briefly. Build the real experience, not an isolated mockup. Run available tests and report the exact changed files, successful checks, failures and unverified items. Do not call a site production-ready on appearance alone.

**Sections are conditional.** A genuine announcement bar is useful; a fabricated countdown is not. Testimonials require approval. Include booking/checkout only when wired to a real service.

## Step 4: Refine deliberately, in small batches

The first generated result is a draft. Compare real screenshots at mobile, tablet, and desktop widths to the art-direction board and review the following.

| Focus | Example instruction |
| --- | --- |
| Hierarchy | “Make the hero headline more prominent and clarify the primary CTA; preserve the rest.” |
| Whitespace | “Normalize section spacing using existing tokens; keep text density readable.” |
| Card treatment | “Reduce service-card shadows and align image/text baselines.” |
| Mobile | “Fix navigation and image cropping at narrow widths without changing desktop structure.” |
| Visual consistency | “Reduce text-color variations and align typography across sections.” |
| Motion | “Limit entrance transitions and honor prefers-reduced-motion.” |
| Copy | “Replace placeholders only with facts confirmed in the client brief.” |

**Preserve working sections** and update no more than a few related areas in one round. Take before/after screenshots, test the change and maintain a reversible commit or PR.

## Step 5: Launch quality is more than visual polish

Check before publication:
- [ ] The site serves the intended visitor goal and primary CTA works.
- [ ] Desktop, tablet and mobile are visually consistent, with no clipped content or accidental horizontal scroll.
- [ ] All navigation, buttons, phone/email/social links and forms work; failure is not reported as success.
- [ ] Required copy and business facts have been approved; testimonials and imagery are authentic or appropriately described.
- [ ] Semantics, labels, keyboard focus, contrast, touch targets, image alt text and reduced motion are tested.
- [ ] Images load quickly, use suitable crops and sizes, and avoid layout shift.
- [ ] Titles, descriptions, structured headings and relevant crawlable text are present.
- [ ] Privacy, data collection, spam protection, domain/HTTPS, access, backups and rollback are addressed where applicable.
- [ ] The preview is identified as a demo until the site is actually live.
- [ ] A final published-site smoke test and handoff are recorded.

Use [RELEASE_CHECKLIST.md](templates/RELEASE_CHECKLIST.md) for tracked evidence.

## Six design reminders

1. Strong font hierarchy, alignment, and whitespace outperform excess decoration.
2. Usually two complementary typefaces are enough.
3. Choose deliberate color tokens rather than improvising colors per component.
4. Visuals should feel cohesive *and represent the business truthfully*.
5. Motion should support comprehension, not prevent interactions.
6. Test the whole site on real mobile sizes; never stop at the first AI draft.

## Integration with this repository

- **New client sites:** Start with [WEBSITE_BRIEF.md](templates/WEBSITE_BRIEF.md), then use this guide as the step-by-step workflow.
- **New web apps:** Use this for marketing/public pages and [WEB_PLAYBOOK.md](WEB_PLAYBOOK.md) for application architecture.
- **Existing Gray Matter corporate site:** [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) and [../.github/copilot-instructions.md](../.github/copilot-instructions.md) still govern. This document does not authorize changes to live branding, prices, claims, runtime code or funnel behavior.
- **App starter:** The generator in [../app-starter/](../app-starter/README.md) copies the shared app-design folder to new projects, including this guide.

**Credit:** Adapted from Tega Designs, *How to Create Clean, Professional Websites Using ChatGPT* (guide supplied by the user). The original workflow covers references, AI-generated visuals, specific prompts, iterative refinements, and design tips; the Gray Matter version adds production and client-approval safeguards.
