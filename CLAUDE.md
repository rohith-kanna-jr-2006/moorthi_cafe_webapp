# Claude Code Project Guide — Hotel New Moorthi Cafe

## Project Context

- Project: Hotel New Moorthi Cafe web application
- Local repository (as provided): `D:\project\moorthi_cafe_webapp`
- Development URL: `http://localhost:9003/`
- Frontend: React + Webpack + JavaScript
- API base URL for the ordering workflow: `http://localhost:5000/api/v1`
- Design reference: [Google Stitch project](https://stitch.withgoogle.com/projects/10226317095148879480)

This file is the project-specific working guide for Claude Code and other coding agents. Inspect the repository before making assumptions about its current contents.

## Mandatory Technology Constraints

- Keep the existing React + Webpack architecture.
- Use JavaScript only. Do not introduce TypeScript, `.ts`, `.tsx`, Vite, or Angular.
- Follow the existing module system and conventions found in the repository.
- Do not create a second frontend application, duplicate `client/` folders, or duplicate global stylesheets.
- Reuse existing components and design tokens when appropriate.
- Do not add dependencies or change package versions without explicit approval.
- Do not replace existing API integration with mock data.
- Do not hardcode production food prices, GST, packaging charges, stock status, or pickup tokens.
- Preserve backend contracts, business logic, authentication, role-based access control (RBAC), and existing working behavior unless the task explicitly authorizes a change.
- Do not invoke, install, restore, or follow Ponytail or any Ponytail-specific workflow, skill, agent, hook, or command.

## Working Protocol

1. Inspect the current branch and working tree before editing:
   - `git status --short --branch`
   - `git branch --show-current`
   - Review relevant source files and existing diffs.
2. Read the relevant page, component, stylesheet, route definition, API helper, and tests before changing them.
3. Identify the root cause before adding a workaround.
4. Make the smallest complete change that solves the requested problem.
5. Keep changes scoped to the task. Preserve unrelated modifications and untracked files.
6. Validate with the checks that are actually available: existing build, tests, browser/MCP tools, and `git diff --check`.
7. Report commands actually run, real outcomes, modified files, and remaining blockers. Never claim a test passed if it was not run.
8. If browser verification is unavailable, state that it is unverified; do not infer visual correctness from source code alone.
9. Do not read out or expose `.env` values, API keys, credentials, cookies, or tokens.

## Git Safety

- Follow the user's current task instructions for whether Git operations are allowed.
- Unless a task explicitly authorizes it, do not commit, push, pull, reset, stash, clean, or delete files.
- Never force-push unless specifically authorized and there is a safe, reviewed reason.
- Do not stage ignored files or secret-bearing configuration blindly.
- Review staged changes before committing when commits are authorized.

## Existing Frontend Context

Previously reported source locations include:

- `src/index.js` — React entry point; global CSS should be imported here once.
- `src/App.js` — route configuration and application composition.
- `src/index.css` — global theme and shared styles.
- `src/pages/` — public pages such as Home, About, Menu, Gallery, and Contact.
- `src/components/` — shared components such as Navbar, Footer, and FoodCard.
- `src/admin/` — admin screens, based on previously reported imports.
- `webpack.cjs` — Webpack configuration.

These locations are based on prior project reports. Confirm the actual current repository structure before relying on them.

## CSS and Design Rules

- The global stylesheet should be loaded exactly once from the appropriate entry point (reported as `import './index.css';` in `src/index.js`).
- Avoid conflicting global selectors, duplicated rules, broad selector side effects, and unnecessary `!important` declarations.
- Use shared CSS custom properties for theme values and consistent component styles.
- Match the actual Google Stitch references when they are retrievable. A configured MCP server alone does not prove that Stitch is connected; verify with a real tool call.
- Token matching alone does not prove visual fidelity. Compare actual rendered screenshots with actual design references when browser tools are available.

## API and Ordering Rules

API base URL: `http://localhost:5000/api/v1`.

Planned/reported endpoints:

- `GET /categories`
- `GET /foods?category=...&search=...`
- `POST /auth/signup`
- `POST /auth/login`
- `POST /orders/preview`
- `POST /orders`
- `GET /admin/dashboard`
- `GET /admin/orders?status=all`
- `PATCH /admin/orders/:id/status`

Treat these as the team's supplied endpoint plan, not proof that every endpoint is implemented. Confirm routes, response envelopes, field names, authentication rules, validation, and status codes with the backend owner (Ragul) before integration.

- Protected requests use `Authorization: Bearer <token>` where required by the confirmed contract.
- Store the returned authentication token under `moorthi_token` only if this matches the actual backend response/contract.
- Cart item shape agreed by the team: `{ foodId, name, price, quantity }`.
- Checkout item shape agreed by the team: `{ foodId, quantity }`.
- The backend is authoritative for prices, subtotal, GST, packaging charges, order creation, and pickup-token generation.
- Use an `Idempotency-Key` for logical order submission attempts if supported by the backend contract.
- Clear the cart only after confirmed successful order creation.
- Handle 401 responses according to the agreed auth flow; the current contract says clear `moorthi_token` and require sign-in.
- Do not implement Google login until the backend/Firebase ownership and contract are confirmed.

## Definition of Done

A task is complete only when the requested changes have been made, the relevant available checks were actually run, existing behavior was preserved, and the final report distinguishes verified facts from assumptions and blocked checks.

---

## 1. Exact Project Paths

Primary execution root:
`D:\project\moorthi_cafe_webapp`

Original source-code fix workspace:
`D:\project\moorthi_cafe_original_fix`

Rules:
- Run Claude Code from the existing primary execution root.
- Use the already-installed node_modules, Playwright, MCP configuration, and project scripts.
- Do not create another project root.
- Do not install duplicate packages.
- Keep source-code changes isolated in the original-fix workspace.
- Do not copy files between workspaces without comparing their contents first.

---

## 2. Technology and Architecture Restrictions

Preserve the existing architecture:

- JavaScript only.
- React + Webpack.
- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- CommonJS modules.

Strictly prohibited:
- TypeScript (.ts/.tsx).
- Vite.
- Angular.
- Duplicate package installations.
- Unnecessary framework migrations.
- Unrelated source-code changes.

Do not change backend business logic unless the task requires it and the root cause is supported by evidence.

---

## 3. Clear Tool Responsibilities

### A. Playwright MCP: Actual Browser Interaction

Use Playwright MCP for:
- Opening real websites.
- Browser navigation.
- Clicking and typing.
- Form submissions.
- Login and registration.
- Menu browsing.
- Cart and checkout interactions.
- Actual order workflows.
- Screenshots.

Do not claim MCP browser testing unless actual browser MCP calls were performed.

### B. Playwright Test: Repeatable Automated Testing

Use the already-installed Playwright Test package for:
- Regression testing.
- Functional testing.
- API response assertions.
- Cart calculations.
- Authentication tests.
- Checkout validation.
- Order creation and history.
- Mobile responsive testing.
- HTML reports and traces.

Use the existing project configuration. Do not create another standalone Playwright environment.

### C. Chrome DevTools MCP: Browser Debugging

Use Chrome DevTools MCP when available to investigate:
- Browser console errors.
- Failed network requests.
- API response status and body.
- CORS failures.
- JavaScript runtime errors.
- Performance traces.
- Browser screenshots.

First verify that the existing MCP is available. Do not install another copy if one is already configured.

### D. Claude Code Native Tools: Source-Code Engineering

Use native file, terminal, and Git tools for:
- Reading source code.
- Inspecting dependencies.
- Reviewing environment configuration.
- Finding root causes.
- Editing source code.
- Running tests and builds.
- Inspecting Git differences.

### Tool Usage Requirements

These tools have different responsibilities. Do not substitute one for another.

For every task:
1. Identify the actual available MCP tools.
2. Use the correct tool for its assigned responsibility.
3. Record the actual tool calls and results.
4. Report unavailable tools honestly.
5. Never fabricate a tool call or its output.

API checks using HTTP requests are supplemental. They are not a replacement for actual browser testing.

---

## 4. Autonomous QA and Bug-Fix Workflow

Whenever a website issue or testing task is provided, follow this sequence:

1. Inspect repository structure and Git status.
2. Read relevant project instructions and source code.
3. Verify the local and remote environment configuration.
4. Reproduce the issue using Playwright MCP.
5. Capture screenshots and exact reproduction steps.
6. Inspect console and network failures using DevTools MCP.
7. Identify the root cause using source-code evidence.
8. Implement the smallest appropriate source-code correction.
9. Add or update regression tests.
10. Run relevant Playwright Test cases.
11. Reopen the affected page using Playwright MCP.
12. Repeat the original browser actions.
13. Verify console errors and failed network requests.
14. Run relevant build and validation checks.
15. Prepare a final evidence-based report.

Continue for up to five evidence-driven fix-and-test iterations.

Do not repeat an unsuccessful fix without a new diagnosis.

Stop and report BLOCKED when a real external dependency, permission, credential, or environment blocker prevents completion.

---

## 5. Moorthi Cafe Environment Configuration

Production frontend:
`https://moorthicafe.netlify.app/`

Production API:
`https://moorthi-cafe-api.onrender.com/api/v1`

Staging frontend:
`https://moorthi-cafe-staging.netlify.app/`

Staging API:
`https://moorthi-cafe-webapp.onrender.com/api/v1`

Staging database expected name:
`moorthi_cafe_staging`

Do not assume that a successful health check proves the actual database name.

Verify the effective database configuration and target using non-secret evidence.

Never print MongoDB URIs, passwords, API keys, Firebase credentials, JWT secrets, or other environment secrets.

---

## 6. Critical Production Safety Rules

Production must remain READ-ONLY.

Never perform these actions on production:

- Customer registration.
- Account creation or modification.
- Order creation.
- Menu seeding or import.
- Database inserts, updates, deletes, or migrations.
- Payment attempts.
- Destructive operations.

Production website testing may only use read-only browser operations.

Never run a staging seed script against production.

Do not deploy, push, or modify production infrastructure without explicit authorization.

---

## 7. Staging Database Seeding Gate

The user has conditionally authorized staging menu seeding.

This authorization is valid only after the complete seed execution path has been verified.

Before executing any seed script, inspect:

- `backend/scripts/seedMenu.js`
- `backend/src/utils/seedGuard.js`, if present
- Imported database configuration modules.
- Environment-variable loading and fallback logic.
- MongoDB connection implementation.
- Actual menu dataset.

Verify ALL conditions:

1. NODE_ENV is exactly `staging`.
2. Effective MongoDB database name is exactly `moorthi_cafe_staging`.
3. Production database name `moorthi_cafe` is explicitly rejected.
4. Database safety guard executes before mongoose.connect().
5. No imported configuration or fallback can silently select production.
6. The seed script's writes and update behavior are understood.
7. Idempotency and duplicate-record behavior are understood.
8. Existing unrelated staging records will not be deleted or overwritten.

If any condition cannot be proven, STOP. Do not seed.

If every condition passes:
- Use the existing verified staging configuration.
- Set `ALLOW_STAGING_SEED=true`.
- Run the existing seed script once.
- Never expose credentials in terminal logs.
- Capture actual execution output.
- Verify resulting category and food counts using read-only staging requests.

Do not request additional approval for this already-authorized staging-only operation when all checks pass.

---

## 8. Actual Staging Customer Journey

After successful menu seeding, perform the following with Playwright MCP and Playwright Test.

1. Verify staging frontend and API.
2. Verify the staging database identity.
3. Create exactly one dummy customer account.
4. Log in with that account.
5. Browse real staging menu items.
6. Add food items to the cart.
7. Verify quantities and server-calculated order total.
8. Confirm Cash on Delivery is the only available payment method.
9. Place exactly one staging test order.
10. Verify the actual persisted order ID.
11. Verify the actual generated pickup token.
12. Verify order history contains the placed order.

Important:
- All account and order writes must target staging.
- Never use a production account.
- Never initiate a real payment.
- Do not create duplicate orders when a request times out.
- Check order history and idempotency evidence before retrying an uncertain order submission.
- Do not fabricate order IDs or pickup tokens from unit tests.

If registration requires an unavailable OTP or external service, report the blocker rather than bypassing authentication.

---

## 9. Browser Evidence and Artifacts

Capture actual:
- Screenshots.
- Playwright traces.
- Browser console logs.
- Failed request details.
- Network response status and relevant response bodies.
- Test execution outputs.
- Browser viewport details.

Store QA artifacts under:

`D:\project\moorthi_cafe_webapp\artifacts\playwright\moorthi-cafe-e2e\`

Do not create another project root.

---

## 10. Testing and Reporting Rules

Clearly distinguish:

- Playwright MCP browser interactions.
- Playwright Test results.
- API checks.
- Unit tests.
- Static code inspection.
- Build and validation results.

Every PASS must have an actual corresponding assertion or browser operation.

Use these statuses:

- PASS: Actual expected behavior verified.
- FAIL: Actual test or assertion failed.
- BLOCKED: Test could not be executed because of a documented blocker.
- NOT TESTED: No execution evidence exists.

Do not mark a test PASS simply because a test file exists or code was inspected.

Do not weaken test assertions merely to achieve a passing result.

For CORS tests, verify the actual backend CORS policy, including origin and credentials behavior. Do not assume wildcard origins are valid with credentials.

---

## 11. Git and Workspace Protection

Before every source-code modification:
- Check Git status.
- Inspect existing changes.
- Preserve all user modifications.
- Preserve every existing untracked file.

Never run:
- git clean.
- git reset --hard.
- Broad git restore.
- Destructive directory removal.

Do not stage, commit, push, or deploy without explicit authorization.

---

## 12. Final QA Report

Update:

`artifacts/playwright/moorthi-cafe-e2e/FINAL_QA_REPORT.md`

Include:

1. Execution environment and timestamp.
2. Actual frontend and API URLs.
3. Verified database identity.
4. Tool availability and actual tool usage.
5. Test suite names and exact execution results.
6. Browser screenshots and trace locations.
7. Console and network findings.
8. Seed audit and seed execution evidence.
9. Registration and login results.
10. Menu and cart results.
11. COD validation.
12. Actual staging order ID and pickup token, if generated.
13. Order history verification.
14. Production safety confirmation.
15. Remaining blockers and defects.

Do not mix test totals from different runs.

The overall status must be PASS or BLOCKED, with clear evidence.

---

## 13. Success Criteria

Declare the Moorthi Cafe QA task complete only when:
- The real staging environment is verified.
- The staging seed operation is proven safe and completed.
- The customer account is created and login works.
- Actual menu items are available.
- Cart calculations are verified.
- COD-only checkout is verified.
- Exactly one staging order is successfully placed.
- Persisted order ID and pickup token are verified.
- Order history is verified.
- Relevant browser and automated tests pass.
- Production remains untouched.

Never claim completion without evidence.

---

## 14. Current Task Boundary

When asked to update CLAUDE.md:
- Only inspect and modify CLAUDE.md.
- Do not run the seed operation.
- Do not perform browser tests.
- Do not modify application source code.
- Do not install packages.
- Do not modify environment files.

After updating, show:
1. Existing instructions preserved.
2. New sections added.
3. Any conflicting instructions resolved.
4. Exact CLAUDE.md path.
5. Git diff for CLAUDE.md only.

Wait for the next task after completing this documentation update.