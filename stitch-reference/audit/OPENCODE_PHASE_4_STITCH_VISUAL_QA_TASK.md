# Phase 4 — Stitch UI Fidelity & Playwright Verification Audit

## Role and ownership
You are **OpenCode, the independent audit and analysis agent**. Claude Code remains the sole implementation/development agent. Your job is to determine, using reproducible evidence, how closely the current frontend matches the supplied Google Stitch references and how much of the existing UI is functional.

## Goal
Audit the frontend against `stitch-reference/` using **Playwright MCP when available**, plus the project's already-installed Playwright tests. Focus on actual rendered browser output, not source-code claims alone.

The backend is reported to be working. **Do not change, restart, reconfigure, or modify backend code or database data.** This phase is frontend verification only. Do not implement fixes; report actionable findings to Claude Code.

## Non-negotiable safety and change constraints
- Inspect the current working tree (`git status --short`, current branch) before doing anything. Do not overwrite, revert, clean, stash, delete, commit, or push anything.
- Do not edit application source, CSS, dependencies, package files, Playwright configuration, test files, backend code, database data, or existing reports.
- You may create a new audit report at `stitch-reference/audit/PHASE_4_STITCH_VISUAL_QA_REPORT.md` and save screenshots/evidence under `stitch-reference/audit/evidence/phase4/`. Do not overwrite prior evidence.
- Do not install packages or alter MCP configuration.
- Never run checkout/order/payment or other mutating flows against a shared/production database. Run mutating E2E tests only if the existing project configuration clearly proves they use an isolated test database. Otherwise, limit testing to read-only navigation and UI interactions and document the restriction.
- Do not invent login credentials. Use only credentials or test fixtures already documented in the project. Never expose secrets in reports or screenshots.
- Do not claim a test, click, screenshot, visual comparison, image-load check, or console check passed unless you actually performed it.
- Do not classify placeholder images as real food photography.

## Step 1 — Reconnaissance and runtime readiness
1. Inspect `package.json`, `playwright.config.js`, existing `tests/e2e/` files, `src/App.js`, route guards/auth helpers, and the Stitch `manifest.json` and design system file.
2. Record the exact current Git state and relevant local modifications without changing them.
3. Check current frontend availability at `http://localhost:9004/` and backend availability using a read-only health/GET endpoint already documented in the project. Backend is out of scope; do not alter it.
4. Inspect available MCP tools. If Playwright MCP browser tools are available, use them for real navigation, screenshot capture, interaction, console and network observation.
5. If Playwright MCP is unavailable, say so explicitly. Use only the already-installed local Playwright CLI/package as an alternative where practical; do not describe that as MCP verification. Do not silently skip visual evidence.
6. If frontend is not running and the existing project script can start it safely, inspect the script and port first. Start only the frontend, only if port 9004 is free, and do not kill other processes. Keep backend untouched. If safe startup is not possible, record the blocker.

## Step 2 — Establish the exact Stitch-to-route mapping
Use `stitch-reference/manifest.json`, per-screen HTML, metadata, `src/App.js`, and actual route guards. Do not rely only on earlier reports. Map all implemented routes that can be checked:

### Public
- `/` — Home
- `/about` — About
- `/menu` — Food Menu
- `/gallery` — Gallery
- `/contact` — Contact
- `/login` — Customer Login
- `/signup` — Customer Signup

### Customer
- `/customer/dashboard` — Customer Dashboard
- `/customer/menu/:foodId` — Item Details (use only an ID proven by current source/fixtures)
- `/customer/orders` — My Orders
- `/cart` — Cart
- `/checkout` — Checkout
- `/order-success` — Order Success

### Admin
- `/admin/login` — Admin Login
- `/admin/dashboard` — Admin Dashboard
- `/admin/menu-management` — Menu Management
- `/admin/add-edit-food` — Add/Edit Food
- `/admin/category-management` — Category Management
- `/admin/customer-management` — Customer Management
- `/admin/sales-reports` — Sales Reports

There are 20 routes listed in the prior inventory and 30 Stitch screens. Verify the current source rather than assuming those counts still hold. Identify Stitch screens that are variants, states, or prototypes rather than inventing routes for them. Flag any route whose actual route/authorization behavior does not match expectations.

## Step 3 — Browser-based visual comparison
Priority order:
1. Customer Dashboard — `/customer/dashboard`
2. Item Details — `/customer/menu/:foodId`
3. Food Menu — `/menu`
4. Core public/customer journey: Home → Menu → Item Details → Cart → Checkout, plus Login/Signup and My Orders
5. Remaining public and admin routes

