# Hotel New Moorthi Cafe — Shared API Contract

**Version**: `1.2.0-reconciliation`  
**Base URL (Local)**: `http://localhost:5000/api/v1`  
**Timezone**: `Asia/Kolkata` (UTC+05:30)  
**Coordination Lead**: Ragul S (Team Lead, Integration & Delivery)  
**Consumers**: Rohith (Frontend UI) & Ravi (Backend Engine)  
**Audit Reference**: [docs/CONTRACT-RECONCILIATION.md](file:///d:/Project/moorthy%20cafe/docs/CONTRACT-RECONCILIATION.md)  

> [!WARNING]
> **RECONCILIATION NOTICE (Phase R2.1)**:
> This contract document has been reconciled against the active backend source code. 
> To prevent integration breakage, this document explicitly distinguishes between:
> 1. **Verified Active Backend Implementation** (passes 55 backend regression tests; uses INR numbers with 2 decimals, Bearer JWT in headers, and uppercase enums).
> 2. **Pending Architectural Proposals** (integer paise, HTTP-only cookies, and lowercase enums from the original brief; currently blocked pending team review).
> **Phase R3 integration is blocked until the 4 core decisions in `docs/CONTRACT-RECONCILIATION.md` are formally agreed.**

---

## 1. Global Conventions & Standards

### 1.1 Money Representation
- **Current Active Implementation (Verified by 55 Tests)**:
  - All prices and monetary amounts in MongoDB models (`Food`, `Order`) and API responses are returned as **standard numbers in INR (Rupees)** with up to 2 decimal places.
  - Examples: `price: 160.0`, `subtotal: 320`, `gst: 16`, `packagingCharge: 15`, `totalAmount: 351`.
  - Frontend display format:
    ```javascript
    export const formatINR = (amount) => `₹${Number(amount || 0).toFixed(2)}`;
    ```
- **Proposed Target (Pending Team Decision 2)**:
  - Integer paise convention (e.g. `pricePaise: 16000`).
  - *Status*: PENDING team consensus. Do not rewrite backend schemas or calculation code without an approved migration plan.

### 1.2 Standard Response Envelopes
Every API response strictly follows this JSON envelope format:

#### Success Envelope (2xx)
```json
{
  "success": true,
  "message": "Human-readable operation confirmation",
  "data": {}
}
```

#### Error Envelope (4xx, 5xx)
```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": [
    {
      "field": "email",
      "message": "A valid email address is required"
    }
  ]
}
```

### 1.3 Authentication Scheme
- **Current Active Implementation (Verified)**:
  - **Scheme**: Bearer JWT passed in header: `Authorization: Bearer <token>`.
  - **Login Payload**: Accepts either email or registered mobile number in `identifier` (or `email`).
  - **Response**: JWT token returned in JSON body (`data.token`).
  - **Client Storage**: Token stored in client-side memory or `localStorage` (`moorthi_token`).
- **Proposed Target (Pending Team Decision 3)**:
  - HTTP-only cookie delivery with CSRF tokens.
  - *Status*: PENDING team consensus. Active backend has no cookie-parser middleware.

### 1.4 Order Idempotency
- **Header**: `Idempotency-Key: <unique-uuid-v4>`
- **Behavior**:
  - Re-sending the identical request with the same key returns the existing order (`200 OK` or `201 Created`).
  - Sending an altered request with an existing key returns `409 Conflict`.
  - Mongoose schema has `idempotencyKey` indexed as `sparse: true, unique: true`.

### 1.5 Order Lifecycle State Machine
- **Current Active Implementation (Verified)**:
  ```
  [ PLACED ] ──▶ [ CONFIRMED ] ──▶ [ PREPARING ] ──▶ [ READY ] ──▶ [ COMPLETED ]
       │
       ▼
  [ CANCELLED ] (Customer allowed only when status is PLACED)
  ```
  - Payment Statuses: `PENDING`, `PAID`, `REFUNDED`
  - Payment Methods: `COUNTER_CASH`, `UPI`, `CARD` (Default: `UPI`)
- **Proposed Target (Pending Team Decision 4)**:
  - Lowercase states: `pending`, `ready_for_pickup`, `PAY_AT_COUNTER`.
  - *Status*: PENDING team consensus. Backend strictly enforces uppercase enums.

---

## 2. API Endpoint Specifications

### Group 1: Authentication (`/auth`)

#### 1.1 Register Customer
- **Endpoint**: `POST /auth/register` (alias: `POST /auth/signup` both active)
- **Access**: Public (Rate-limited: 30 requests / 15 mins)
- **Request Body**:
```json
{
  "name": "Sundaram Natarajan",
  "email": "sundaram.natarajan@example.com",
  "phone": "+91 98765 43210",
  "password": "Password123!"
}
```
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Dining account created successfully. Welcome to Hotel New Moorthi Cafe!",
  "data": {
    "user": {
      "id": "670f5e1b7c3d2a1b4c8e9f01",
      "name": "Sundaram Natarajan",
      "email": "sundaram.natarajan@example.com",
      "phone": "+91 98765 43210",
      "role": "customer",
      "isActive": true,
      "createdAt": "2026-10-17T04:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.2 Login Customer or Admin
- **Endpoint**: `POST /auth/login`
- **Access**: Public (Rate-limited: 30 requests / 15 mins)
- **Request Body**:
```json
{
  "identifier": "sundaram.natarajan@example.com",
  "password": "Password123!"
}
```
*(Accepts either email address or 10-digit mobile number in `identifier`).*
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "670f5e1b7c3d2a1b4c8e9f01",
      "name": "Sundaram Natarajan",
      "email": "sundaram.natarajan@example.com",
      "phone": "+91 98765 43210",
      "role": "customer",
      "isActive": true,
      "createdAt": "2026-10-17T04:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.3 Logout
- **Endpoint**: `POST /auth/logout`
- **Access**: Public / Authenticated
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Signed out successfully. Session terminated",
  "data": null
}
```
*(Client action: discard local JWT token).*

#### 1.4 Get Current User Profile
- **Endpoint**: `GET /auth/me`
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Current profile retrieved successfully",
  "data": {
    "user": {
      "id": "670f5e1b7c3d2a1b4c8e9f01",
      "name": "Sundaram Natarajan",
      "email": "sundaram.natarajan@example.com",
      "phone": "+91 98765 43210",
      "role": "customer",
      "isActive": true,
      "createdAt": "2026-10-17T04:30:00.000Z"
    }
  }
}
```

---

### Group 2: Categories & Menu (`/categories`, `/foods`)

#### 2.1 List Categories
- **Endpoint**: `GET /categories`
- **Access**: Public
- **Query Params**:
  - `all` (boolean, default: `false`, admin only to view inactive categories)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "count": 2,
    "categories": [
      {
        "_id": "670f5e1b7c3d2a1b4c8e9f10",
        "name": "Morning Tiffin",
        "slug": "morning-tiffin",
        "description": "Slow-fermented overnight batters, stoneground chutneys & hot drumstick sambar",
        "displayOrder": 1,
        "isActive": true,
        "itemCount": 3
      }
    ]
  }
}
```

#### 2.2 List Foods / Search Menu
- **Endpoint**: `GET /foods`
- **Access**: Public
- **Query Params**:
  - `category` (string, category ObjectId or slug)
  - `search` (string, keyword search against name, description & tags)
  - `isAvailable` (boolean, default: `true` for public)
  - `sort` (string, `price_asc` | `price_desc` | `name_asc` | `newest`)
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Foods retrieved successfully",
  "data": {
    "foods": [
      {
        "_id": "670f5e1b7c3d2a1b4c8e9f20",
        "name": "Golden Ghee Roast Masala Dosa",
        "description": "Crisp cone-rolled dosa cooked on seasoned cast iron with A2 cow ghee",
        "price": 160.0,
        "category": {
          "_id": "670f5e1b7c3d2a1b4c8e9f10",
          "name": "Morning Tiffin",
          "slug": "morning-tiffin"
        },
        "imageUrl": "",
        "isAvailable": true,
        "isVeg": true,
        "portion": "1 Plate (Single Cone)",
        "prepTimeMinutes": 12,
        "tags": ["chef-special", "pure-ghee"]
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

---

### Group 3: Cart Validation & Orders (`/orders`)

#### 3.1 Validate Cart & Preview Bill
- **Endpoint**: `POST /orders/validate-cart` (alias: `POST /orders/preview` both active)
- **Access**: Public or Authenticated
- **Request Body**:
```json
{
  "items": [
    {
      "foodId": "670f5e1b7c3d2a1b4c8e9f20",
      "quantity": 1
    }
  ]
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order pricing breakdown calculated successfully",
  "data": {
    "itemsSnapshot": [
      {
        "food": "670f5e1b7c3d2a1b4c8e9f20",
        "name": "Golden Ghee Roast Masala Dosa",
        "price": 160.0,
        "quantity": 1,
        "lineTotal": 160.0
      }
    ],
    "subtotal": 160.0,
    "gst": 8.0,
    "packagingCharge": 15.0,
    "totalAmount": 183.0
  }
}
```

#### 3.2 Create Order (Place Pickup Order)
- **Endpoint**: `POST /orders`
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Header**: `Idempotency-Key: <UUID-v4>`
- **Request Body**:
```json
{
  "items": [
    {
      "foodId": "670f5e1b7c3d2a1b4c8e9f20",
      "quantity": 1
    }
  ],
  "pickupType": "IMMEDIATE",
  "notes": "Crispy roast, separate sambar bowl",
  "paymentMethod": "UPI"
}
```
- **Success Response (`201 Created` or `200 OK` on Idempotent Replay)**:
```json
{
  "success": true,
  "message": "Order placed successfully! Token issued for counter pickup",
  "data": {
    "order": {
      "_id": "670f5e1b7c3d2a1b4c8e9f50",
      "orderId": "HNMC-20261017-0001",
      "dailyTokenNumber": 1,
      "businessDate": "2026-10-17",
      "customer": "670f5e1b7c3d2a1b4c8e9f01",
      "items": [
        {
          "food": "670f5e1b7c3d2a1b4c8e9f20",
          "name": "Golden Ghee Roast Masala Dosa",
          "price": 160.0,
          "quantity": 1,
          "lineTotal": 160.0
        }
      ],
      "subtotal": 160.0,
      "gst": 8.0,
      "packagingCharge": 15.0,
      "totalAmount": 183.0,
      "pickupType": "IMMEDIATE",
      "notes": "Crispy roast, separate sambar bowl",
      "status": "PLACED",
      "paymentStatus": "PENDING",
      "paymentMethod": "UPI",
      "createdAt": "2026-10-17T05:00:00.000Z"
    }
  }
}
```

#### 3.3 List Customer Orders
- **Endpoint**: `GET /orders/my`
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Query Params**: `page` (default 1), `limit` (default 10), `active` (`true`/`false`), `status`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Customer order history retrieved successfully",
  "data": {
    "orders": [
      {
        "_id": "670f5e1b7c3d2a1b4c8e9f50",
        "orderId": "HNMC-20261017-0001",
        "dailyTokenNumber": 1,
        "status": "PLACED",
        "paymentStatus": "PENDING",
        "totalAmount": 183.0,
        "createdAt": "2026-10-17T05:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

#### 3.4 Get Customer Order by ID
- **Endpoint**: `GET /orders/:id`
- **Access**: Authenticated (Order owner or Admin)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order details retrieved successfully",
  "data": {
    "order": {
      "_id": "670f5e1b7c3d2a1b4c8e9f50",
      "orderId": "HNMC-20261017-0001",
      "dailyTokenNumber": 1,
      "status": "PLACED",
      "paymentStatus": "PENDING",
      "items": [
        {
          "name": "Golden Ghee Roast Masala Dosa",
          "price": 160.0,
          "quantity": 1,
          "lineTotal": 160.0
        }
      ],
      "subtotal": 160.0,
      "gst": 8.0,
      "packagingCharge": 15.0,
      "totalAmount": 183.0,
      "createdAt": "2026-10-17T05:00:00.000Z"
    }
  }
}
```

