# Hotel New Moorthi Cafe — Common Project Instructions

**Shared by Ragul, Ravi and Rohith**  
**Project**: Hotel New Moorthi Cafe, Chidambaram  
**Stack**: React + Vite, Node.js + Express, MongoDB Atlas, JavaScript only  
**Repository structure**: `frontend/`, `backend/`, `docs/`  
**Purpose**: This is the common project brief. Each developer must read this file before reading their own task file.

---

## 1. Project objective
Build a responsive website for one restaurant. Customers browse the menu, search foods, register/login, add food to a cart, validate the bill, place a pickup order and receive an order number/pickup token. Staff/admin can view orders and update their status.

## 2. MVP scope
- Restaurant homepage and menu
- Categories and food search
- Customer registration, login and logout
- Cart and server-side bill validation
- Pickup order creation and unique pickup token
- Customer order history/details
- Admin order queue and status updates
- Responsive UI, validation, error/loading/empty states
- Testing and deployment preparation

> [!WARNING]
> Do not add delivery, online payment gateway, scheduled pickup, Google sign-in, coupons or loyalty points unless approved.

## 3. Technology rules
- Use JavaScript, not TypeScript.
- Frontend: React + Vite (or React webapp with pure JavaScript).
- Backend: Node.js + Express.
- Database: MongoDB Atlas + Mongoose.
- Keep frontend and backend separated.
- Use GitHub feature branches and pull requests.
- Never commit `.env`, passwords, database URLs or secrets.
- Do not use hardcoded production menu data or prices.

## 4. Shared folder plan
```
hotel-new-moorthi-cafe/
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── context/
│       ├── services/
│       ├── hooks/
│       └── utils/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── utils/
└── docs/
    ├── COMMON-PROJECT-INSTRUCTIONS.md
    ├── API-CONTRACT.md
    └── OWNER-DECISIONS.md
```
Treat this as the agreed starting structure. If a change is needed, tell the team before restructuring.

## 5. Shared API baseline
Base URL for local development: `http://localhost:5000/api/v1`.

Expected route groups:
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Menu**: `GET /categories`, `GET /foods`, `GET /foods/:id`
- **Orders**: `POST /orders/validate-cart`, `POST /orders`, `GET /orders/my`, `GET /orders/:id`
- **Admin**: `GET /admin/dashboard`, `GET /admin/orders`, `PATCH /admin/orders/:id/status`

All routes above are relative to `/api/v1`. Exact JSON request/response shapes must be recorded in `docs/API-CONTRACT.md` before frontend/backend integration. Do not invent field names.

## 6. Shared data and security rules
- **Money in integer paise**: ₹80 = 8000 paise. Frontend formats paise to ₹ for display.
- **Server is source of truth**: Food prices, availability, tax/charges and totals are computed strictly on the backend.
- **Order items**: Requests send food IDs and quantities, not trusted totals.
- **Historical snapshots**: Store order item name/price snapshots so historical orders remain accurate even if food prices change.
- **Idempotency**: Use an `Idempotency-Key` header for order creation and reuse the same key for retrying the same checkout attempt.
- **Pickup tokens**: Generated on the server with atomic counter and unique constraint protection.
- **Customer authorization**: Customers may only read their own orders.
- **Admin authorization**: Admin endpoints must enforce admin roles on the backend.
- **Authentication**: HTTP Bearer Token (`Authorization: Bearer <token>`) or HTTP-only cookies; configure CORS credentials and suitable CSRF protection. Do not store plain auth tokens in insecure storage.
- **Order status lifecycle**: `pending` (or `placed`), `confirmed`, `preparing`, `ready_for_pickup` (or `ready`), `completed`. Cancellation rules require owner approval.

## 7. Visual baseline
Proposed palette:
- Terracotta: `#C05621`
- Banana Leaf: `#2F855A`
- Turmeric Gold: `#D69E2E`
- Warm Ivory: `#FAF5EF`

Keep UI accessible and responsive. Use approved restaurant logo, menu, prices, address and hours only.

## 8. Work ownership
- **Ragul (30%)**: Team lead, project setup, API contract coordination, integration, testing, deployment and final demo.
- **Rohith (35%)**: React frontend, homepage, menu/search, cart/checkout UI, order confirmation UI, admin dashboard UI and responsive QA.
- **Ravi (35%)**: Backend, database models, auth APIs, food/category APIs, cart validation, order creation/token, order history and admin APIs.

Detailed individual phases and deliverables are in each developer's separate task file. Do not assume another developer has completed a task until it is committed/reviewed.

## 9. Owner decisions — mark as PENDING until confirmed
Track these in `docs/OWNER-DECISIONS.md`:
1. Official restaurant name, logo, address, phone, map location and opening hours.
2. Real menu, categories, descriptions, portions, images and prices.
3. GST rate, whether menu prices include tax and calculation rules.
4. Packaging charge amount and when it applies.
5. Payment methods for MVP.
6. Pickup-only confirmation and whether scheduled pickup is needed.
7. Preparation-time policy.
8. Cancellation/refund rules.
9. Staff/admin accounts and roles.
10. Whether public pickup-token tracking is allowed and what it reveals.
11. Notifications needed for MVP.
12. Google sign-in and admin menu editing requirements.
13. Hosting/domain/budget/account ownership.
14. Customer data privacy and retention rules.

Never invent business facts. If an item is pending, keep it configurable or leave that feature out of MVP.

## 10. Definition of done for every task
- Code is committed to the correct feature branch.
- Feature runs using documented local setup.
- Validation and loading/error/empty states are handled where relevant.
- No secrets are committed.
- API fields match the shared contract.
- Another teammate reviews the work.
- Relevant tests/manual checklist pass.
- Known limitations are documented.

## 11. Team communication rule
- **Before starting**: Read this common file and your personal task file.
- **Before integration**: Share endpoint names, payloads and response fields.
- **Before merging**: Test the feature and open a pull request.
- **When blocked**: State what is blocked, the error, steps to reproduce and help needed.

This common file is the shared source of project-wide rules. Individual task files add personal responsibilities; they do not override shared rules unless the team agrees in writing.
