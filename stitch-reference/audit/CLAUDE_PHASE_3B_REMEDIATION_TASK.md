# Claude Code — Phase 3B Remediation Task

## Role
You are the sole implementation owner for Phase 3B in the existing local repository `D:\project\moorthi_cafe_webapp`. Continue from the CURRENT working tree. Preserve all existing valid changes and do not reset, stash, clean, delete, commit, or push anything.

## Why remediation is required
The previous run log does **not** establish completion:
- It first claimed real food photography, then reported downloaded images were HTML/corrupted, and finally said it created **SVG placeholder images**. SVG placeholders do not satisfy the requirement for real food photography.
- The log says browser screenshots were not captured or compared.
- The log says all 43 Playwright tests failed because services were unavailable. This leaves runtime behavior unverified.
- Intermediate edit output shows duplicated menu-item arrays and possible duplicate imports / hook logic. Inspect the CURRENT files and fix only problems that are actually present.
- The report contains contradictory statements and overstates completion. Correct it to match evidence.

## Hard constraints
1. Work only in the existing local repository and inspect `git status` and relevant diffs first. Preserve uncommitted user work.
2. Keep the current stack: React + Webpack + JavaScript (no TypeScript, no Vite), existing Express/API integration, and current business logic.
3. Do not invent Stitch URLs, assets, food image URLs, ratings, product data, or claims of testing.
4. Do not change backend business logic or add dependencies.
5. Do not call the work complete without evidence. No commit or push.

## Implementation and verification steps

### A. Inspect the actual current state
- Read the task, the Phase 3A visual audit, exact Stitch reference HTML for:
  - `stitch-reference/screens/07-customer-dashboard/customer-dashboard.html`
  - `stitch-reference/screens/08-item-details/item-details.html`
  - `stitch-reference/screens/03-food-menu/food-menu.html`
- Inspect `src/pages/CustomerDashboard.js`, `src/pages/CustomerFoodDetail.js`, `src/pages/Menu.js`, `src/components/FoodCard.js` if present, relevant CSS in `src/index.css`, and the contents of `public/assets/food/`.
- Inspect `package.json`, `playwright.config.js`, and the target E2E tests.
- Record the starting `git status`; do not assume old report file lists are still accurate.

### B. Fix food image assets properly
- Search the three priority screens and relevant components for `via.placeholder.com`, fake URLs such as `lad-specific-image-path`, references to non-existent files, and any SVGs that are only generic placeholders.
- Prefer already-available authentic food image assets in the repository. If no valid assets exist and network access is available, fetch suitable real food photographs from a stable source; otherwise report this blocker and do not pretend placeholders are photographs.
- Validate every local asset: it must exist, be non-empty, have a matching file format/signature, and be a genuine food photograph (not an HTML error page or generic SVG). Check dimensions and file type using available local tools. Do not rename HTML or SVG content to `.jpg`.
- Ensure all image `src` paths resolve from the app's actual public asset root. Add meaningful alt text and a graceful error state if needed.
- Do not create duplicate records for the same menu item. Keep the intended existing data/API behavior intact.

### C. Implement only the audited visual gaps
1. **Customer Dashboard** (`src/pages/CustomerDashboard.js`): add the reference-supported hero gradient and brass/woodfire accents; add the counter protocol section shown in the reference. Preserve greeting, token badge, recent orders and existing cart behavior.
2. **Item Details** (`src/pages/CustomerFoodDetail.js`): use valid food photography and the reference-supported brass/filter-coffee treatment and counter-protocol section. Preserve quantity changes, add-ons, price calculation, add-to-cart and navigation behavior.
3. **Food Menu** (`src/pages/Menu.js`): add functional category chips based on actual available data and the reference-supported counter protocol banner. Ensure filtering produces the expected items and preserves routing/auth behavior.
4. Use the existing design tokens/fonts where already available. Do not introduce redundant global tokens or claim 12/8/4 CSS grid-token compliance unless the current source explicitly defines and uses these values. Do not add fictional “brand claims” or dates unless shown in the Stitch reference.

### D. Code integrity review
- Check for duplicate imports, duplicate menu arrays/IDs, duplicated map expressions, unmatched JSX, duplicated `useEffect` blocks, malformed dependencies, and unused variables caused by the previous run.
- Check all three screens use the correct data source and don't introduce hard-coded demo data over real API data unless that was already the explicit design and is clearly labelled.
- Preserve existing React Router paths and API contracts.
- Use the smallest coherent diff; don't rewrite entire pages just to make the code look different.

### E. Run validation
- Run `npm run build` and capture the exact exit status/output.
- Inspect the Playwright configuration before starting tests. Start services only if the repository scripts make that safe; do not touch production/shared databases. Never assume a backend is isolated—positively verify its configured database first before any flow that can mutate it.
- Run targeted menu, dashboard, item detail, responsive and cart tests. If they require unavailable services, report each blocker explicitly rather than labelling all failures as harmless infrastructure failures without evidence.
- Check all food asset URLs return successfully and serve image content (not HTML errors).
- If browser tooling is available, capture real screenshots at a desktop viewport and a mobile viewport for each of the three pages. Compare the screenshots against the exact Stitch reference screenshots/HTML; list concrete differences. If browser tools are unavailable, say so plainly and leave visual verification pending.

### F. Update the report honestly
Update `stitch-reference/audit/PHASE_3B_IMPLEMENTATION_REPORT.md` to contain:
- actual files changed (from `git status` / diff);
- image asset inventory with file type, dimensions, and validation outcome;
- build command and exact result;
- exact targeted test counts (passed/failed/skipped) and relevant failure reasons;
- screenshot file paths and viewport dimensions, only if screenshots actually exist;
- per-screen status: Implemented / Partially implemented / Blocked / Verified;
- explicit remaining discrepancies and risks.

Remove contradictory duplicated sections and unsupported statements such as “production-ready”, “all visual alignment achieved”, or “real photography complete” unless evidence proves each claim. A successful build alone does not prove runtime, interaction, or visual parity.

## Definition of Done
The phase can be marked **implementation complete, verification pending** only if the code changes are in place but runtime/screenshot checks remain blocked. Mark it **verified** only when valid real food photographs are present, the build passes, targeted tests pass (or any failure is transparently documented), the three screens are inspected in an actual browser, screenshots are compared with the references, and the report matches the evidence.

Begin now. Do not stop at another plan, and do not request approval for the fixes in this task. If an environmental blocker makes a step impossible, complete every safe independent step and record the blocker precisely.
