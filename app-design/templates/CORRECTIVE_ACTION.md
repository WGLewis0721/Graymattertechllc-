# {{PRODUCT}} | Corrective Action and Regression Protocol

**Applies to both new builds and upgrades.** The registry is \`design/corrections.json\`; each issue has an independent \`design/corrections/<id>.md\` record.

1. **Detect:** user screenshot/comment, comparison image, accessibility report or failed test. Open an issue with \`python3 scripts/open-correction.py --id nav-tap --screen home --problem 'Menu does not open' --evidence design/evidence/fail-nav.png\`.
2. **Diagnose:** reproduce on the *actual running product*, record commit/device, compare to approved spec/wireframe and source. Classify design, code, data, environment or ambiguous requirement. Find root cause, not cosmetic symptoms.
3. **Spec the correction:** expected state, reference link, affected files/components, low-risk option, regression scenarios, preservation/rollback, and approval required for scope or brand changes. Update the issue spec; leave status open.
4. **Implement:** change minimal relevant source and document code files. Do not weaken tests, quietly change screen inventory or copy an old prototype over the working product.
5. **Verify:** capture actual *before and after* states, test fixed behavior, adjacent screens, responsive sizes, keyboard/VoiceOver/Reduce Motion where relevant. Record test logs, screenshots and build SHA. Reopen if still wrong.
6. **Close:** only after issue spec is fully completed, \`changed_files\` and \`regression_evidence\` exist, and \`reviewer_approval\` names an approving reviewer/date. Set \`status\` to \`closed\` in the registry. The \`release\` gate fails for open, incomplete or insufficiently evidenced corrections.

**Example registry item**:

\`\`\`json
{
  "id": "nav-tap",
  "screen_id": "home",
  "problem": "Mobile navigation does not open",
  "spec": "design/corrections/nav-tap.md",
  "status": "open",
  "observed_evidence": ["design/evidence/fail-nav.png"],
  "changed_files": [],
  "regression_evidence": [],
  "reviewer_approval": ""
}
\`\`\`

All correction evidence must be from the target build. A newly generated mockup is not proof that a real site was fixed. Preserve implementation history and approved screenshots.