For each screen where an exact reference HTML exists:
- Open the matching Stitch reference HTML and the live application route in the browser at the **same viewport size**.
- Capture actual screenshots with viewport and route encoded in the filename. Store evidence under `stitch-reference/audit/evidence/phase4/`.
- If direct `file://` navigation to Stitch reference HTML is not supported, use an available read-only method to render the exact local reference. Do not recreate a reference from memory or compare against a different screen.
- Record whether a screenshot pair was actually captured and compared.
- Compare overall composition and content hierarchy; header/navigation; hero geometry/background; fonts and font weights; colors; spacing; borders/radius; cards; icons; food image subject/crop/aspect ratio; category chips; counter-protocol visuals; footer; mobile stacking and overflow.
- Be specific: cite the screenshot filenames and exact component/selector or source file when the evidence supports it. Distinguish confirmed visual differences from source-only suspicions.

Use these viewports where possible:
- Desktop: `1366x768`
- Tablet: `768x1024`
- Mobile: `390x844`
- Narrow mobile: `320x700`

At minimum, compare all three priority screens at desktop and mobile; capture other routes at desktop and test responsive behavior on representative public/customer/admin routes. If time/environment allows, capture all 20 routes at desktop.

## Step 4 — Functional and runtime inspection
Use Playwright MCP for live browser interaction if available and the existing Playwright CLI tests for regression coverage.

Check, where the rendered page makes the behavior available:
- Navigation links and route transitions
- Menu category chips actually filter the visible results
- Food cards and item links navigate to the correct item
- Item quantity/add-on controls visibly update state and pricing
- Add-to-cart/cart navigation, with no real order submission unless tests use a proven isolated DB
- Login/signup client-side validation and expected route guards, without exposing credentials
- Mobile menu/navigation behavior and horizontal overflow
- Missing or broken images (actual rendered `naturalWidth`/response status, not only file extensions)
- Browser console errors, uncaught page errors, failed requests and unexpected 4xx/5xx responses
- Page crashes, blank screens, loading loops, and route redirects

Important known audit leads to verify, not blindly repeat:
- Some food files were previously reported as 1x1-pixel JPEGs. Check actual rendered dimensions and content; valid JPEG signature alone is insufficient.
- `src/pages/Gallery.js` was previously reported to contain `via.placeholder.com` URLs. Verify against runtime and source, and include it in the UI findings even if broader asset replacement is deferred.
- Customer Dashboard previously had inert quantity controls and an `activeToken` value that may never be populated. Confirm current behavior through interaction/source inspection.
- Menu/Home price values may have been copied from hard-coded Item Details values. Do not endorse them as authoritative business prices; report this as a data-source question if there is no verified source.
- Browser screenshot comparison was previously not performed. Do not convert that earlier limitation into an assumed pass.

## Step 5 — Existing Playwright tests
1. Read `package.json` scripts and `playwright.config.js` before choosing commands.
2. Run relevant existing test files or `npm test` only after confirming their base URL, webServer behavior, and side-effect risk.
3. Do not change tests or config to manufacture a pass.
4. Report exact commands, actual pass/fail/skipped counts, timeout/root causes, and whether a failure is test assertion, app defect, or environment/server readiness. Do not label every failure an infrastructure issue without examining the error.
5. If safe route/visual tests can run without the backend, execute them separately and report their scope.

## Step 6 — Audit report and acceptance decision
Create `stitch-reference/audit/PHASE_4_STITCH_VISUAL_QA_REPORT.md` with:
1. **Executive decision**: `ACCEPTED`, `CONDITIONALLY ACCEPTED`, or `NOT ACCEPTED` for visual fidelity, with a short evidence-based rationale.
2. **Environment/evidence matrix**: whether Playwright MCP was available; frontend/backend availability (backend read-only status); commands run; screenshots captured; and viewport sizes.
3. **Route mapping matrix**: Stitch reference path/screen ID, actual route/component, access condition, and verification status.
4. **Per-screen comparison matrix**: Stitch screenshot path, app screenshot path, pass/minor/major/blocker differences, and reproducible notes.
5. **Functional test matrix**: test/action, result, evidence, and whether it was safe/read-only.
6. **Console/network/asset findings**: actual URL/request or image path, status, and observed effect.
7. **Playwright test result summary**: exact command and raw test totals.
8. **Prioritized findings for Claude Code**: P0/P1/P2 with precise file/component and expected correction. Do not modify them yourself.
9. **Coverage and limitations**: explicitly list routes/screens not visited, comparisons not performed, and tests blocked by auth/server/safety constraints.
10. **Final acceptance decision**: no production-ready claim if real imagery is still missing, screenshots are not compared, or critical route flows are unverified.

## Definition of Done
- Current Git state and runtime prerequisites documented.
- Playwright MCP was used if available; otherwise its absence is explicit and existing Playwright tests used where practical.
- At least Customer Dashboard, Item Details, and Food Menu have actual reference-vs-app screenshot pairs at desktop and mobile, or each failure/blocker is explicitly documented.
- Existing tests were run safely and reported accurately.
- Routes, responsive states, images, console/network errors, and visible interactions are evidence-based.
- The audit report is created without modifying app source/backend/dependencies/tests or Git history.
- The report ends with a clear prioritized handoff to Claude Code.
