# Ragul — Individual Developer Task Plan

**Role**: Team Lead, Integration and Delivery | **Effort quota**: 30%  
**Common brief**: Read [COMMON-PROJECT-INSTRUCTIONS.md](file:///d:/Project/moorthy%20cafe/docs/COMMON-PROJECT-INSTRUCTIONS.md) first. This file defines your individual ownership.

---

## Phase R1 — Repository and project foundation
**Build area**: GitHub, root files, `docs/`, workflow.

### Tasks:
1. Create/verify shared GitHub repository (`rohith-kanna-jr-2006/moorthi_cafe_webapp`).
2. Agree and create `frontend/`, `backend/`, `docs/`.
3. Write `README.md` with prerequisites, install steps, environment setup and run commands.
4. Add `.gitignore` for `.env`, `node_modules`, build output and logs.
5. Create `.env.example` with placeholder names only.
6. Establish feature branch and pull-request workflow (`feature/*`, PR review before merge).
7. Agree on naming and formatting conventions (JavaScript only, camelCase, integer paise for currency).

**Deliverables**: Working repository, `README.md`, safe environment template (`.env.example`), and branch rules.  
**Done when**: Another teammate can clone and run the project without asking you for missing setup instructions.

---

## Phase R2 — API contract coordination
**Build area**: `docs/API-CONTRACT.md` and team agreement.

### Tasks:
1. Document every endpoint, method, auth requirement, request, response and error.
2. Resolve login identifier: support email and phone (`identifier` or `email`).
3. Confirm authentication behavior: Bearer JWT (`Authorization: Bearer <token>`) with optional HTTP-only cookie support; CORS credentials enabled.
4. Agree food, category, order property names and status values.
5. Confirm `Idempotency-Key` header requirement for order creation.
6. Ensure money is represented in integer paise on backend/API, formatted to ₹ by frontend.
7. Add example payloads for register/signup, login, foods, validate-cart/preview, and order creation.
8. Label unconfirmed owner decisions as PENDING in `docs/OWNER-DECISIONS.md`.
9. Notify team before changing any shared field or endpoint.

**Deliverables**: `docs/API-CONTRACT.md` and `docs/OWNER-DECISIONS.md`.  
**Done when**: Rohith and Ravi can build their respective work without guessing API shapes.

---

## Phase R3 — Shared integration
**Build area**: Frontend API service, auth state and cross-feature wiring.

### Tasks:
1. Coordinate API base URL via `VITE_API_BASE_URL` (or `REACT_APP_API_BASE_URL` / dev proxy).
2. Review the shared API client and common error handling envelope (`{ success, message, data, errors }`).
3. Ensure frontend requests include credentials and backend CORS allows origin with credentials.
4. Ensure app checks `GET /auth/me` on startup to restore login state from token/session.
5. Connect Rohith's menu screens to Ravi's live API (`GET /categories`, `GET /foods`).
6. Connect cart validation (`POST /orders/validate-cart`) and order creation (`POST /orders`).
7. Check protected routes, logout (`POST /auth/logout`) and session refresh.
8. Keep demo/mock mode strictly separated from live production API.

**Deliverables**: Integrated customer flow from homepage → menu → login → cart → checkout → order confirmation.  
**Done when**: The complete flow uses real APIs and failures display helpful messages.

---

## Phase R4 — Integration QA and security review
**Build area**: End-to-end testing and `docs/TEST-PLAN.md`.

### Test checklist:
- Register/login/logout and invalid credentials handling.
- Empty/invalid cart, unavailable foods and changed prices during checkout.
- Duplicate checkout submission and idempotent retry using `Idempotency-Key`.
- Concurrent orders and unique daily pickup token generation.
- Customer authorization boundary: Customer cannot view another customer's order.
- Role enforcement: Non-admin cannot call admin APIs (`/admin/*`).
- Order state machine: Invalid status transitions are rejected.
- Mobile and desktop responsive layouts plus graceful API failure states.

> [!NOTE]
> Track each bug with severity, reproduction steps, owner, and status. Do not silently change another developer's code; coordinate fixes.

**Deliverables**: Test checklist, bug list, and verified end-to-end flow.  
**Done when**: No known critical authorization or duplicate-order issue remains.

---

## Phase R5 — Deployment and final demo
**Build area**: Deployment configuration, `README.md` and presentation.

### Tasks:
1. Confirm host, domain, budget and account owner (pending owner decision).
2. Configure production environment variables separately (never commit production `.env`).
3. Use HTTPS and secure cookies in production.
4. Restrict CORS to approved frontend origins only.
5. Verify database access and least-privilege credentials (MongoDB Atlas).
6. Deploy frontend/backend and verify health/logging (`GET /api/v1/health`).
7. Test production signup, menu, ordering and admin flow.
8. Prepare demo script and known-limitations list.

**Deliverables**: Deployed demo (if hosting is approved), updated `README.md` and presentation checklist.  
**Done when**: App works from a clean browser session and secrets are not exposed.

---

## Boundaries
- You own coordination and integration, not every feature's implementation.
- Ravi owns backend endpoint implementation; Rohith owns UI implementation.
- You may edit shared files after coordinating with their owner.
- Never make up restaurant data, tax rules or payment policies.

## Weekly report format
- **Completed**: Features/docs finished this week
- **In progress**: Current active tasks
- **Blocked by**: Any external blockers or missing info
- **Decisions needed**: Owner/team decisions required
- **Bugs**: Open issues by severity
- **Next week's goal**: Planned milestones
