# Philosophy

## Model-kit architecture

Every Gunpla kit shares the same internal skeleton and the same part categories: chest, shoulders, biceps, femurs, calves, feet. What changes between kits is shape and color, never the underlying frame.

Applied here: every client site is assembled from the same shared components with the same prop contracts. Only theme tokens, content, and a small set of vertical-specific parts change. A barber site and a lawyer site use the same Hero, Gallery, Contact, and Hours components. They look nothing alike, because the theme tokens and content differ, but the frame underneath is identical.

If a client request would require changing the frame, that is a signal the frame needs a new optional part, not a fork. A contractor wants a before/after slider that no other vertical needs: that becomes a new optional component with its own prop contract, added to the shared library, used only where it's needed. It is not a reason to copy the whole template and diverge.

This is what makes the service productizable. One-week turnarounds are only possible because the frame is never in question on a new build. The only decisions left are theme and content, both of which are cheap and fast to apply.

## Interaction priority: swipe first, scroll second, tap third

Mobile is the primary target. Desktop is the adaptation, not the other way around.

- **Swipe** is the default interaction for anything with multiple items: photo galleries, service lists, testimonials. These are horizontal scroll-snap surfaces, not grids or carousels with buttons.
- **Scroll** is the default interaction for moving through a single page. Client sites are single-purpose pages or short page sets, not deep navigation trees.
- **Tap** is for discrete actions: call, book, get directions, submit a form. Tap targets are 44px minimum. Nothing on the site requires a hover to be discovered or used, because most of the audience visiting these sites is on a phone, standing outside a shop, deciding whether to walk in or scroll past.

This ordering is deliberate. A design that works great with a mouse and is retrofitted for touch produces exactly the failure mode this system exists to avoid: slow, hover-dependent, desktop-first sites that fail the actual visitor.

## What the assembly line is optimizing for

Not visual novelty. Not flexibility for its own sake. The system optimizes for:

1. **Speed to deploy.** A client should go from signed intake to a live site in one to two weeks, most of that spent waiting on the client's own photos and copy, not on engineering.
2. **Predictable quality.** Every site hits the same performance and accessibility bar because every site is built from the same tested parts. Quality is a property of the frame, not something re-earned per project.
3. **Low maintenance cost.** A bug fix or accessibility improvement to a shared component benefits every future site built from it. There is no fleet of diverged one-offs to patch individually.
4. **A ceiling on complexity.** Fifteen templates that share too little is worse than a smaller set of templates that share almost everything. The system trades away infinite customization to guarantee the site that ships is fast, accessible, and cheap to produce.
5. **A hosting model that gets out of the way.** GitHub Pages is free, static-only, and has no server to secure or maintain. The tradeoffs it imposes (documented in full in `docs/SECURITY.md` and `docs/DEPLOYMENT.md`) are accepted deliberately, in exchange for a hosting bill of zero and an attack surface that stays close to nonexistent.

The client-facing promise: business name, photos, style pick. The system does the rest, and the rest is not a black box, it is the same well-worn frame, themed.
