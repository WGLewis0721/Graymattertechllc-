# Google Drive Replication Manifest (template)

**Status:** CREATED as a non-operational template · **Drive writes:** none authorized in this foundation work

Drive is **not** a second source of truth. GitHub is canonical. Before any copy, check the Drive destination by path and title. If a matching file exists, record `SKIPPED_EXISTING` and do not overwrite. Never create shadow copies or fabricate a Drive ID.

## Replication statuses

| Status | Meaning |
|---|---|
| `PENDING` | Eligible but not yet checked or copied |
| `SKIPPED_EXISTING` | Matching file already exists in the destination; left untouched |
| `CREATED` | Copied to Drive after approval; ID recorded |
| `MISMATCH` | Destination file exists but differs; reported, not overwritten |
| `BLOCKED` | Needs owner input, permission, or a Drive account that is not available |

## Manifest columns

| Column | Rule |
|---|---|
| `source_path` | Repo path, relative to the repo root |
| `source_commit` | Commit SHA the copy was taken from. Record at approval time |
| `drive_target_path` | Destination folder path, once the owner confirms the folder |
| `drive_file_id` | Only when known from a real check. Otherwise `unknown` |
| `validation_state` | From [FOUNDATION_STATUS.md](FOUNDATION_STATUS.md) |
| `replication_status` | One of the statuses above |
| `checked_on` / `checked_by` | Date and person or process |
| `notes` | Reason for any status other than `CREATED` |

## Manifest (initial, not yet checked)

| source_path | source_commit | drive_target_path | drive_file_id | validation_state | replication_status | checked_on | checked_by | notes |
|---|---|---|---|---|---|---|---|---|
| docs/agency-ops/CLIENT_INTAKE_TEMPLATE.md | `[SHA at approval]` | `[owner confirms folder]` | unknown | Pending human review | PENDING | — | — | Drive destination folder not confirmed |
| docs/agency-ops/QUOTE_AND_INVOICE_PLAYBOOK.md | `[SHA at approval]` | `[owner confirms folder]` | unknown | Pending human review; Square steps BLOCKED | PENDING | — | — | Copy only after owner approves payment steps |
| docs/agency-ops/DELIVERY_AND_HANDOFF_CHECKLIST.md | `[SHA at approval]` | `[owner confirms folder]` | unknown | Pending human review | PENDING | — | — | Internal checklist |

Excluded from Drive: source code, raw assets, `FOUNDATION_*` working files, the content and outreach queue spec (internal operating formats), and anything containing client or prospect data.

## Procedure (for a later, authorized step)

1. Confirm the Drive destination folder with the owner.
2. Search the folder by path and title. Record the result.
3. For each row: copy only if `PENDING` and absent. Otherwise record `SKIPPED_EXISTING` or `MISMATCH`.
4. Record the new `drive_file_id` only from the Drive response.
5. Do not edit Drive-native originals. Request a separate authorized operation if one is needed.

## Done when

Every approved document has a traceable repo source, a recorded Drive status, and no duplicate or overwritten files.
