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
