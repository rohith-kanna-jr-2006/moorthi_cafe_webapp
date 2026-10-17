# Product Requirements Document (PRD)
# Hotel New Moorthi Cafe

## 1. Product Overview

Hotel New Moorthi Cafe is a restaurant web application intended to let customers discover the restaurant's food menu, authenticate, create a cart, preview a server-calculated bill, place an order with pickup information, and allow authorized restaurant staff to manage order status through an admin interface.

The current repository has previously been reported to contain public pages (Home, About, Menu, Gallery, Contact) and several admin screens. The availability and completeness of ordering APIs and all customer-ordering workflows must be verified against the current codebase and backend before being described as implemented.

## 2. Goals

1. Provide a visually consistent restaurant website aligned with the approved Google Stitch design.
2. Display categories and food items from the backend rather than hardcoded production data.
3. Support customer signup/login and a persistent shopping cart.
4. Display backend-calculated bill amounts during checkout.
5. Create orders safely and display backend-generated pickup information.
6. Allow authorized staff to view orders and update valid order statuses.
7. Support desktop, tablet, and mobile layouts.
8. Provide clear loading, empty, validation, error, and retry states.

## 3. Users and Roles

### Customer
- Explore restaurant information and menu.
- Search food and filter by category.
- Sign up or sign in.
- Add/remove items and change quantities in a cart.
- Preview the bill, choose pickup timing, add kitchen notes, and place an order.
- See the server-generated order identifier and pickup details after successful creation.

### Restaurant Admin/Staff
- Sign in through the supported authentication flow.
- View dashboard summary and orders.
- Update order status only when authorized and according to valid transitions.

### Backend Owner / Integrator
- Verify API behavior and business rules.
- Maintain authority over pricing, billing, order IDs, pickup numbering, and valid order transitions.

The exact role model and permissions must match the existing backend implementation; do not invent roles or bypass RBAC.

## 4. Scope by Phase

### Phase 1 — Project Setup and Design Agreement

- Inspect the existing repository and establish a single shared frontend project.
- Agree on CSS tokens, common components, route conventions, form styles and cart item shape.
- Standardize shared Navbar, Footer, page containers, buttons and food cards.
- Preserve the project's existing React + Webpack setup and JavaScript-only constraint.

**Acceptance criteria**
- No duplicate frontend project or conflicting global stylesheet is introduced.
- Shared theme and component contracts are documented and used consistently.
- Rohith and Ravi agree on routing and data conventions before integrating work.

### Phase 2 — Homepage and Menu (Rohith leads)

- Build the homepage and restaurant information sections.
- Build reusable food cards, category pills/filtering and menu search.
- Load categories from `GET /api/v1/categories`.
- Load food items from `GET /api/v1/foods?category=...&search=...`.
- Provide loading, empty, error and retry states.
- Display backend-provided names, prices, images, category and availability fields only after confirming the response contract.

**Acceptance criteria**
- Customers can browse categories and food items retrieved from the backend.
- Category filtering and search work with the agreed request format.
- API errors do not leave the page in an unexplained blank state.
- Desktop and mobile layouts are browser-tested.

### Phase 3 — Authentication and Cart (Ravi leads)

- Implement signup and login.
- Integrate `POST /api/v1/auth/signup` and `POST /api/v1/auth/login` after verifying the contract.
- Store the returned token as `moorthi_token` if confirmed by the backend contract.
- Implement `AuthContext.js` and `CartContext.js` if consistent with the existing architecture.
- Persist cart items in `localStorage`.
- Support quantity controls and item removal.
- Handle unauthorized responses by clearing the token and requiring sign-in, as specified by the team's contract.
- Confirm Google login support before implementation; use Firebase only if the backend/owner contract requires it.

**Agreed cart item shape:** `{ foodId, name, price, quantity }`.

### Phase 4 — Billing and Checkout (Ravi leads; Rohith supports UI)

- Build the cart billing summary and checkout form.
- Integrate `POST /api/v1/orders/preview`.
- Display backend-provided subtotal, GST, packaging charge and total.
- Support immediate and scheduled pickup if confirmed by the API.
- Limit kitchen notes to 150 characters.
- Offer only payment methods supported by the confirmed backend contract.

