# Hotel New Moorthi Cafe — API Documentation

**Base URL**: `http://localhost:5000/api/v1`  
**Timezone**: `Asia/Kolkata` (UTC+05:30)  
**Authentication Scheme**: HTTP Bearer Token (`Authorization: Bearer <JWT>`)  
**Standard Response Envelope**:
```json
// Success
{
  "success": true,
  "message": "Human-readable confirmation",
  "data": {}
}

// Error
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [
    { "field": "email", "message": "A valid email address is required" }
  ]
}
```

---

## 1. System Health & Diagnostics

### `GET /api/v1/health`
- **Purpose**: Verify backend uptime, database connectivity, and runtime readiness without exposing secrets.
- **Auth**: Public
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Hotel New Moorthi Cafe API is healthy and operational",
  "data": {
    "status": "UP",
    "timestamp": "2026-10-16T05:43:51.000Z",
    "uptime": 124.5,
    "environment": "development",
    "database": "CONNECTED",
    "timezone": "Asia/Kolkata"
  }
}
```
- **Error (503 Service Unavailable)**: Returned if MongoDB is unreachable (`database: "DISCONNECTED"`).

---

## 2. Authentication APIs

### `POST /api/v1/auth/signup`
- **Purpose**: Register a new dining account for counter pickup slips and live token alerts.
- **Auth**: Public (Rate-limited: max 30 attempts / 15m)
- **Stitch Screen**: Customer Signup (`84141f83649c42afa6b60185ee379f79`)
- **Request Body**:
```json
{
  "name": "Sundaram Natarajan",
  "email": "sundaram@chidambaram.in",
  "phone": "+91 98765 43210",
  "password": "ExampleStrongPass123!"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Dining account created successfully. Welcome to Hotel New Moorthi Cafe!",
  "data": {
    "user": {
      "id": "6ad0aca6a2955988bec1dcc7",
      "name": "Sundaram Natarajan",
      "email": "sundaram@chidambaram.in",
      "phone": "+91 98765 43210",
      "role": "customer",
      "isActive": true,
      "createdAt": "2026-10-16T05:40:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Errors**:
  - `400 Bad Request`: Validation failure (name < 2 chars, invalid email, phone < 10 digits, password < 6 chars).
  - `409 Conflict`: Email already registered.

### `POST /api/v1/auth/login`
- **Purpose**: Authenticate using registered email OR mobile number and password.
- **Auth**: Public (Rate-limited: max 30 attempts / 15m)
- **Stitch Screen**: Customer Login (`5412afd34d8f4c15b996208b2ebad869`)
- **Request Body (Email)**:
```json
{
  "identifier": "sundaram@chidambaram.in",
  "password": "ExampleStrongPass123!"
}
```
- **Request Body (Mobile)**:
```json
{
  "identifier": "+91 98765 43210",
  "password": "ExampleStrongPass123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "6ad0aca6a2955988bec1dcc7",
      "name": "Sundaram Natarajan",
      "email": "sundaram@chidambaram.in",
      "phone": "+91 98765 43210",
      "role": "customer",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Errors**:
  - `401 Unauthorized`: "Invalid credentials. Please verify your login details and password" (safe error, prevents user enumeration).
  - `403 Forbidden`: Account is deactivated.

### `GET /api/v1/auth/me`
- **Purpose**: Retrieve current customer/admin profile details from Bearer token.
- **Auth**: Bearer Token
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Current profile retrieved successfully",
  "data": {
    "user": {
      "id": "6ad0aca6a2955988bec1dcc7",
      "name": "Sundaram Natarajan",
      "email": "sundaram@chidambaram.in",
      "phone": "+91 98765 43210",
      "role": "customer",
      "isActive": true
    }
  }
}
```
- **Errors**:
  - `401 Unauthorized`: Token missing, expired, or invalid.

---

## 3. Categories APIs

### `GET /api/v1/categories`
- **Purpose**: List menu categories sorted by `displayOrder`.
- **Auth**: Public
- **Query Parameters**:
  - `all`: `boolean` (optional, default `false`). If `true`, returns active and deactivated categories.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "count": 6,
    "categories": [
      {
        "_id": "6ad0aca6a2955988bec1dcc1",
        "name": "Morning Tiffin",
        "slug": "morning-tiffin",
        "description": "Slow-fermented overnight rice-urad dal batters...",
        "displayOrder": 1,
        "isActive": true
      }
    ]
  }
}
```

### `POST /api/v1/categories`
- **Purpose**: Create a new food category.
- **Auth**: Bearer Admin
- **Request Body**:
```json
{
  "name": "Wood-Fired Tandoor",
  "description": "Clay oven roasted traditional flatbreads",
  "displayOrder": 7
}
```
- **Success Response (201 Created)**: Category object with generated unique slug (`wood-fired-tandoor`).

### `PATCH /api/v1/categories/:id`
- **Purpose**: Update category name, description, display order, or active state.
- **Auth**: Bearer Admin

### `DELETE /api/v1/categories/:id`
- **Purpose**: Delete category safely.
- **Auth**: Bearer Admin
- **Behavior**: If dishes reference this category, it is safely marked `isActive = false` to preserve menu and order integrity instead of hard-deleting.

---

## 4. Food Menu APIs

### `GET /api/v1/foods`
- **Purpose**: Retrieve food menu dishes with filtering, search, and pagination.
- **Auth**: Public
- **Query Parameters**:
  - `category`: Category slug (`morning-tiffin`) OR Category ObjectId (`6ad0aca6a2955988bec1dcc1`).
  - `search`: Keyword string (searches name, description, tags).
  - `isAvailable`: `true` | `false` (public defaults to available only).
  - `sort`: `price_asc` | `price_desc` | `name` | `createdAt`.
  - `page`: Page number (default: 1).
  - `limit`: Items per page (default: 20, max: 100).
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Foods retrieved successfully",
  "data": {
    "foods": [
      {
        "_id": "6ad0aca6a2955988bec1dcc2",
        "name": "Golden Ghee Roast Masala Dosa",
        "description": "Crisp cone-rolled dosa cooked on seasoned cast iron with A2 cow ghee...",
        "price": 160.0,
        "category": {
          "_id": "6ad0aca6a2955988bec1dcc1",
          "name": "Morning Tiffin",
          "slug": "morning-tiffin"
        },
        "isVeg": true,
        "portion": "1 Plate (Single Cone)",
        "prepTimeMinutes": 12,
        "isAvailable": true,
        "tags": ["chef-special", "wood-fired", "pure-ghee"]
      }
    ],
    "pagination": {
      "total": 7,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### `GET /api/v1/foods/:id`
- **Purpose**: Retrieve single dish details.
- **Auth**: Public

### `POST /api/v1/foods`
- **Purpose**: Create a new menu dish.
- **Auth**: Bearer Admin
- **Request Body**:
```json
{
  "name": "Thatte Idli Vadai Combo",
  "description": "1 Giant mallipoo idli drenched in ghee podi with 1 crisp medu vada and sambar",
  "price": 140.0,
  "category": "6ad0aca6a2955988bec1dcc1",
  "portion": "1 Idli + 1 Vada",
  "prepTimeMinutes": 8,
  "isVeg": true,
  "isAvailable": true,
  "tags": ["combo", "chef-special"]
}
```
- **Success Response (201 Created)**

### `PATCH /api/v1/foods/:id`
- **Purpose**: Update dish details or toggle availability.
- **Auth**: Bearer Admin

### `DELETE /api/v1/foods/:id`
- **Purpose**: Delete dish safely.
- **Auth**: Bearer Admin
- **Behavior**: If historical orders reference this dish, it is marked `isAvailable = false` to preserve customer receipts.

---

## 5. Customer Orders & Cart APIs

### `POST /api/v1/orders/preview`
- **Purpose**: Calculate authoritative billing breakdown (Subtotal, 5% GST, Eco-packaging ₹15, Total) directly from active database prices without submitting an order.
- **Auth**: Public or Authenticated
- **Request Body**:
```json
{
  "items": [
    { "foodId": "6ad0aca6a2955988bec1dcc2", "quantity": 1 },
    { "foodId": "6ad0aca6a2955988bec1dcc3", "quantity": 2 }
  ]
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Order pricing breakdown calculated successfully",
  "data": {
    "itemsSnapshot": [
      {
        "food": "6ad0aca6a2955988bec1dcc2",
        "name": "Golden Ghee Roast Masala Dosa",
        "price": 160.0,
        "quantity": 1,
        "lineTotal": 160.0
      },
      {
        "food": "6ad0aca6a2955988bec1dcc3",
        "name": "Medu Vada (2 Pcs)",
        "price": 80.0,
        "quantity": 2,
        "lineTotal": 160.0
      }
    ],
    "subtotal": 320.0,
    "gst": 16.0,
    "packagingCharge": 15.0,
    "totalAmount": 351.0
  }
}
```

### `POST /api/v1/orders`
- **Purpose**: Submit customer order. Allocates an atomic daily token, assigns human-readable orderId, generates price snapshot, and enforces idempotency.
- **Auth**: Bearer Customer
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Idempotency-Key: <unique-uuid-or-string>` (Optional, protects against double-clicks/client retries)
- **Request Body**:
```json
{
  "items": [
    { "foodId": "6ad0aca6a2955988bec1dcc2", "quantity": 1 },
    { "foodId": "6ad0aca6a2955988bec1dcc3", "quantity": 2 }
  ],
  "pickupType": "IMMEDIATE",
  "notes": "Separate coconut chutney in compostable bowl; Kaapi extra hot",
  "paymentMethod": "UPI"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Order placed successfully! Token issued for counter pickup",
  "data": {
    "order": {
      "_id": "6ad0aca6a2955988bec1dcc9",
      "orderId": "HNMC-20261016-0042",
      "dailyTokenNumber": 42,
      "businessDate": "2026-10-16",
      "subtotal": 320.0,
      "gst": 16.0,
      "packagingCharge": 15.0,
      "totalAmount": 351.0,
      "pickupType": "IMMEDIATE",
      "pickupAt": "2026-10-16T06:05:00.000Z",
      "pickupStation": "Chidambaram Central Dining Hall - Express Parcel Counter 2",
      "notes": "Separate coconut chutney in compostable bowl; Kaapi extra hot",
      "status": "PLACED",
      "paymentStatus": "PAID",
      "paymentMethod": "UPI"
    }
  }
}
```

### `GET /api/v1/orders/my`
- **Purpose**: Retrieve authenticated customer's order history.
- **Auth**: Bearer Customer
- **Query Parameters**:
  - `active`: `boolean` (optional; if `true`, returns orders currently in `PLACED`, `CONFIRMED`, `PREPARING`, or `READY`).
  - `status`: filter by explicit status.

### `GET /api/v1/orders/:id`
- **Purpose**: Retrieve single order details.
- **Auth**: Bearer Customer (Owner only) or Bearer Admin
- **Errors**: `403 Forbidden` if customer attempts to view another diner's order.

### `POST /api/v1/orders/:id/cancel`
- **Purpose**: Customer self-cancellation.
- **Auth**: Bearer Customer (Owner only) or Bearer Admin
- **Business Policy**: Customer may cancel ONLY while status is `PLACED`. Once kitchen transitions order to `CONFIRMED` or `PREPARING`, customer cancellation is rejected (`400 Bad Request`).

---

## 6. Admin & Operations APIs

### `GET /api/v1/admin/dashboard`
- **Purpose**: Real-time kitchen & counter metrics matching Stitch Admin Dashboard (`3c35b1470df44029a6007025731266dd`).
- **Auth**: Bearer Admin
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Operations and kitchen dashboard data retrieved",
  "data": {
    "metrics": {
      "businessDate": "2026-10-16",
      "revenue": {
        "total": 24850.0,
        "upi": 18400.0,
        "cash": 6450.0,
        "card": 0.0
      },
      "orders": {
        "PLACED": 6,
        "CONFIRMED": 4,
        "PREPARING": 18,
        "READY": 118,
        "COMPLETED": 142,
        "CANCELLED": 2,
        "total": 144
      },
      "activeTokensQueue": {
        "count": 28,
        "lowestToken": 42,
        "highestToken": 48,
        "tokens": [42, 43, 44, 45, 46, 47, 48]
      }
    },
    "recentOrders": [...]
  }
}
```

### `GET /api/v1/admin/orders`
- **Purpose**: Kitchen counter management table with live search and filter tabs.
- **Auth**: Bearer Admin
- **Query Parameters**:
  - `status`: `all` | `placed` | `confirmed` | `preparing` | `ready` | `completed` | `cancelled`
  - `businessDate`: `YYYY-MM-DD`
  - `search`: diner name, phone, orderId, or token integer
  - `page`, `limit`

### `PATCH /api/v1/admin/orders/:id/status`
- **Purpose**: Progress order through the authorized state machine and/or record payment status (e.g. counter cash/UPI settlement).
- **Auth**: Bearer Admin
- **Permitted State Transitions**:
  - `PLACED` -> `CONFIRMED` | `CANCELLED`
  - `CONFIRMED` -> `PREPARING` | `CANCELLED`
  - `PREPARING` -> `READY` | `CANCELLED`
  - `READY` -> `COMPLETED`
  - `COMPLETED` -> Terminal
  - `CANCELLED` -> Terminal
- **Request Body**:
```json
{
  "status": "READY",
  "paymentStatus": "PAID",
  "note": "Packed in parcel box and handed at Counter 1"
}
```
*(Either `status` or `paymentStatus` or both can be provided)*

### `GET /api/v1/admin/customers`
- **Purpose**: Retrieve registered diner accounts with real-time total order counts and status for admin customer management.
- **Auth**: Bearer Admin
- **Query Parameters**:
  - `search`: diner name, email, or phone
  - `page`: default 1
  - `limit`: default 20 (max 100)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Customers retrieved successfully for admin management",
  "data": {
    "customers": [
      {
        "id": "6ad0aca6a2955988bec1dcc7",
        "name": "Sundaram Natarajan",
        "email": "sundaram@chidambaram.in",
        "phone": "+91 98765 43210",
        "isActive": true,
        "totalOrders": 3,
        "createdAt": "2026-10-16T05:40:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### `GET /api/v1/admin/reports/sales`
- **Purpose**: Aggregated revenue, payment method breakdown, and best-seller reports for daily business settlement.
- **Auth**: Bearer Admin
- **Query Parameters**:
  - `from`: `YYYY-MM-DD`
  - `to`: `YYYY-MM-DD`
```
