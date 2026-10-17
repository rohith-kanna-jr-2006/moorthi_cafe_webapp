# Hotel New Moorthi Cafe — Web Application

> Authentic South Indian Restaurant Web Platform for **Hotel New Moorthi Cafe, Chidambaram**.  
> Features menu exploration, customer authentication, live cart & server-side bill calculation, idempotent counter pickup orders with atomic token allocation, and real-time staff/admin operations.

---

## 1. Project Overview & Team Structure

| Developer | Role | Quota | Primary Ownership Area |
| :--- | :--- | :---: | :--- |
| **Ragul** | **Team Lead, Integration & Delivery** | **30%** | Repository foundation, API contract coordination, shared integration, QA & security verification, deployment |
| **Rohith** | **Frontend Engineer** | **35%** | React UI, responsive layouts, menu/search, cart/checkout flow, order confirmation, admin UI |
| **Ravi** | **Backend Engineer** | **35%** | Node.js/Express APIs, MongoDB Atlas models, authentication, cart pricing engine, atomic token generator, admin operations |

---

## 2. Technology Stack & Principles

- **Language**: Pure **JavaScript (ES Modules & CommonJS)**. No TypeScript.
- **Frontend**: React 19, React Router, CSS Design System (Warm Ivory `#FAF5EF`, Terracotta `#C05621`, Banana Leaf `#2F855A`, Turmeric Gold `#D69E2E`).
- **Backend**: Node.js, Express.js (v5), MongoDB Mongoose (v9), Helmet, CORS, Rate Limiting, Bcrypt.
- **Data & Currency Rule**: All prices and monetary amounts are strictly computed in **integer paise** (`₹80 = 8000 paise`) on the server to prevent floating-point calculation errors.
- **Timezone**: `Asia/Kolkata` (UTC+05:30) for daily counters, operating hours, and order receipts.

---

## 3. Repository Architecture

```
hotel-new-moorthi-cafe/
├── frontend/ / src/        # React application source code
│   ├── assets/             # Images, logos, and static brand assets
│   ├── components/         # Shared UI components (Navbar, Footer, FoodCard)
│   ├── pages/              # Public customer pages (Home, Menu, About, Contact, Gallery)
│   ├── admin/              # Staff & admin operational screens (Dashboard, Orders, Menu CRUD)
│   └── index.css           # Curated CSS tokens and design system styles
├── backend/                # Node.js + Express API server
│   ├── src/
│   │   ├── config/         # Mongoose connection & strict environment validation
│   │   ├── controllers/    # Route controllers (auth, category, food, order, admin)
│   │   ├── middleware/     # Auth, RBAC, input validator schema runners, error handlers
│   │   ├── models/         # Mongoose schemas (User, Category, Food, Order, DailyCounter)
│   │   ├── routes/         # Express API route declarations
│   │   ├── services/       # Core business logic (pricing, atomic tokens, sales aggregation)
│   │   └── validators/     # Joi / validation schemas
│   ├── tests/              # Automated test suites (34+ unit, integration, & security tests)
│   └── docs/               # Backend architecture & database schema documentation
├── docs/                   # Shared team guidelines & contracts
│   ├── COMMON-PROJECT-INSTRUCTIONS.md # Master team rules & constraints
│   ├── RAGUL-INDIVIDUAL-TASKS.md      # Ragul's individual roadmap & deliverables
│   ├── API-CONTRACT.md                # Shared REST API specifications & payloads
│   └── OWNER-DECISIONS.md             # Status log of business & owner decisions
├── .env.example            # Safe environment template
└── README.md               # You are here
```

---

## 4. Prerequisites

Ensure your local machine has the following installed:
- **Node.js**: v20.x or higher (`node -v`)
- **npm**: v10.x or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance running on port `27017` or MongoDB Atlas connection URI

---