**Checkout item shape:** `{ foodId, quantity }`.

The backend is authoritative for bill calculation. Frontend values must not be trusted for final pricing.

### Phase 5 — Order Creation and Success (Ravi leads; Ragul verifies contract)

- Submit an order using `POST /api/v1/orders` and the required Bearer token.
- Send an `Idempotency-Key` for each logical checkout attempt if supported by the confirmed backend contract.
- Prevent accidental duplicate submissions.
- Display backend-provided `orderId`, `dailyTokenNumber`, `pickupAt` and `pickupStation`.
- Clear the cart only after confirmed successful order creation.

### Phase 6 — Admin Dashboard and Integration Testing (Ravi leads; Rohith supports shared UI)

- Integrate `GET /api/v1/admin/dashboard`.
- Integrate `GET /api/v1/admin/orders?status=all`.
- Integrate `PATCH /api/v1/admin/orders/:id/status`.
- Test allowed status transitions, including preparing → ready → completed, if those transitions match the backend contract.
- Test unauthorized access, failed requests, shared UI, and mobile layouts.

## 5. API Contract Summary

Base URL supplied by the team: `http://localhost:5000/api/v1`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/categories` | Read menu categories |
| GET | `/foods?category=...&search=...` | Search/filter food items |
| POST | `/auth/signup` | Register a customer |
| POST | `/auth/login` | Authenticate a customer |
| POST | `/orders/preview` | Obtain server-calculated checkout totals |
| POST | `/orders` | Create an order |
| GET | `/admin/dashboard` | Read admin summary |
| GET | `/admin/orders?status=all` | List orders |
| PATCH | `/admin/orders/:id/status` | Update order status |

This table records the team's intended endpoints; it does not assert that each endpoint is already implemented. Ragul must confirm endpoint availability, response envelopes, field names, error formats, status codes, authorization, and validation before the frontend relies on them.

## 6. Shared Business Rules

- API base: `http://localhost:5000/api/v1`.
- Protected requests: `Authorization: Bearer <token>` when required by the confirmed contract.
- Auth token key: `moorthi_token`, subject to confirming the actual login response.
- Cart item: `{ foodId, name, price, quantity }`.
- Checkout item: `{ foodId, quantity }`.
- Backend is authoritative for food pricing, subtotal, GST, packaging, order creation, and pickup-token generation.
- Do not generate a pickup token in React.
- Use idempotency to protect order submission if supported by the backend.
- Clear the cart only after successful order creation.
- On a confirmed unauthorized response, clear the saved token and request sign-in again.
- Confirm the daily pickup-token numbering convention with Ragul.
- Confirm that GST and packaging-charge rules have final owner approval before presenting them as business policy.

## 7. Design and Accessibility

The intended visual direction is **Heritage Culinary Warmth** with terracotta, banana-leaf green, turmeric gold, and warm ivory. The exact values are defined in `design.md` (same folder: `docs/frontend/design.md`) and should be cross-checked against retrieved Stitch tokens.

The UI should have a clear heading hierarchy, readable contrast, visible keyboard focus, properly labelled forms, meaningful image alt text, and responsive touch targets.

## 8. Non-Functional Requirements

- Maintain the existing React + Webpack + JavaScript stack.
- Do not add framework migrations or unnecessary dependencies.
- Keep public and admin styles consistent without leaking page-specific rules across the app.
- Provide visible feedback for asynchronous loading and failures.
- Avoid duplicate order submissions.
- Do not expose credentials or tokens in logs/source control.
- Preserve authentication and authorization boundaries.
- Use browser evidence to validate responsiveness and visual fidelity when tools are available.

## 9. Out of Scope Until Confirmed

- Google login/Firebase authentication.
- Payment providers or payment methods beyond the verified backend contract.
- Unspecified loyalty programs, coupons, delivery workflows, inventory rules or customer order history if not present in the agreed API contract.
- Any new backend business logic.

## 10. Definition of Done

A phase is complete only when its scoped requirements are implemented, relevant API contracts are confirmed, appropriate build/tests have actually run, browser behavior is verified where possible, and unresolved issues are documented. Do not mark untested pages or hypothetical outcomes as passed.
