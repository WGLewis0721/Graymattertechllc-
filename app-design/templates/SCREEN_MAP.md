# {{PRODUCT}} | Screen Map

The machine-readable, **authoritative screen inventory** is `design/screens.json`. Never silently omit a requested page or screen.

## Approved inventory and user journeys
- Requested screen list, in the user's order: [[FILL]]
- Navigation entry points, routes/destinations, and return/back behavior: [[FILL]]
- First successful journey across the screens: [[FILL]]
- Optional secondary paths and redirects: [[FILL]]

## Shared patterns and states
- Which UI Kit components each screen should reuse: [[FILL]]
- Data sources, permissions and persistently stored state: [[FILL]]
- Empty, loading, error, offline, validation, undo, unsupported device: [[FILL]]
- Cross-device/responsive behavior and keyboard/assistive access: [[FILL]]

## Implementation coverage
For each object in `design/screens.json`, create `design/screens/<id>.md` and record:
- `purpose`, `route_or_destination` and actual screen design proof file(s).
- `implementation_files` pointing to actual source implementing that screen.
- `test_evidence` pointing to real test/visual evidence and `status` matching the latest verified stage.

Only remove a requested screen with explicit product-owner approval and a corresponding decision log entry. A header link or an empty placeholder is not a functional screen.
