# Architecture — Hotel New Moorthi Cafe

## 1. Current Technology Baseline

The project has previously been reported as an existing React application using Webpack and JavaScript. Preserve this architecture unless the user explicitly authorizes a migration.

- UI: React
- Routing: React Router (the repository was previously reported to use `react-router-dom`)
- Bundling/dev server: Webpack via `webpack.cjs`
- Styling: CSS with shared custom properties in `src/index.css`
- Backend API base supplied by the team: `http://localhost:5000/api/v1`
- Local frontend URL reported: `http://localhost:9003/`

Verify the current `package.json`, `webpack.cjs`, lockfile, and route definitions before relying on version or script details.

**Do not migrate to Vite.** One earlier task prompt mentioned Vite, but the project-specific constraints and prior source reports establish React + Webpack as the intended current architecture.

## 2. Previously Reported Source Layout

The following paths were found in previous reports; check the current repository before changing or creating files.

```text
src/
├── index.js                 # React entry point; global CSS import
├── App.js                   # Route definitions and app composition
├── index.css                # Global CSS tokens and shared styles
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   └── FoodCard.js
├── pages/
│   ├── Home.js
│   ├── About.js
│   ├── Menu.js
│   ├── Gallery.js
│   └── Contact.js
└── admin/
    ├── AdminLogin.js
    ├── AdminDashboard.js
    ├── MenuManagement.js
    ├── AddEditFood.js
    ├── CategoryManagement.js
    ├── CustomerManagement.js
    └── SalesReports.js
```

Other relevant files reported earlier:

- `package.json`
- `package-lock.json`
- `webpack.cjs`
- `public/` for static assets and HTML, depending on actual configuration

This is a reference map, not a guarantee that every file or feature currently exists.

## 3. Logical Frontend Layers

### Presentation layer

- Public pages: Home, About, Menu, Gallery, Contact.
- Ordering pages/components: signup, login, cart, checkout, success page, and any order-history page only if agreed/implemented.
- Admin screens: login, dashboard, menu management, food create/edit, categories, customers, sales reports, and order management when present.
- Shared UI: Navbar, Footer, PageContainer, buttons, FoodCard, input/form components, loading/error/empty states.

### State layer

Planned shared contexts, subject to fitting the existing app structure:

- `AuthContext.js`: authenticated user and token/session behavior.
- `CartContext.js`: cart items and quantity operations.

Do not create duplicate contexts if equivalent shared state already exists. Persist cart data to `localStorage` if this is consistent with the agreed behavior. Keep authentication/session handling aligned with the backend's actual contract.

### API integration layer

Prefer a shared API helper/client if one already exists. It should centralize:

- API base URL configuration.
- Request construction and JSON parsing.
- Bearer token attachment for protected requests.
- Normalized error handling based on the real response contract.
- 401/session handling according to the agreed rules.

Do not introduce a new API abstraction solely for its own sake. Follow existing code conventions and verify API envelopes with Ragul.

## 4. Route Areas

Previously reported public routes:

- `/`
- `/about`
- `/menu`
- `/gallery`
- `/contact`

Previously reported admin screens include login, dashboard, menu management, add/edit food, category management, customer management, and sales reports. Exact paths must be read from `src/App.js`; do not assume path names from component names.

Planned ordering routes (for example signup, login, cart, checkout, success and order history) must be integrated into the real route configuration only after checking whether they already exist and agreeing route names with the team. Do not invent route paths that conflict with existing routes.

## 5. API Boundaries

Base URL supplied by the team:

`http://localhost:5000/api/v1`

| Method | Endpoint | Frontend responsibility |
|---|---|---|
| GET | `/categories` | Render available categories |
| GET | `/foods?category=...&search=...` | Render/search/filter menu items |
| POST | `/auth/signup` | Submit registration form |
| POST | `/auth/login` | Submit credentials and handle returned session |
| POST | `/orders/preview` | Request server-calculated bill |
| POST | `/orders` | Submit checkout and render returned order |
| GET | `/admin/dashboard` | Render admin statistics/summary |
| GET | `/admin/orders?status=all` | Render orders |
| PATCH | `/admin/orders/:id/status` | Submit an authorized order-status change |

