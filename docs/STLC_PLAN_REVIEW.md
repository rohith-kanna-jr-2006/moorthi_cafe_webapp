# STLC Phase 1 & 2 Review — Hotel New Moorthi Cafe

Reviewed: `STLC_REQUIREMENT_ANALYSIS.md`, `STLC_TEST_PLAN.md` (project root).
Method: source inspection only. No application code modified, no destructive ops, no tests executed.
Reviewer basis: files cited below are current working-tree state on branch `main`.

Legend: ✅ Verified · ⚠️ Partially verified · ❌ Unsupported/Incorrect · 🕳️ Missing scenario

---

## 1. Requirement Traceability Table

| Req (doc §) | Claim | Evidence | Status |
|---|---|---|---|
| 3.A Signup | Min password **8 chars** | `backend/src/validators/authValidators.js:19` → `< 6` rejected | ❌ Incorrect (actual = 6) |
| 3.A Signup | Stores JWT `moorthi_token`, profile `moorthi_user` | Client storage; not re-verified here (frontend localStorage keys) | ⚠️ Unverified (source-inspection scope) |
| 3.A Sign In | Login via email OR mobile | `authController.js:73-76` branches on `@` presence | ✅ |
| 3.A Role routing | Auto-route admin→console, customer→dashboard | Route registry exists (`App.js:47-56,59-72`); guard logic is client-side | ⚠️ Partially (no server-enforced redirect) |
| 3.A Password Recovery / OTP | `/forgot-password` simulates OTP dispatch & verify | Page routed `App.js:49`; **NO** backend endpoint in `authRoutes.js` (only signup/register/login/logout/me); no OTP model/service | ❌ Unsupported (UI-only) |
| 3.A Profile "membership duration" | Displays membership tenure | `User.js` has only `createdAt`; no membership concept | ❌ Unsupported |
| 2 Stakeholder "Kitchen Staff" | Separate role viewing/updating orders | `User.js:34-37` enum = `['customer','admin']` only; `adminRoutes.js:16` `authorize('admin')` | ❌ Unsupported (role does not exist) |
| 3.B Menu fetch | `/foods`,`/categories` from localhost:5000 | `src/utils/api.js:1,39,85`; routes registered `app.js:106-107` | ✅ |
| 3.B Fallback curated dishes when DB offline | Frontend degradation | Not opened in this review | ⚠️ Unverified |
| 3.B Filters/Search incl. Tamil names | Search name/Tamil/description | `Food.js:280` text index `{name,nameEnglish,nameTamil,description}` | ✅ |
| 3.B Pure-Veg toggle `isVeg` | Dietary filter | `Food.js:221-224` `isVeg` boolean | ✅ |
| 3.B Item variants (bone/boneless, portions) | Per-variant pricing/selectors | `Food.js:30-61` `foodVariantSchema`; resolution `orderService.js:70-91` | ✅ (but see gap below) |
| 3.C Cart persistence `moorthi_cafe_cart` | localStorage cart + navbar badge | Not opened in this review | ⚠️ Unverified |
| 3.C Checkout pricing authority | Subtotal, GST 5%, packaging ₹15, server-authoritative | `orderService.js:118-123`; env defaults PACKAGING_CHARGE=15, GST_PERCENTAGE=5 (`backend/.env`) | ✅ |
| 3.C Idempotency-Key header | Sent on placement | `api.js:198-212`; consumed `orderController.js:26`; enforced `orderService.js:216-229` | ✅ |
| 3.D Order Success token | Daily Pickup Token + HNMC- Order ID | `counterService.js:14-35`; `generateOrderId` used `orderService.js:255` | ✅ |
| 3.D Live tracking | Real-time status monitoring | No WS/SSE/polling found; refresh-based | ❌ Unsupported ("live" = copy) |
| 3.D My Orders cancel when PLACED | Customer self-cancel policy | `orderController.js:147` blocks non-PLACED unless admin | ✅ |
| 3.E Admin auth restricted to role admin | Guarded console | `adminRoutes.js:16` authenticate+authorize('admin') | ✅ |
| 3.E Dashboard: revenue, UPI/Cash split, volume, token range | Metrics | `reportService.js:78-88` returns revenue{upi,cash,card}, statusCounts, activeTokensQueue(lowest/highest) | ⚠️ Split reflects DECLARED method on PENDING orders, not settled cash |
| 3.E Avg preparation time, station notes, inventory alerts, equipment load (tawa/steamer/urn) | Ops widgets | Absent from `reportService.js` aggregation; no model/service computes them | ❌ Unsupported |
| 3.E Order mgmt status tabs + search + PATCH transitions | Admin queue | `adminController.js:28-86` filters/search; `:111-228` transition validation | ✅ |
| NFR Currency ₹ 2-decimal | formatINR toFixed(2) | Money stored/calculated as rupee Numbers with paise mirror (`Food.js:110-130`) | ✅ |
| NFR Responsive 320→1366 zero overflow | Layout | Matches `responsive.spec.js:4-9` viewports | ✅ (design intent) |

