# Approval Gates That Learn

Gates start tight and loosen as validated successes accumulate.

## Gate 1 — Situation Ideas

- New suggestions land as “Needs Approval.”
- After 8–10 approvals that later hit success metrics, the system begins auto-approving ideas that match the winning pattern.
- Non-matching ideas still go to human review.

## Gate 2 — Scripts (optional)

- Early: human review.
- Later: scripts from auto-approved situations skip review unless AI flags uncertainty.
- Weekly batch of auto-passed scripts available for spot-check.

## Gate 3 — Final Clip

- Character clips stay manual until ~15–20 liked examples.
- Motion graphics can loosen earlier.
- After character reference is locked, drops to spot-checks.

## Success Metrics (define once)

Examples:
- Average watch time above threshold
- Follows gained per video above threshold
- Comment rate above threshold
- Or combination

Approved items that later clear metrics are marked “Validated Success.”

## Weekly Learning Loop

1. Pull Validated Success rows.
2. Claude/Grok extracts common traits (situations, hooks, jobs, friction types).
3. Updates “Current Taste Profile” Notion page.
4. New suggestion prompts include the latest Taste Profile.
5. High-confidence matches auto-approve; rest go to queue.

Human involvement drops from ~25% early to ~5–10% after ~20 validated successes.