These endpoints are team-supplied target contracts. Confirm they are implemented and verify actual request/response structures before integration.

### Request conventions

- Attach `Authorization: Bearer <token>` to protected requests when the backend requires it.
- Token storage key is agreed as `moorthi_token`, but validate the actual login response before coding its extraction.
- Category/search query parameters must be encoded safely.
- Handle loading, empty, API validation, network, server, and unauthorized states.
- Do not render raw server errors or log sensitive data without appropriate handling.

### Authoritative data rules

- Food name, price, availability and category should come from the backend response.
- Checkout sends the agreed reduced item shape `{ foodId, quantity }`.
- The backend calculates subtotal, GST, packaging charge, and total.
- The backend creates the order and generates order/pickup identifiers.
- The frontend must not invent a pickup token or treat a client-calculated amount as authoritative.
- Use an `Idempotency-Key` per logical checkout attempt if the backend supports/mandates it.
- Do not clear the cart before confirmed successful order creation.

## 6. Order Flow (Target Behavior)

```text
Menu (categories + foods from API)
    ↓
Cart (foodId, name, price, quantity)
    ↓
Authentication when required
    ↓
Checkout (foodId, quantity + pickup choice + notes)
    ↓
POST /orders/preview
    ↓
Render server-calculated bill
    ↓
POST /orders with Bearer token and idempotency key
    ↓
Confirm successful response
    ↓
Render orderId + dailyTokenNumber + pickupAt + pickupStation
    ↓
Clear cart only after confirmed success
```

Confirm exact required request fields and response envelope with Ragul before implementation. The pickup scheduling fields and server response names above reflect the team's supplied plan; they may not match the current backend until verified.

## 7. Admin Order Flow (Target Behavior)

```text
Authenticated and authorized staff
    ↓
GET /admin/dashboard
GET /admin/orders?status=all
    ↓
Render dashboard/orders
    ↓
PATCH /admin/orders/:id/status
    ↓
Refresh or update the confirmed server state
```

Only allow status transitions that the backend confirms. Do not rely on frontend-only role checks for authorization; server-side authorization remains authoritative.

## 8. Design Architecture

- Use the shared token system in `src/index.css` where appropriate.
- Shared visual styles belong in reusable components and global tokens; page-specific layout rules should remain scoped.
- Align public pages with the Heritage Culinary Warmth direction and the actual available Stitch references.
- Avoid selector collisions from generic names (for example `.title`, `.content`, `.container`) when those names have unrelated meanings on different pages.
- Use CSS custom properties, responsive layout primitives, and existing media query conventions.
- Visual fidelity must be verified using actual rendered screenshots when browser tooling is available; token alignment alone is insufficient.

## 9. Integration and Branch Plan

Team-reported branches:

- `feature/home-menu-ui` — Rohith
- `feature/auth-cart` — Ravi
- `feature/checkout-orders` — Ravi
- `feature/admin-dashboard` — Ravi
- `integration/frontend` — Ragul + both members

Confirm actual remote branches and repository state before any Git operation. Each developer should isolate work on their assigned branch, review diffs, run checks, and integrate only after review. This document does not authorize Git changes.

## 10. Non-Functional Requirements

- No TypeScript or Vite migration.
- Preserve business logic and authentication boundaries.
- Do not add dependencies unnecessarily.
- Avoid duplicate order submissions.
- Responsive layouts across desktop, tablet and mobile.
- Accessible form labels, visible focus, meaningful image alternatives and readable contrast.
- Loading, empty, and error states for API-backed UI.
- Do not expose secrets or tokens.
- Build/test claims must be backed by actual command output.

## 11. Known Risks / Must-Confirm Items

1. Exact response envelope and fields for every API endpoint.
2. Error shape and status codes, especially for validation and 401/403 responses.
3. Whether Google login is supported and whether Firebase is involved.
4. Final owner-approved GST and packaging-charge policy.
5. Daily token numbering/reset convention and pickup fields.
6. Valid order-status transitions.
7. Which admin routes require which roles.
8. Availability of actual food image assets and full mobile/admin Stitch references.