### Variant validation gap (⚠️, non-blocking)
`validateOrderPlacement` (`orderValidators.js:8-16`) checks foodId format + quantity only; it does NOT validate `variantName`. An unknown/malformed variant passes the validator and is rejected later inside `calculateOrderPricing` (`orderService.js:74-82`, 400). Behavior is correct end-to-end but the rejection happens past the trust-boundary validator — flag for Phase 3 negative-case design.

---

## 2. Test Plan Verification

| Item (doc §) | Claim | Evidence | Status |
|---|---|---|---|
| 2 Frontend server | localhost:9003 (or 9004) | `webpack.cjs` devServer.port = **9004**; README says 9003 | ⚠️ Doc drift — actual config is 9004 |
| 2 Backend server | localhost:5000/api/v1 | `backend/.env` PORT=5000; mount `app.js:105-109` | ✅ |
| 2 Framework | Playwright `@playwright/test`, tests under `tests/e2e/` | `playwright.config.js:1,testDir:'./tests/e2e'`; deps in `package.json` | ✅ |
| 2 Viewports | 320×700,375×812,390×844,1366×768 | Exactly `responsive.spec.js:4-9` | ✅ |
| 2 Browsers | Implied multi-browser support | Config pins `projects:[chromium]` ONLY | ⚠️ Single browser |
| 3A Route smoke | 8 public+admin routes render 200 | `routes.spec.js:4-13` list matches | ✅ |
| 3B Home hero/grid/toast | Rich homepage assertions | `home.spec.js` asserts only body visible + status<400 | ❌ Overstated coverage |
| 3C Auth form validation | required attrs, invalid-cred banner, nav links | `auth.spec.js` present | ✅ |
| 3D Responsive overflow | scrollWidth>innerWidth false | `responsive.spec.js:12-17` | ✅ |
| 3E End-to-end ordering workflow | Full browse→cart→checkout→token→track→admin | Described as "Manual & Automated Integration Protocol" — NO automated spec file implements it | 🕳️ Not automated |
| Backend runner | npm test → runAllTests spawns node --test | `backend/package.json:"test":"node tests/runAllTests.js"`; 7 suites listed `runAllTests.js:5-13` | ✅ |
| Test DB isolation | Isolated, refuses prod/dev | `setupTestEnv.js:3` forces `moorthi_cafe_test`; `testHelper.js:91-94` aborts if DB name lacks 'test'; `listen(0)` ephemeral port | ✅ SAFE |
| Cleanup safety | Removes generated test users | `auth.test.js:14-16` deleteMany regex-scoped | ✅ |
| Test accounts | Seeded admin/customer/fixtures | `testHelper.js:12-85` seedTestFixtures | ✅ |

---

## 3. Missing Test Scenarios (🕳️)