## 5. Quick Start & Local Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/rohith-kanna-jr-2006/moorthi_cafe_webapp.git
cd moorthi_cafe_webapp
```

### Step 2: Environment Configuration
Copy the provided `.env.example` template into local `.env` files:
```bash
# In the repository root
cp .env.example .env

# In the backend directory
cp .env.example backend/.env
```
*(On Windows PowerShell, use `copy .env.example .env`).*

> [!CAUTION]
> Never commit `.env` or sensitive credentials to version control. The repository `.gitignore` is pre-configured to ignore all environment files.

### Step 3: Backend Setup & Launch
```bash
cd backend
npm install
npm run dev # Or 'npm start' to run in standard mode
```
The backend server will start on **`http://localhost:5000`** and connect to your database. Verify health by opening:  
`http://localhost:5000/api/v1/health`

### Step 4: Frontend Setup & Launch
Open a second terminal window in the root directory:
```bash
npm install
npm start
```
The frontend dev server will launch at **`http://localhost:8080`** (or `http://localhost:5173`).

---

## 6. Running Automated Tests

The backend includes a comprehensive suite of 34+ automated tests covering auth, cart validation, idempotency, order concurrency, atomic token uniqueness, and RBAC authorization:

```bash
cd backend
npm test
```

---

## 7. API Summary & Contract

All API endpoints are mounted under `/api/v1`:

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System uptime & database connection status |
| `POST` | `/auth/register` | Public | Register customer account (alias: `/auth/signup`) |
| `POST` | `/auth/login` | Public | Login via email or registered 10-digit mobile number |
| `POST` | `/auth/logout` | Public/Auth | Terminate session |
| `GET` | `/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/categories` | Public | List active food categories |
| `GET` | `/foods` | Public | Menu search, dietary filter, and pagination |
| `GET` | `/foods/:id` | Public | Food item details |
| `POST` | `/orders/validate-cart` | Public/Auth | Live cart calculation (alias: `/orders/preview`) |
| `POST` | `/orders` | Authenticated | Place pickup order (`Idempotency-Key` required) |
| `GET` | `/orders/my` | Authenticated | Customer's personal order history |
| `GET` | `/orders/:id` | Authenticated | Order details & pickup token status |
| `GET` | `/admin/dashboard` | Admin Only | Operations dashboard & today's metrics |
| `GET` | `/admin/orders` | Admin Only | Live counter order queue with status filter |
| `PATCH`| `/admin/orders/:id/status`| Admin Only | Order state machine progression |

For exact JSON request and response payloads, consult [docs/API-CONTRACT.md](file:///d:/Project/moorthy%20cafe/docs/API-CONTRACT.md).

---

## 8. Git Workflow & Collaboration Rules

1. **Branch Naming**:
   - `feature/<name>` for new features (e.g. `feature/frontend-cart`, `feature/backend-api`)
   - `fix/<name>` for bug fixes
   - `docs/<name>` for documentation updates
2. **Pull Requests**:
   - Never push directly to `main`.
   - Every pull request must be reviewed and tested by another team member.
   - Run `npm test` before submitting PRs.
3. **Definition of Done (DoD)**:
   - Feature runs locally without missing environment variables.
   - No hardcoded secrets or prices.
   - Money handled in integer paise.
   - Error, loading, and empty states handled gracefully.

---

## 9. Documentation Index

- [Common Project Instructions](file:///d:/Project/moorthy%20cafe/docs/COMMON-PROJECT-INSTRUCTIONS.md) — Master instructions, scope, and team boundaries.
- [Ragul's Individual Tasks](file:///d:/Project/moorthy%20cafe/docs/RAGUL-INDIVIDUAL-TASKS.md) — Phase-by-phase deliverables for Team Lead & Integration.
- [API Contract](file:///d:/Project/moorthy%20cafe/docs/API-CONTRACT.md) — Detailed payload specs, field types, and error shapes.
- [Owner Decisions Log](file:///d:/Project/moorthy%20cafe/docs/OWNER-DECISIONS.md) — Status of all 14 owner decision points and MVP defaults.
