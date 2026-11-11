# Claude Code — Phase 3C Finalization Task

## Role
You are the sole developer/implementation owner for the Hotel New Moorthi Cafe web application. OpenCode is the independent auditor. Work in the existing repository and preserve all user changes.

## Current Known State
The latest report is `stitch-reference/audit/PHASE_3C_REMEDIATION_REPORT.md`.
- `npm run build` reportedly succeeded with 3 webpack warnings.
- E2E tests reportedly failed because `http://localhost:9004` was unavailable.
- The six files under `public/assets/food/` are 332-byte, 1×1-pixel JPEG placeholders, not actual food photography.
- Dashboard counter protocol is claimed to exist, but visual equivalence to the Stitch reference has not been checked in a browser.
- The report says prices were changed from examples such as `$8.99` to values such as `₹399`. Verify that every numeric amount is supported by an authoritative existing source; do not invent or silently convert prices.
- Screenshot comparison has not been performed.

## Required Work — Execute, Do Not Stop At Planning

### 1. Inspect Before Editing
- Inspect current `git status`, relevant diffs, the six asset files, `src/pages/Home.js`, `src/pages/Menu.js`, `src/pages/CustomerDashboard.js`, `src/pages/CustomerFoodDetail.js`, relevant `FoodCard` code, and existing data/API contracts.
- Preserve all pre-existing and uncommitted work. Do not reset, stash, clean, delete unrelated files, commit, or push.
- Do not modify backend business logic or install dependencies.

### 2. Food Photography (P0)
- Do not treat valid file signatures, 1×1 pixels, blank images, generated SVG placeholders, or HTML error pages as real food photography.
- Search the existing repository and already available local assets for authentic images first. Use only image files whose actual visual content can be inspected and whose relevance to the dish is reasonable.
- Replace the six 1×1 placeholders with genuine dish-appropriate food photographs if available locally.
- If no authentic images exist locally and network access prevents retrieving them, do not fabricate success. Keep the limitation explicit and make the UI degrade gracefully (for example, a clearly styled local fallback), but report this as unresolved and not production-ready. Do not leave 1×1 pixels presented as finished food imagery.
- Verify file signatures, dimensions, file sizes, and that local public URLs resolve in the running frontend when possible.

### 3. Prices and Currency (P1)
- Audit all price labels in `Home.js`, `Menu.js`, `CustomerFoodDetail.js`, and relevant cards.
- Use INR display consistently only when supported by project requirements/reference/backend data.
- Do not replace values like `$8.99` with arbitrary values like `₹399` merely to change currency formatting. Numeric values must come from the current API/model, explicit Stitch source data, or an already authoritative project source. If no authoritative value exists for static demo content, preserve the numeric amount and document the ambiguity rather than inventing business prices.
- Do not modify backend calculations, stored values, or API contracts.

### 4. Dashboard Counter Protocol (P1)
- Inspect the current `CustomerDashboard.js` and compare the actual markup with `stitch-reference/screens/07-customer-dashboard/customer-dashboard.html`.
- If the counter-protocol section is already present, verify that its content and styling align with the reference and avoid duplicating it. If missing, implement it.
- Preserve authentication, recent orders, token and cart behavior. Document any inert/empty handlers without silently changing business behavior outside the task.

### 5. Item Details Integrity
- Verify the breadcrumb points only to registered routes.
- Review `selectedRatio`; remove it only if clearly dead and not part of the intended UI. Do not make speculative functionality changes.
- Preserve quantity, add-on, total calculation and add-to-cart logic.

### 6. Verification
- Run `npm run build` and record its actual exit status and warnings.
- Run appropriate existing static/targeted tests that do not require live services.
- If safe and possible, start only the project's existing frontend server and capture browser screenshots at the required desktop and mobile sizes. Do not change ports or configuration without a clear need.
- If E2E tests require the backend or seeded test data, verify test environment safety first. Never point tests at production/shared data. If servers are unavailable, record exact failures as blocked, not as passed.
- Do not claim screenshot comparison unless actual screenshots were captured and compared against the exact Stitch references.

## Report
Update `stitch-reference/audit/PHASE_3C_REMEDIATION_REPORT.md` so it is a clean, internally consistent report that replaces obsolete contradictory statements rather than appending another conflicting summary. Record:
- actual files changed;
- asset names, dimensions, sizes, and genuine visual-content status;
- price source for every changed numeric value;
- commands run, exit codes and test summaries;
- whether screenshots were captured and compared;
- remaining blockers and a clear decision: ACCEPTED, CONDITIONALLY ACCEPTED, or NOT ACCEPTED.

## Completion Rule
Do not label the project production-ready while the food assets remain 1×1 placeholders, numeric prices are unsupported, required runtime tests are unverified, or visual comparison is still pending. Never claim evidence that was not collected.