1. **Automated E2E happy path**: menu → add-to-cart → checkout preview → place order (with Idempotency-Key) → order-success token render → my-orders cancel. Currently manual-only.
2. **Cart boundary BVA**: quantity 0, 1, 50 (max), 51 (>max) asserted through the UI AND `/orders/preview` + `/orders`. Model caps at 50 (`Order.js:23`), validator rejects >50 (`orderValidators.js:13`) — no explicit E2E.
3. **Unavailable/archived item at checkout**: `orderService.js:59-64` throws 400 — needs a negative case.
4. **Variant ordering**: valid variant priced correctly; unknown variant → 400 (exercises the validator gap above).
5. **Idempotency negatives in UI**: replay same key (expect original snapshot) vs altered payload (expect 409) surfaced to user.
6. **Full admin transition chain**: PLACED→CONFIRMED→PREPARING→READY→COMPLETED plus illegal jumps (e.g. PLACED→READY) returning 400 (`adminController.js:137-144`).
7. **Payment settlement transitions**: PENDING→PAID→REFUNDED and repeat-settle rejection (`adminController.js:160-175`).
8. **Accessibility**: plan claims "accessible typography" but no axe-core / playwright a11y assertion exists anywhere.
9. **Cross-customer authorization at API edge**: already covered backend-side (`order.test.js:142` 403) but absent from E2E.
10. **Multi-browser**: config runs chromium only; Firefox/WebKit unexercised despite compatibility framing.

---

## 4. Test Environment Risks

- **Safe**: Backend suite cannot touch dev/prod DB — hard guard + forced `moorthi_cafe_test` URI + ephemeral listen port. Suitable for Phase 4 as-is.
- **Port ambiguity**: webpack dev server is 9004, README says 9003, Playwright baseURL defaults 9004. Align docs before wiring FE↔BE, else E2E hits wrong origin.
- **Chromium-only**: single-browser matrix understates stated compatibility scope.
- **No live-data risk noted**: forgot-password/OTP has no backend, so no accidental SMS/mail during tests — good, but means that requirement is untestable at integration level.
- **Declared-vs-settled money**: dashboard "revenue/UPI-CASH split" sums DECLARED paymentMethod on possibly-PENDING orders; treat any test expecting "settled revenue" as invalid until settlement semantics are specified.

---

## 5. Required Corrections

Before Phase 3 proceeds:
1. Fix password-minimum statement 8→**6** (cite `authValidators.js:19`).
2. Remove/relabel "Kitchen Staff" stakeholder — roles are customer/admin only (`User.js:34-37`).
3. Downgrade "real-time"/"live tracking"/KDS wording to "manual-refresh status views"; no streaming transport exists.
4. Delete or mark-as-future the dashboard items with no backing computation: average prep time, station notes, inventory alerts, equipment load (`reportService.js`).
5. Mark Password Recovery/OTP as **NOT IMPLEMENTED (UI shell only)** — no route/model/service.
6. Clarify payment-split semantics (declared method, pre-settlement).
7. Correct frontend port to 9004 across docs/config references.
8. Note the variant-validation boundary (rejected in pricing service, not request validator) as a known limitation.
9. Add the ten missing scenarios (§3) to the Phase 3 case matrix.

---

## 6. Approval Status

| Phase | Decision | Reason |
|---|---|---|
| **Phase 1 — Requirement Analysis** | **CHANGES REQUIRED** | Core flows traced correctly, but ≥6 material claims are incorrect or unsupported (password length, kitchen-staff role, real-time/live, inventory/equipment metrics, OTP recovery, membership). Must be corrected before test-case design assumes them. |
| **Phase 2 — Test Plan** | **CHANGES REQUIRED** | Environment, isolation, ports, viewports and existing suites verified accurate and SAFE. But plan omits the highest-risk untested surface (automated end-to-end ordering, admin transitions, idempotency/cart/variant negatives, a11y) and misrepresents breadth (chromium-only, overstated home-page coverage, port drift). |

Neither phase may advance to Phase 3/4 until §5 corrections land. No runtime execution was performed; all statuses derive from source inspection only.
