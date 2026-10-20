# Hotel New Moorthi Cafe — API Contract & Architecture Reconciliation

**Document**: Phase R2.1 Deliverable  
**Lead & Author**: Ragul S (Team Lead, Integration & Delivery)  
**Date**: 2026-10-17  
**Commit Reference**: `84b5310`  
**Purpose**: Rigorous audit of documented target architecture and API contracts against actual frontend and backend implementations before beginning Phase R3 (Shared Integration).  
**Status**: ⚠️ **INTEGRATION BLOCKED** pending team alignment on 4 core architectural decisions.

---

## 1. Executive Summary & Blocker Overview

The Phase R2 documentation ([COMMON-PROJECT-INSTRUCTIONS.md](file:///d:/Project/moorthy%20cafe/docs/COMMON-PROJECT-INSTRUCTIONS.md) and [API-CONTRACT.md](file:///d:/Project/moorthy%20cafe/docs/API-CONTRACT.md)) specified theoretical targets that diverge significantly from the working code committed by Rohith (Frontend) and Ravi (Backend). 

Proceeding to Phase R3 without explicit reconciliation would break existing frontend builds and fail all 55 backend regression tests.

### Key Conflict Areas:
1. **Repository Structure & Tooling**: Target specified `frontend/` with Vite. Actual workspace is root-level `src/` powered by **Webpack 5 + React 19** on port `9003`.
2. **Monetary Units & Payloads**: Target specified integer paise (`pricePaise: 8000`, `totalPaise: 14100` inside a nested `pricing` object). Actual backend models, database seeds, and controllers use **INR numbers** (`price: 80.00`, `subtotal: 160`, `totalAmount: 183`) directly on root response objects.
3. **Authentication & Session**: Target proposed HTTP-only cookies with CSRF tokens. Actual backend implements stateless **Bearer JWT in `Authorization` headers**, returning tokens in JSON response bodies with no cookie middleware installed.
4. **Enums & State Machine**: Target proposed lowercase snake_case (`pending`, `ready_for_pickup`, `PAY_AT_COUNTER`). Actual backend enforces uppercase enums (`PLACED`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`; and `COUNTER_CASH`, `UPI`, `CARD`).

---

## 2. Audit A: Repository Architecture

| Component | Target in Common Brief | Actual Implementation | Discrepancy & Evidence |
| :--- | :--- | :--- | :--- |
| **Frontend Location** | `hotel-new-moorthi-cafe/frontend/` | `D:\Project\moorthy cafe\src\` (Root level) | No `frontend/` directory exists. All React screens, admin interfaces, and public assets reside in root `src/`. |
| **Bundler / Tooling** | React + Vite (`vite.config.js`) | Webpack 5.111 (`webpack.cjs`) + Babel | Root `package.json` relies on `webpack`, `webpack-dev-server`, `babel-loader`. Production build produces `dist/bundle.js` (363 KiB). |
| **Dev Server Port** | `5173` (Vite default) | `9003` (`webpack.cjs` line 37) | `webpack.cjs` explicitly configures `devServer: { port: 9003 }`. |
| **Backend Location** | `hotel-new-moorthi-cafe/backend/` | `D:\Project\moorthy cafe\backend\` | Agrees with plan. Runs Node.js v20+ / Express 5 on port `5000`. |
| **Documentation** | `docs/` | `docs/` & `backend/docs/` | Agrees with plan. `docs/` is established at the root. |

### Architectural Options:
- **Option A.1 (Recommended — Smallest Risk)**: Formally amend the Common Brief to retain **React + Webpack 5** at root `src/`. Requires zero file migration and preserves Rohith's 12 working pages and admin screens without build regressions.
- **Option A.2**: Obtain team approval to pause integration, migrate bundler from Webpack to Vite, and move `src/`, `public/`, and configs into a new `frontend/` subdirectory. (High regression risk for React 19 setups).

---

## 3. Audit B: Currency & Order Payloads

| Scope | Contract Target (`docs/API-CONTRACT.md`) | Actual Backend Source | Code Evidence |
| :--- | :--- | :--- | :--- |
| **Food Model** | `pricePaise` (integer, e.g., `6000`) | `price` (Number, INR float, e.g., `60.00`) | [backend/src/models/Food.js#L16-L21](file:///d:/Project/moorthy%20cafe/backend/src/models/Food.js#L16-L21) |
| **Order Items** | `pricePaise`, `lineTotalPaise` | `price`, `lineTotal` (Number, INR) | [backend/src/models/Order.js#L14-L29](file:///d:/Project/moorthy%20cafe/backend/src/models/Order.js#L14-L29) |
| **Cart Validation Response** | Nested: `data.pricing.subtotalPaise`, `taxAmountPaise`, `packagingChargePaise`, `totalPaise` | Flat: `data.subtotal`, `data.gst`, `data.packagingCharge`, `data.totalAmount` (All in INR) | [backend/src/services/orderService.js#L72-L78](file:///d:/Project/moorthy%20cafe/backend/src/services/orderService.js#L72-L78) |
| **Cart Item Array Name** | `data.items` | `data.itemsSnapshot` | [backend/src/services/orderService.js#L56-L73](file:///d:/Project/moorthy%20cafe/backend/src/services/orderService.js#L56-L73) |
| **Order Identification** | `orderNumber: "NMC-20261017-0042"` | `orderId: "HNMC-20261017-0001"` | [backend/src/models/Order.js#L93-L98](file:///d:/Project/moorthy%20cafe/backend/src/models/Order.js#L93-L98) |
| **Token Number** | `dailyToken: 42`, `formattedToken: "#042"` | `dailyTokenNumber: 42` (Number) | [backend/src/models/Order.js#L99-L103](file:///d:/Project/moorthy%20cafe/backend/src/models/Order.js#L99-L103) |
| **Special Instructions** | `specialInstructions` (String) | `notes` (String, max 150 chars) | [backend/src/models/Order.js#L155-L160](file:///d:/Project/moorthy%20cafe/backend/src/models/Order.js#L155-L160) |
| **Database Seeds** | N/A | Seeded in INR: Dosa ₹160, Vada ₹80, Thali ₹220, Coffee ₹45 | [backend/src/utils/seedData.js#L98-L160](file:///d:/Project/moorthy%20cafe/backend/src/utils/seedData.js#L98-L160) |
| **Test Assertions** | Expects paise | Asserting INR numbers: `subtotal == 320`, `gst == 16`, `totalAmount == 351` | [backend/tests/order.test.js#L73-L76](file:///d:/Project/moorthy%20cafe/backend/tests/order.test.js#L73-L76) |

### Migration / Reconciliation Plan:
- Modifying stored database values or calculation logic now would invalidate all 55 passing backend tests.
- **Recommendation**: Align `docs/API-CONTRACT.md` with Ravi's verified implementation (fields: `price`, `subtotal`, `gst`, `packagingCharge`, `totalAmount` in INR). Frontend formats these directly with `₹${val.toFixed(2)}`. If integer paise is strictly mandated later, execute a coordinated Phase 2 database and API migration.

---

## 4. Audit C: Authentication & Logout

| Dimension | Proposed Target in Brief | Actual Implementation | Discrepancy & Security Implication |
| :--- | :--- | :--- | :--- |
| **Token Delivery** | Set-Cookie HTTP-only | Response JSON body (`data.token`) | `backend/src/controllers/authController.js` does NOT call `res.cookie()`. No cookie parser middleware exists in `app.js`. |
| **Token Verification** | Read from cookie | Read from `Authorization: Bearer <token>` | [backend/src/middleware/authenticate.js#L8-L11](file:///d:/Project/moorthy%20cafe/backend/src/middleware/authenticate.js#L8-L11) strictly checks `req.headers.authorization`. |
| **Token Storage** | Browser cookie jar | Client-side memory / `localStorage` | Recommended in [FRONTEND_INTEGRATION_GUIDE.md#L42](file:///d:/Project/moorthy%20cafe/backend/docs/FRONTEND_INTEGRATION_GUIDE.md#L42). |
| **CSRF Protection** | CSRF Tokens required | None implemented | Bearer tokens sent in custom headers are immune to browser CSRF. Introducing cookies without CSRF protection would create vulnerabilities. |
| **Logout Endpoint** | Invalidate session / Clear-Cookie | Returns 200 JSON confirmation | Stateless JWTs cannot be invalidated server-side without a Redis blacklist or DB token versioning. Client simply discards the token. |

### Recommendation:
- Confirm **Bearer JWT Authentication** (`Authorization: Bearer <token>`) as the official MVP scheme. It matches all 9 auth test cases, avoids complex CSRF middleware setup, and is fully documented in `FRONTEND_INTEGRATION_GUIDE.md`.

---

## 5. Audit D: Complete Mismatch Matrix

| # | Endpoint / Entity | Contract Target | Actual Implementation | Required Change / Decision | Owner | Status |
|---|---|---|---|---|---|---|
| 1 | `POST /auth/register` | Endpoint name `/auth/register` | Both `/auth/register` and `/auth/signup` supported | None (Alias implemented and verified) | Ravi / Ragul | ✅ Resolved |
| 2 | `POST /auth/login` | Accepts `identifier` or `email` | Supports both email and phone in `identifier` | Document unified payload shape in contract | Ravi | ✅ Verified |
| 3 | `POST /auth/logout` | Clears cookie | Returns 200 JSON confirmation | Document client-side token discard requirement | Ravi / Rohith | 🟡 Pending Decision |
| 4 | `GET /foods` | Returns `data.items` | Returns `data.foods` | Update contract to match actual `data.foods` | Rohith / Ravi | 🔴 Contract Blocker |
| 5 | `GET /foods` pagination | `{ currentPage, totalPages, totalItems, limit }` | `{ page, pages, total, limit }` | Update contract to match actual pagination shape | Rohith / Ravi | 🔴 Contract Blocker |
| 6 | Dietary tag | `dietaryTag: 'VEG'` | `isVeg: true` (Boolean) | Update contract to use `isVeg: Boolean` | Rohith / Ravi | 🔴 Contract Blocker |
| 7 | Cart Validation | `POST /orders/validate-cart` | Both `/orders/validate-cart` and `/orders/preview` supported | None (Alias implemented and verified) | Ravi / Ragul | ✅ Resolved |
| 8 | Cart Pricing Breakdown | Nested `pricing: { subtotalPaise, ... }` | Flat: `subtotal`, `gst`, `packagingCharge`, `totalAmount` (INR) | Update contract to reflect flat INR response | Rohith / Ravi | 🔴 Contract Blocker |
| 9 | Order ID field | `orderNumber` | `orderId` (e.g., `HNMC-20261017-0001`) | Update contract to `orderId` | Rohith / Ravi | 🔴 Contract Blocker |
| 10 | Daily Token | `dailyToken`, `formattedToken` | `dailyTokenNumber` (Number) | Update contract to `dailyTokenNumber` | Rohith / Ravi | 🔴 Contract Blocker |
| 11 | Order Notes | `specialInstructions` | `notes` (max 150 chars) | Update contract to `notes` | Rohith / Ravi | 🔴 Contract Blocker |
| 12 | Order Status Enum | `pending`, `confirmed`, `preparing`, `ready_for_pickup`, `completed` | `PLACED`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED` | Adopt uppercase backend enum in contract & frontend | Ravi / Rohith | 🔴 Contract Blocker |
| 13 | Payment Method Enum | `PAY_AT_COUNTER` | `COUNTER_CASH`, `UPI`, `CARD` (Default: `UPI`) | Align frontend selector to backend enum | Ravi / Rohith | 🔴 Contract Blocker |
| 14 | Payment Status Enum | `PENDING` | `PENDING`, `PAID`, `REFUNDED` | Document in contract | Ravi / Rohith | ✅ Verified |
| 15 | Idempotency Header | Required on `POST /orders` | Required in tests; schema allows sparse unique | Enforce client UUID generation in frontend checkout | Rohith | 🟡 Implementation Req |

---

## 6. Audit E: MVP Scope & Owner Decisions

1. **Scheduled Pickup**:
   - Backend `Order` schema and validator include `pickupType: ['IMMEDIATE', 'SCHEDULED']` and `pickupAt: Date`.
   - Per MVP guidelines, scheduled pickup is **NOT approved**. The frontend order UI must restrict orders to `IMMEDIATE` counter collection. Backend scheduled handling remains dormant.
2. **Online Payment Gateway**:
   - Backend schema includes `source: ['MANUAL_COUNTER', 'ONLINE_GATEWAY']`.
   - No payment gateway SDK (Razorpay/Stripe) is installed. Counter settlement (`MANUAL_COUNTER`) is strictly enforced for MVP.
3. **Menu & Pricing Data**:
   - Database seed items (Dosa ₹160, Vada ₹80, Thali ₹220, Coffee ₹45) are **illustrative test data only**. Real restaurant pricing remains **PENDING** in [OWNER-DECISIONS.md](file:///d:/Project/moorthy cafe/docs/OWNER-DECISIONS.md).

---

## 7. Audit F: Test & Environment Verification

### Test Suite Execution Report
- **Command Executed**: `npm test` inside `d:\Project\moorthy cafe\backend`
- **Runner**: Node.js Test Runner via `tests/runAllTests.js`
- **Result**:
  ```
  ====================================================
  Hotel New Moorthi Cafe — Running Backend Test Suites
  ====================================================
  ✔ Suite completed: tests/auth.test.js (9 tests)
  ✔ Suite completed: tests/menu.test.js (6 tests)
  ✔ Suite completed: tests/order.test.js (8 tests)
  ✔ Suite completed: tests/concurrency_token.test.js (3 tests)
  ✔ Suite completed: tests/admin.test.js (8 tests)
  ✔ Suite completed: tests/security_regression.test.js (21 tests)

  ====================================================
  ✅ ALL TEST SUITES PASSED SUCCESSFULLY!
  ====================================================
  ```
- **Exit Code**: `0`
- **Total Test Suites**: `6` (6 passed, 0 failed)
- **Total Individual Tests**: `55` (55 passed, 0 failed, 0 skipped)

> [!NOTE]
> **Resolution of 34 vs 55 Tests**: Previous commit summaries documented 34 tests across the first 5 suites (`auth`, `menu`, `order`, `concurrency_token`, `admin`). Commit `d251268` added `tests/security_regression.test.js` containing 21 tests. 34 + 21 = **55 active tests**.

### CORS & Environment Configuration Audit
- **Issue Discovered**: In `backend/src/app.js`:
  ```javascript
  const allowedOrigins = [
    env.clientUrl,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
  ```
  `allowedOrigins.includes(origin)` performs literal string comparison. If `.env` contains comma-separated origins like `CLIENT_URL=http://localhost:5173,http://localhost:8080`, it does **not** split them. Furthermore, the frontend dev server runs on port **`9003`** (configured in `webpack.cjs`). Requests from `http://localhost:9003` will be blocked by CORS unless `CLIENT_URL` explicitly points to `http://localhost:9003` or `app.js` splits comma-separated origins.

---

## 8. Summary of Blockers & Required Decisions

Phase R3 frontend integration cannot proceed reliably until the team agrees on these four foundational points:

```
[ DECISION 1 ] Bundler & Path: Retain root src/ + Webpack 5 (Port 9003) vs Migrate to Vite in frontend/?
[ DECISION 2 ] Currency Unit: Adopt actual INR numbers (₹) vs Rewrite database models & tests to integer paise?
[ DECISION 3 ] Auth Scheme: Confirm Bearer JWT in headers vs Rewrite backend to HTTP-only cookies with CSRF?
[ DECISION 4 ] Enums: Align contract with backend enums (PLACED, READY, COUNTER_CASH, UPI, CARD)?
```
