# Claude Code — Phase 3B UI Implementation Task

## Role
You are the **developer and implementation owner** for Hotel New Moorthi Cafe. OpenCode is the independent audit/review agent. Begin implementation now; do not stop at planning or ask for approval for each listed UI fix.

## Project and hard constraints
- Repository: `D:\project\moorthi_cafe_webapp`
- Stack: React + Webpack + JavaScript. Keep the current stack and CommonJS/Node patterns where applicable.
- Do **not** introduce TypeScript, Vite, Angular, or a new UI framework.
- Do not change backend code, API contracts, business logic, authentication, order/token calculations, or database schema for this visual task.
- Do not install dependencies or change MCP/tool configuration.
- Do not commit, push, reset, stash, clean, or delete files. Preserve all existing user changes.
- Before edits, inspect `git status`, the relevant source files, `package.json`, `src/index.css`, and the reference HTML files. Never overwrite or discard existing work.

## Audit basis
Read `stitch-reference/audit/PHASE_3A_VISUAL_AUDIT.md` and use these references:
- Customer Dashboard: `stitch-reference/screens/07-customer-dashboard/customer-dashboard.html`
- Item Details: `stitch-reference/screens/08-item-details/item-details.html`
- Food Menu: `stitch-reference/screens/03-food-menu/food-menu.html`

Target components:
- `src/pages/CustomerDashboard.js`
- `src/pages/CustomerFoodDetail.js`
- `src/pages/Menu.js`
- Reuse existing shared components such as `FoodCard`, `Navbar`, and `Footer` where appropriate. Inspect actual paths and APIs before editing.

Important evidence limitation: the Phase 3A report says browser screenshots were unavailable. Treat its findings as a useful code/reference inspection, **not proof of pixel-perfect visual parity**. Verify the reference HTML and existing app code yourself. The claim that “all screens” use placeholders is not established by this three-screen audit; scope the immediate work to the three priority screens and report any broader findings separately.

## Implement these fixes in priority order

### 1. Remove placeholder food imagery from the three target screens
- Search the whole repository for `via.placeholder.com` and identify all occurrences, but prioritize the three target components/screens.
- First look for real food image assets already in the repository and for existing image fields returned by current APIs. Reuse existing asset paths/data structures where possible.
- If no suitable assets exist, source stable, appropriately licensed real food photographs suitable for the specific dishes; keep files local in the existing public/assets convention where practical and document each image's source/license in the implementation report. Do not use broken URLs, generic placeholder URLs, emojis, or icons as a substitute for food photography.
- Do not invent API fields or alter backend contracts. Preserve meaningful alt text and image aspect ratios/cropping as shown in the Stitch reference.
- If a real image cannot be acquired safely or reliably, report that particular item as blocked rather than claiming it is complete.

### 2. Customer Dashboard visual alignment
- Match the reference hero hierarchy, spacing, and gradient/ambient background.
- Reintroduce the brass/woodfire visual accents in a restrained way using existing design tokens or locally scoped styles.
- Add the missing **counter protocol** section based on the actual Stitch reference content and hierarchy.
- Preserve greeting, token badge, signature items, recent orders, floating cart behavior, navigation, and any existing interactive logic. Do not remove functional UI simply because the reference layout differs; integrate the reference elements compatibly.

### 3. Item Details visual alignment
- Replace placeholder product imagery with the best matching real food photography.
- Match the reference's food-image layout and brass/filter-coffee visual treatment using actual reference assets/content where available.
- Add the counter-protocol footer/section shown in the reference.
- Preserve quantity controls, add-ons, price calculation, add-to-cart actions, IDs, and all existing data/business logic. Do not rewrite the order flow.

### 4. Food Menu visual alignment
- Replace placeholder images with real food photography.
- Add category-navigation chips styled from the reference. They must work with the actual menu data: selecting a category filters the shown items, and an “All”/reset option restores the full list when appropriate. Do not hard-code categories that conflict with the current data model.
- Add the counter-protocol banner from the reference.
- Preserve `FoodCard` behavior, item links, search/filtering that already exists, responsive behavior, and menu API integration.

### 5. Design-system use
- Reuse the verified Stitch tokens from `stitch-reference/design-system/design-system.json` and existing CSS custom properties. The reported core values are primary `#c05621`, secondary `#2f855a`, tertiary `#d69e2e`, neutral `#faf5ef`; headings Noto Serif; body/UI Plus Jakarta Sans. Verify exact token names before use.
- Inspect whether those fonts are actually loaded/applied; fix scoped application only where needed without breaking existing pages.
- Do not add formal 12/8/4 grid tokens to `design-system.json` just to satisfy the report. The audit itself says direct source evidence for new token declarations is insufficient. Keep responsive layouts functional and reference-led.
- Avoid broad global CSS changes if a scoped component style will solve the discrepancy.

## Verification requirements
1. Run `git status --short` before and after and list exactly which files you changed. Never revert pre-existing changes.
2. Run the existing production build using the repository's actual script; do not assume the script name.
3. Inspect `playwright.config.js` and existing tests. Run targeted tests for the changed pages and run the suite if the required services are available. Do not treat server-start/connectivity failures as product-code failures without evidence, but record them accurately.
4. If frontend/backend services can be run safely, capture screenshots at minimum for:
   - 1366×768 desktop
   - 390×844 mobile
   for `/menu`, `/customer/dashboard`, and a valid `/customer/menu/:foodId` route. Use existing safe test data; do not mutate production/shared data.
5. Compare screenshots with the specified Stitch HTML/reference at equivalent viewport sizes. If screenshot/browser tooling is unavailable, say so explicitly and do not claim visual verification occurred.
6. Check browser console, failed network requests, image loading, and responsive overflow if the available tools permit.
7. Validate that category chips work and that quantity/add-on/cart interactions remain intact. Do not report tests as passed unless output supports the claim.

## Deliverables
- Implemented code changes for the three priority screens.
- A concise report at `stitch-reference/audit/PHASE_3B_IMPLEMENTATION_REPORT.md` containing:
  - files changed and reasons;
  - fixes completed, partially completed, and blocked;
  - food-image filenames/sources/licenses;
  - build/test commands and actual results;
  - screenshot paths and viewport sizes if captured;
  - known remaining visual mismatches and evidence limitations.
- Do not modify the earlier OpenCode audit reports to make the implementation appear verified.

## Definition of done
- No `via.placeholder.com` references remain in the three priority screens.
- Dashboard, Item Details, and Food Menu implement the reference-backed differences described above, without regressions to existing interactions.
- Build succeeds, or any failure is reproduced and reported with concrete diagnostics.
- Visual comparison is claimed only if screenshots were actually captured and checked.
- Final response is a truthful implementation summary with changed files, tests/results, screenshot evidence, and blockers. Do not say “complete” based only on code edits.
