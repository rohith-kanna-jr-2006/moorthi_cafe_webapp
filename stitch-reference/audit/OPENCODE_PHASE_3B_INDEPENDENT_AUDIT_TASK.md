# OpenCode Phase 3B Independent Acceptance Audit

## Role
You are the independent audit and analysis agent for the Hotel New Moorthi Cafe web application. Claude Code is the implementation owner. Your task is to inspect the *current actual working tree* and independently determine what is verified, what remains incomplete, and whether Phase 3B can pass acceptance.

## Safety constraints
- Audit only. Do not edit, create, delete, move, or rename project files.
- Do not install dependencies or change configuration.
- Do not commit, push, reset, stash, clean, or otherwise change Git state.
- Preserve all existing work. Never access or modify production data.
- Do not trust implementation-report claims without checking the repository and command output.
- Do not claim browser screenshots were captured or compared unless you personally capture and inspect them.
- Keep observations separate from inference. Include exact file paths and line numbers where possible.

## Context
Claude Code reports that Phase 3B remediation addressed three screens:
1. Customer Dashboard — `src/pages/CustomerDashboard.js`
2. Item Details — `src/pages/CustomerFoodDetail.js`
3. Food Menu — `src/pages/Menu.js`

It reports six local food images under `public/assets/food/`:
- `masala-dosa.jpg`
- `idli-sambar.jpg`
- `filter-coffee.jpg`
- `vada.jpg`
- `pongal.jpg`
- `uttapam.jpg`

It also claims that `Menu.js` duplicate imports/logic were removed, category filtering and counter-protocol UI were added, and the production build succeeded. However, the report is internally inconsistent: older passages still say images were corrupted, newer passages say six JPEGs were validated, and runtime tests/screenshots remain unverified. Treat every claim as unverified until inspected.

## Audit scope and required checks

### 1. Git and change inventory
- Record current branch and `git status --short` without modifying anything.
- Identify which changed/untracked files are attributable to Phase 3B versus pre-existing work, if the baseline can be established safely. Do not assume all current changes belong to Claude.
- Report any unexpected files or broad changes.

### 2. Code integrity
- Inspect the full current versions of the three target components and relevant CSS/components they import.
- Check for duplicate imports, duplicate component/list rendering, duplicate menu items/IDs, unmatched JSX, duplicate hooks/effects, unused variables, runtime hazards, and inconsistent data shapes.
- Verify existing routing, authentication checks, API usage, item selection, quantity/add-on pricing, cart actions, and `FoodCard` behavior remain compatible.
- Confirm category filtering really filters displayed items and that category values are valid for every item.
- Confirm no unrelated business logic was changed.

### 3. Image asset verification
- Inventory every asset referenced by the three screens and resolve each local path against the public asset root.
- Verify file signatures and image dimensions using non-destructive read-only tools.
- Check each image by actually viewing it where image inspection is possible: determine whether it is genuine food photography, whether it matches the named dish sufficiently, and whether any file is a placeholder, icon, SVG masquerading as JPEG, HTML error page, or duplicated/wrong image.
- Verify there are no `via.placeholder.com`, fake Googleusercontent paths, broken local paths, or leftover emoji-only food images on the target screens.
- State clearly that valid JPEG file signature alone does **not** establish correct food content, licensing, or visual suitability.
- Check external/local asset loading references for path/case mismatches. Do not make unsupported licensing claims.

### 4. Design/reference comparison
Use these exact Stitch references:
- Dashboard: `stitch-reference/screens/07-customer-dashboard/customer-dashboard.html`
- Item Details: `stitch-reference/screens/08-item-details/item-details.html`
- Food Menu: `stitch-reference/screens/03-food-menu/food-menu.html`

Compare the reference HTML requirements to the current implementation, with focus on:
- Dashboard hero gradient/ambient brass or woodfire accents, greeting/token, signature items, recent orders, counter protocol.
- Item Details photo, brass/filter-coffee visual treatment, quantity/add-ons/pricing and counter protocol.
- Food Menu real food photography, working category chips, counter-protocol banner, responsive grid and navigation.
- Noto Serif and Plus Jakarta Sans actually being loaded/applied, not merely declared.
- Existing design tokens, spacing, border radii, and responsive breakpoints.

If the application can be run safely with the already-installed dependencies and local services, capture current screenshots for each target screen at desktop and mobile viewport sizes. Compare them directly against available Stitch references. Do not start destructive operations or change services/configuration. If reference screenshots are not available, say exactly what comparison was possible (e.g. HTML/CSS inspection only).

### 5. Build and tests
- Inspect `package.json` before selecting commands.
- Use already-installed dependencies only; do not install anything.
- If safe and practical, run the existing production build and targeted Playwright tests.
- Before running E2E tests, verify the required frontend/backend services and base URLs are reachable. Never assume a test passed simply because it could not run.
- Separate results into PASS, FAIL, BLOCKED, and NOT RUN. For each failure/blocker include the actual command/output or concrete evidence.
- Do not connect tests to production databases; avoid writes to any database unless the project has a confirmed isolated test database.

### 6. Report consistency
Read `stitch-reference/audit/PHASE_3B_IMPLEMENTATION_REPORT.md` and list contradictions, stale sections, claims unsupported by actual evidence, and missing verification. Do not edit the implementation report during this audit. Recommend precise corrections in your own audit report.

## Deliverable
Create a new, audit-only report:
`stitch-reference/audit/PHASE_3B_INDEPENDENT_AUDIT.md`

The report must include:
1. Audit scope, date/time, environment and tools actually available.
2. Current Git state (no modifications made).
3. Findings with severity (`BLOCKER`, `HIGH`, `MEDIUM`, `LOW`) and exact evidence.
4. Asset inventory with file type, dimensions, visual-content assessment, and usage sites.
5. Design-reference discrepancy table for each of the three screens.
6. Build/test matrix with PASS/FAIL/BLOCKED/NOT RUN and truthful command evidence.
7. Screenshot list and comparison observations, only if screenshots were actually captured.
8. Report contradictions and unsupported claims.
9. Final acceptance decision: `ACCEPTED`, `CONDITIONALLY ACCEPTED`, or `NOT ACCEPTED`, with explicit criteria for closure.
10. A prioritized list of findings for Claude Code to fix. Do not implement those fixes yourself.

## Acceptance standard
Phase 3B must **not** be marked production-ready solely because a build reportedly succeeds or files have JPEG signatures. At minimum, code integrity, image content/loading, category filtering, critical interactions, responsive layout, and screenshot/reference comparison must have actual evidence. If environment limitations prevent verification, mark the affected checks `BLOCKED` and make the final acceptance decision reflect that limitation.

Begin the audit now. Inspect current files and gather evidence; do not stop at a plan.