---

### Group 4: Admin Operations (`/admin`)

#### 4.1 Admin Dashboard Summary
- **Endpoint**: `GET /admin/dashboard`
- **Access**: Admin only (`Authorization: Bearer <admin-token>`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Operations dashboard metrics retrieved successfully",
  "data": {
    "today": {
      "totalOrders": 12,
      "pendingOrders": 2,
      "preparingOrders": 3,
      "readyOrders": 1,
      "completedOrders": 6,
      "cancelledOrders": 0,
      "totalRevenue": 2450.0,
      "averageOrderValue": 204.17
    }
  }
}
```

#### 4.2 List Orders (Admin Queue)
- **Endpoint**: `GET /admin/orders`
- **Access**: Admin only
- **Query Params**:
  - `status` (`PLACED` | `CONFIRMED` | `PREPARING` | `READY` | `COMPLETED` | `CANCELLED` | `all`)
  - `businessDate` (YYYY-MM-DD)
  - `search` (orderId, customer, token number)
  - `page`, `limit`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Orders retrieved successfully for admin management",
  "data": {
    "orders": [
      {
        "_id": "670f5e1b7c3d2a1b4c8e9f50",
        "orderId": "HNMC-20261017-0001",
        "dailyTokenNumber": 1,
        "customer": {
          "name": "Sundaram Natarajan",
          "phone": "+91 98765 43210",
          "email": "sundaram.natarajan@example.com"
        },
        "status": "PLACED",
        "paymentStatus": "PENDING",
        "totalAmount": 183.0,
        "createdAt": "2026-10-17T05:00:00.000Z"
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

#### 4.3 Update Order Status
- **Endpoint**: `PATCH /admin/orders/:id/status`
- **Access**: Admin only
- **Request Body**:
```json
{
  "status": "CONFIRMED",
  "note": "Ticket sent to kitchen"
}
```
*(Valid transitions: `PLACED` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`; or `CANCELLED`).*
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order status updated to CONFIRMED successfully",
  "data": {
    "order": {
      "_id": "670f5e1b7c3d2a1b4c8e9f50",
      "orderId": "HNMC-20261017-0001",
      "status": "CONFIRMED",
      "updatedAt": "2026-10-17T05:10:00.000Z"
    }
  }
}
```
