# Claude Code — Phase 3C Remediation Task

## Role and authority
You are the sole developer and implementation owner for the Hotel New Moorthi Cafe web application. OpenCode is the independent auditor only. Execute the verified fixes below; do not stop after planning or ask for another approval for these scoped corrections.

## Source of truth
Use the current working tree as the implementation source. Read `stitch-reference/audit/PHASE_3B_INDEPENDENT_AUDIT.md` and the following exact Stitch references before changing code:
- Customer Dashboard: `stitch-reference/screens/07-customer-dashboard/customer-dashboard.html`
- Item Details: `stitch-reference/screens/08-item-details/item-details.html`
- Food Menu: `stitch-reference/screens/03-food-menu/food-menu.html`

The independent audit says browser screenshots were not captured, and its acceptance decision is **CONDITIONALLY ACCEPTED**. Do not describe visual verification as complete without actual screenshots and a comparison.

## Safety and project constraints
- Preserve all existing working-tree changes. Inspect `git status --short` first and do not overwrite or revert unrelated work.
- Do not commit, push, reset, stash, clean, or delete files.
- Do not alter backend business logic, database data, auth architecture, or API contracts for these UI fixes.
- Keep the existing React + Webpack + JavaScript stack. No TypeScript, Vite, new dependencies, or MCP/config changes.
- Do not use SVG placeholders or label placeholders as real food photography.
- Prefer valid existing local assets. If replacing broken photos requires network access that is unavailable, use an already-available valid image asset only when it accurately represents the dish; otherwise report the blocker rather than writing an HTML error response to a `.jpg` file.

## Required implementation (priority order)

### P0 — Repair the two broken food assets
Audit verified these are invalid 29-byte HTML 404 responses, not JPEGs:
- `public/assets/food/masala-dosa.jpg`
- `public/assets/food/idli-sambar.jpg`

1. Inspect the actual current files, bytes, dimensions, and all references before replacing them.
2. Replace each with a valid food photograph for the correct dish, or a valid matching image already available in the project.
3. Verify file signatures and that each referenced URL/path returns image content. Do not rely only on file extension or a successful write.
4. Scan the three target screens and relevant assets for remaining `via.placeholder.com`, SVG placeholder, or error-page assets.

### P1 — Customer Dashboard counter protocol
Update `src/pages/CustomerDashboard.js` to include the missing counter-protocol section shown in the exact Stitch reference. Match its visual hierarchy and available design tokens without breaking greeting, auth redirect, token badge, signature items, recent orders, or floating cart.

The independent audit also observed quantity buttons with empty `onClick={() => {}}` handlers and `activeToken` initialized but never populated. Inspect existing intended behavior. Do not invent backend functionality. Either connect controls to already-existing supported behavior or clearly make inert controls non-interactive; document any unresolved product behavior rather than silently pretending it works.

### P1 — Consistent Indian Rupee display
Inspect actual pricing sources in `src/pages/Menu.js`, `src/pages/CustomerFoodDetail.js`, and any shared food-card component. Change hardcoded presentation values currently formatted with `$` to the application's intended INR format (`₹`) wherever they represent the same Indian cafe prices. Preserve numeric values, server/API payloads, calculations, and order snapshots; this is a display-format change only. Do not convert prices using exchange rates or invent new prices. Check formatting for consistency across Menu, Item Details, cart-facing cards if relevant, and avoid altering unrelated admin/report currencies without evidence.

### P2 — Item Details code and navigation cleanup
Inspect `src/pages/CustomerFoodDetail.js`:
- Audit `selectedRatio`. The audit calls it unused but also says style radio selection works; do not remove it blindly. If it is wired to a real UI or intended item customization, preserve and use it correctly; remove only if demonstrably dead code.
- Fix breadcrumb links to the valid route(s) based on `src/App.js` and the exact intended navigation. Do not invent routes.
- Preserve add-ons, quantity state, price calculation, authentication checks, add-to-cart behavior, and counter-protocol steps.

### P3 — Small consistency fixes (only if safe and reference-supported)
- Replace emoji icons with the already-loaded Material Symbols only where consistent with the design reference and no dependency is needed.
- Do not add formal grid tokens or modify design-system.json unless direct reference evidence supports the exact values.

## Verification requirements
1. Inspect and record initial `git status --short`; retain unrelated changes.
2. Run `npm run build` independently of the dev servers. Record the actual exit code and relevant output. Do not say the build is blocked by servers unless a demonstrated build-specific server dependency exists.
3. Run targeted existing tests for menu/category filtering, customer dashboard, and item details. Do not install dependencies. If E2E tests require the frontend/backend servers, check availability safely and state precisely which tests could not run and why. Do not access or mutate production/shared databases.
4. Validate all six local food assets, not just the two repaired ones. Check file signatures and dimensions, and make sure image content is not HTML. If possible, use the browser to verify rendered images.
5. If browser access and running services are available, capture screenshots at desktop and mobile viewport sizes and compare them with the exact Stitch reference HTML/screenshots. Otherwise mark visual verification **PENDING**, not passed.
6. Check for console errors, failed image requests, broken navigation, broken category filters, and price display regressions where tools allow.

## Report deliverable
Update `stitch-reference/audit/PHASE_3B_IMPLEMENTATION_REPORT.md` or create `stitch-reference/audit/PHASE_3C_REMEDIATION_REPORT.md` (prefer the new Phase 3C report to preserve history). Report:
- exact files changed;
- fixes implemented and evidence for each;
- image validation method and results;
- exact build/test commands, exit status, pass/fail counts;
- screenshot paths and comparison results, if actually captured;
- blockers and remaining findings;
- a clear decision: `IMPLEMENTATION FIXES COMPLETE — VERIFICATION PENDING`, `CONDITIONALLY ACCEPTED`, or `VERIFIED`, choosing only what evidence supports.

Do not leave contradictory old claims in the new report. Do not claim production readiness unless runtime tests and visual verification support that conclusion.

## Definition of Done
- Both broken assets are confirmed valid food images for the intended dishes, or explicitly reported as blocked with no false completion claim.
- Customer Dashboard has the reference counter-protocol section.
- User-facing prices display consistently in INR without changing underlying price values or business logic.
- Item Details dead code/navigation issues are resolved based on actual current code.
- Production build result is recorded truthfully; available targeted tests are run.
- A Phase 3C report gives reproducible evidence and clear remaining blockers.
- No commit or push performed.
