# Hotel New Moorthi Cafe — Backend Implementation Plan

**Lead**: Ragul S  
**Stack**: Node.js, Express.js (v5), MongoDB (v8 via Docker), Mongoose (v9), CommonJS  
**Timezone**: `Asia/Kolkata` (UTC+05:30)  
**Standard Response Format**:
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

---

## 1. Directory Structure Plan

```
backend/
  src/
    config/
      db.js             # Mongoose connection with reconnection handling
      env.js            # Environment variable loading & strict validation
    models/
      User.js           # Customer & Admin accounts with bcrypt hashing
      Category.js       # Food categories with unique slugs & safe deactivation
      Food.js           # Menu items with INR prices & dietary tags
      Order.js          # Orders with item snapshots, daily tokens & status machine
      DailyCounter.js   # Atomic concurrency-safe daily token & sequence counters
    controllers/
      authController.js      # Signup, login (email/phone), get current user profile
      categoryController.js  # Category listing (public) & management (admin)
      foodController.js      # Menu retrieval with category/search filters & CRUD
      orderController.js     # Order placement, price calculation & my order history
      adminController.js     # Admin order listing, status transitions & live metrics
      reportController.js    # Sales & daily settlement reports
    services/
      orderService.js   # Business logic for totals, GST, packaging & atomic token allocation
      counterService.js # Safe atomic token increments by Kolkata business date
      reportService.js  # Revenue & order aggregation queries
    middleware/
      authenticate.js   # Bearer JWT verification & req.user attachment
      authorize.js      # Role-based access control (admin, customer)
      validate.js       # Input validation schema runner
      notFound.js       # 404 handler for unmatched routes
      errorHandler.js   # Centralised error handling (AppError, CastError, MongoError)
    routes/
      authRoutes.js
      categoryRoutes.js
      foodRoutes.js
      orderRoutes.js
      adminRoutes.js
      reportRoutes.js
    validators/
      authValidators.js
      categoryValidators.js
      foodValidators.js
      orderValidators.js
    utils/
      AppError.js
      asyncHandler.js
      dateTime.js       # Asia/Kolkata date calculations
      generateOrderId.js
    app.js              # Express app with Helmet, CORS, Rate Limiter & JSON parser
    server.js           # Server entry point with graceful shutdown
  tests/
    auth.test.js
    food.test.js
    order.test.js
    token.test.js
  postman/
    MoorthiCafe.postman_collection.json
    MoorthiCafe.local.postman_environment.json
  docs/
    REPOSITORY_AUDIT.md
    BACKEND_IMPLEMENTATION_PLAN.md
    STITCH_API_REQUIREMENTS.md
    API_DOCUMENTATION.md
    DATABASE_SCHEMA.md
    SETUP_GUIDE.md
    POSTMAN_TESTING_GUIDE.md
    FRONTEND_INTEGRATION_GUIDE.md
    SECURITY_CHECKLIST.md
  .env
  .env.example
  .gitignore
  README.md
```

---

## 2. Phase-by-Phase Roadmap

### Phase 2: Backend Foundation
- Validate `.env` variables upon startup (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `BUSINESS_TIMEZONE`).
- Implement `src/config/db.js` with production-grade event logging (`connected`, `error`, `disconnected`).
- Implement `src/utils/AppError.js`, `src/utils/asyncHandler.js`, `src/utils/dateTime.js`.
- Implement `src/middleware/errorHandler.js` and `src/middleware/notFound.js`.
- Implement health endpoint: `GET /api/v1/health`.
- Wire `src/app.js` and `src/server.js`.

### Phase 3: Database Models & Indexes
- **User**: `name`, `email` (unique, lowercase), `phone` (indexed), `passwordHash` (excluded by default), `role` (`customer`, `admin`), `isActive`.
- **Category**: `name`, `slug` (unique), `description`, `displayOrder`, `isActive`.
- **Food**: `name`, `category` (ref), `price` (INR), `description`, `imageUrl`, `isAvailable`, `isVeg` (true), `prepTimeMinutes`, `tags`.
- **DailyCounter**: `businessDate` (YYYY-MM-DD), `counterType`, `sequence`. Compound unique index: `{ businessDate: 1, counterType: 1 }`.
- **Order**: `orderId` (unique), `dailyTokenNumber`, `businessDate`, `customer` (ref), `items` (snapshot of name, price, quantity, lineTotal), `subtotal`, `gst`, `packagingCharge`, `totalAmount`, `pickupAt`, `pickupType` (`IMMEDIATE` / `SCHEDULED`), `notes`, `status` (`PLACED`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`).

### Phase 4: Authentication & Authorisation
- Signup: `POST /api/v1/auth/signup` (creates `customer`, hashes password, issues JWT).
- Login: `POST /api/v1/auth/login` (accepts email or mobile, verifies password, issues JWT).
- Profile: `GET /api/v1/auth/me` (returns user profile).
- Middleware: `authenticate` (JWT verification) and `authorize('admin')`.

### Phase 5: Menu & Categories API
- Public:
  - `GET /api/v1/categories` (active categories)
  - `GET /api/v1/foods` (with category filter, search, pagination)
  - `GET /api/v1/foods/:id`
- Admin Only:
  - `POST /api/v1/categories`, `PATCH /api/v1/categories/:id`, `DELETE /api/v1/categories/:id` (safe deactivation)
  - `POST /api/v1/foods`, `PATCH /api/v1/foods/:id`, `DELETE /api/v1/foods/:id`

### Phase 6: Order Pipeline & Concurrency-Safe Tokens
- Atomic Daily Token Generation using `findOneAndUpdate` with `$inc: { sequence: 1 }`, `upsert: true`.
- Dynamic calculation of items from active database prices. Rejection of client-supplied pricing or status.
- Order creation: `POST /api/v1/orders`.
- Customer Order History: `GET /api/v1/orders/my`.
- Customer Order Detail: `GET /api/v1/orders/:id` (ownership strictly enforced).
- Customer Cancel: `POST /api/v1/orders/:id/cancel` (only allowed when status is `PLACED`).

### Phase 7: Admin Operations & Reports
- Admin Orders: `GET /api/v1/admin/orders` (filters: `status`, `businessDate`, pagination).
- Admin Order Detail: `GET /api/v1/admin/orders/:id`.
- Status Transition: `PATCH /api/v1/admin/orders/:id/status` (enforcing state machine: `PLACED` -> `CONFIRMED` -> `PREPARING` -> `READY` -> `COMPLETED`).
- Operations Dashboard: `GET /api/v1/admin/dashboard` (today's revenue, active tokens, status counts).
- Sales Report: `GET /api/v1/admin/reports/sales` (aggregated by date range).

### Phase 8: Documentation & Postman Artifacts
- Comprehensive API documentation for frontend team.
- Exportable Postman collection and local environment JSON.

### Phase 9: Verification & Automated Integration Tests
- Unit and integration tests for auth, calculations, order flow, and concurrent token requests.

### Phase 10 & 11: Team Integration & Git Review
- Final review against Stitch design specifications.
- Provide safe Git commit guidance without unapproved push.
