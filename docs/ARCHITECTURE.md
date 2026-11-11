# Architecture — Hotel New Moorthi Cafe

## 01. System overview
Browser -> React frontend built with Webpack -> existing HTTP API -> Node.js/Express backend -> MongoDB through Mongoose.

The frontend must communicate with the database only through backend APIs. Secrets and privileged business rules remain on the server.

## 02. Technology constraints
| Layer | Required choice | Rule |
|---|---|---|
| Frontend | JavaScript + React | Preserve current implementation |
| Bundler/dev server | Webpack | Do not migrate to Vite |
| Backend | Node.js + Express.js | Reuse existing implementation |
| Database access | MongoDB + Mongoose | Do not alter schema/data without authorization |
| Module style | Follow existing conventions (CommonJS where used) | Avoid incompatible module patterns |
| E2E tests | Existing Playwright setup | Inspect scripts/config first |

No TypeScript/TSX, Vite, or Angular.

## 03. Repository discovery
Before implementation inspect:
- `package.json` and available scripts.
- `webpack.cjs` and Playwright configuration.
- `src/App.js`, pages, shared components, styles, and API utilities.
- Relevant backend routes/controllers/models/services when accessible.
- Existing tests, test results, and current Git status.
- Latest GitHub branch/commit and local differences when remote inspection is available.

Do not assume paths or endpoints from old reports remain current.

## 04. API and data flow
For each feature document:
1. UI page/component and user action.
2. Existing API method and path.
3. Request shape and authentication requirements.
4. Actual response and error shapes.
5. Loading, empty, success, and failure behavior.
6. Verification evidence.

Use API contracts discovered in code or verified responses. Do not invent endpoints or fields. Keep calls in the established API utility/service layer where feasible.

## 05. Boundaries
- Frontend work is primary.
- Backend changes are conditional: only if a verified requirement cannot be met with existing backend; obtain approval before changing backend behavior/contracts.
- Do not duplicate pricing, discount, order ID, pickup token, permission, or other business rules in the frontend.
- Server is authoritative for prices, discounts, totals, order validation, authentication, and authorization.
- Never trust client-submitted prices, roles, or user IDs.
- Components must not access MongoDB directly.
- Reuse existing API helpers and UI components.
- Keep changes small and compatible.

## 06. Intentional decisions and constraints
- React + Webpack is intentional.
- JavaScript-only is an explicit requirement.
- Reuse existing backend functionality rather than rebuilding it.
- Preserve the current UI/Stitch direction during integration.
- Do not perform history-rewriting or destructive Git operations.
- Do not restore deleted files or delete user-created artifacts.
- Do not overwrite local changes with remote files.
- Do not modify database contents or create real orders/payments during QA.

Add further verified decisions when discovered.

## 07. Verification strategy
Use commands actually defined in `package.json`; do not assume scripts exist.
1. Build/startup.
2. Homepage smoke test.
3. Public routes and API connectivity.
4. Authentication.
5. Food listing/details.
6. Cart and checkout validation without real submission.
7. Customer order routes with an authorized test account if available.
8. Admin workflows with authorized test credentials if available.
9. Responsive and visual checks.

Separate application defects from selector errors, server outages, and browser/environment crashes. Report blocked tests honestly.

## 08. Stop and ask
Stop before:
- Changing backend behavior/contracts, database schema/data, auth/payment flows, or permissions.
- Adding dependencies, services, environment variables, or architecture.
- Overwriting local work or removing files.
- Testing real payments/orders.
- Acting on conflicts with existing implementation.

State evidence, smallest proposed change, impact, and required approval.
