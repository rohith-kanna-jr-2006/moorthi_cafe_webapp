# Agent Guidelines — Hotel New Moorthi Cafe

## Mission

Work as a careful implementation agent for the existing Hotel New Moorthi Cafe frontend. Deliver small, verifiable changes that preserve the current application and align with the team's agreed product requirements and Google Stitch designs.

## Before Any Task

1. Read `../../claude.md`, `prd.md`, `architecture.md`, and `design.md` when relevant to the task.
2. Inspect the repository, package scripts, routes, and relevant source files before editing.
3. Check `git status --short --branch` and preserve pre-existing changes.
4. Confirm whether the task is read-only or authorizes code changes and/or Git operations.
5. Check which MCP tools are actually available in the current session before relying on them.

## Implementation Principles

- Existing stack only: React + Webpack + JavaScript + existing styling approach.
- No TypeScript, Vite, Angular, duplicate project folder, unnecessary dependency, or unrelated refactor.
- Prefer a minimal complete fix over broad rewrites.
- Fix root causes instead of masking symptoms.
- Reuse shared components and design tokens.
- Keep page-specific layout scoped and avoid global CSS leakage.
- Preserve routes, component contracts, data flow, backend integration, authentication, and RBAC.
- Never fabricate backend response fields or business rules.
- Do not hardcode production food prices, bill calculations, GST, packaging fees, availability, or pickup tokens.
- Do not invoke or follow Ponytail or any Ponytail-specific workflow.

## Agent Responsibilities by Workstream

### Rohith — Home/Menu and Shared UI

- Shared CSS theme, Navbar, Footer, page container, shared button and card styling.
- Home page and restaurant information sections.
- Food cards, category filters, menu search.
- Category and food-list API integration after contract confirmation.
- Loading, empty, error, and retry states.
- Shared CSS/responsive support for checkout and integration regressions.

Primary branch: `feature/home-menu-ui`.

### Ravi — Customer Ordering and Admin

- Signup/login screens and authentication integration.
- `AuthContext.js`, `CartContext.js`, persisted cart, quantity/remove controls.
- Cart billing and checkout UI, order preview, pickup selection, kitchen notes.
- Order creation, idempotency handling, success page and backend-provided pickup details.
- Admin dashboard, order list, and order status updates.

Reported branches: `feature/auth-cart`, `feature/checkout-orders`, `feature/admin-dashboard`.

### Ragul — Backend Contract/Integration

- Confirm endpoint availability and exact API contracts.
- Confirm response envelopes, field names, validation errors, HTTP status codes, auth requirements and order-state transitions.
- Confirm backend-calculated billing rules, packaging charge, GST rules and pickup-token convention.
- Review integrated frontend behavior against the backend.

Integration branch: `integration/frontend`.

These are the team's agreed responsibility areas. Confirm repository branches and team arrangements before operating on Git.

## API Contract Discipline

The team's supplied API base URL is `http://localhost:5000/api/v1`. Confirm the actual backend implementation before wiring fields to UI. Do not presume that an endpoint exists just because it is listed in `prd.md` or supplied in a task.

For any API feature:
1. Inspect the backend contract or ask for Ragul's verified details.
2. Implement request construction and response parsing based on actual field names.
3. Handle loading, empty, validation, network, server, and unauthorized states.
4. Avoid logging secrets, credentials, tokens, or sensitive customer data.
5. Test success and error cases where tools/data are available.

## UI Verification Protocol

- Use existing Playwright MCP/browser tooling when available.
- Do not assume locally installed Playwright browsers exist just because the package is present.
- Prefer existing connected browser tools over installing new browser binaries, if project constraints prohibit installation.
- Test relevant desktop and mobile viewports.
- Inspect computed styles, console errors, failed CSS/font/image requests, horizontal overflow, and interactions.
- Use real screenshots for visual comparison; source inspection and CSS tokens alone do not establish visual fidelity.
- A Stitch MCP configuration is not proof of connectivity. Retrieve a real project/screen to verify it.

Suggested viewports: `1280×720`, `768×1024`, `430×932`, `390×844`, `360×800`.

## Validation and Final Report

Run only existing, appropriate commands. Common project commands reported earlier are:

- `npm run build`
- `npm test` (previously reported as a placeholder; inspect the current script before using)
- `git diff --check`

Report:
- What changed and why.
- Every file changed.
- Commands actually executed and their real outcomes.
- Browser/screenshots/tests that were actually performed.
- Remaining defects and blockers.
- Final Git working-tree status when relevant.

Use `PASS`, `FAIL`, `BLOCKED`, or `NOT TESTED` precisely. Never mark a page as passed only because its route exists or the build succeeds.

## Safety and Git

- Follow the user's current explicit authorization.
- Preserve unrelated modifications and untracked files.
- Never expose `.env` contents or credentials.
- Do not blindly stage ignored files or local MCP configuration.
- Never use force-push to bypass a rejected push.
- Do not commit/push unless explicitly authorized by the current task.
