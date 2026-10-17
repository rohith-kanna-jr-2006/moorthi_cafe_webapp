# Hotel New Moorthi Cafe — Shared API Contract

**Version**: `1.1.0`  
**Base URL (Local)**: `http://localhost:5000/api/v1`  
**Timezone**: `Asia/Kolkata` (UTC+05:30)  
**Coordination Lead**: Ragul (Phase R2 Deliverable)  
**Consumers**: Rohith (Frontend UI) & Ravi (Backend Engine)  

---

## 1. Global Conventions & Standards

### 1.1 Money Representation
- **Rule**: All monetary values in the database and API are represented as **positive integer paise** (1 INR = 100 paise).
  - Example: ₹80.00 is stored and transmitted as `8000`.
  - Example: ₹125.50 is stored and transmitted as `12550`.
- **Frontend Formatting**: The frontend converts paise to formatted currency for display:
  ```javascript
  export const formatPaise = (paise) => `₹${(paise / 100).toFixed(2)}`;
  ```

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
- **Scheme**: Bearer JWT passed in header: `Authorization: Bearer <token>`.
- **Cookie Support**: Endpoints support credentials mode (`withCredentials: true`), allowing JWT to be delivered via HTTP-only cookie or authorization header.
- **Login Identifier Resolution**: Customers can log in using either **Email Address** or **Registered 10-digit Mobile Number** via the unified `identifier` (or `email`) field.

### 1.4 Order Idempotency
- **Rule**: All order creation requests (`POST /orders`) require an `Idempotency-Key` header with a unique client-generated UUID/v4.
- **Header**: `Idempotency-Key: <unique-uuid-v4>`
- **Behavior**:
  - Re-sending the identical request with the same key returns the existing order (`200 OK` or `201 Created`).
  - Sending a altered request (e.g., modified items or quantities) with an existing key returns `409 Conflict`.

### 1.5 Order Lifecycle State Machine
```
[ PLACED / PENDING ] ──▶ [ CONFIRMED ] ──▶ [ PREPARING ] ──▶ [ READY / READY_FOR_PICKUP ] ──▶ [ COMPLETED ]
         │
         ▼
   [ CANCELLED ] (Customer allowed only when status is PLACED / PENDING)
```

---

## 2. API Endpoint Specifications

### Group 1: Authentication (`/auth`)

#### 1.1 Register Customer
- **Endpoint**: `POST /auth/register` (alias: `POST /auth/signup`)
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
*(Note: `identifier` accepts either email or 10-digit mobile number).*
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
  - `active` (boolean, default: `true`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Active categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "670f5e1b7c3d2a1b4c8e9f10",
        "name": "South Indian Breakfast",
        "slug": "south-indian-breakfast",
        "description": "Steaming hot idlis, crispy vadas, and traditional tiffins",
        "displayOrder": 1,
        "isActive": true
      },
      {
        "id": "670f5e1b7c3d2a1b4c8e9f11",
        "name": "Crispy Dosas",
        "slug": "crispy-dosas",
        "description": "Golden roasted dosas served with 3 chutneys and sambar",
        "displayOrder": 2,
        "isActive": true
      }
    ]
  }
}
```

#### 2.2 List Foods / Search Menu
- **Endpoint**: `GET /foods`
- **Access**: Public
- **Query Params**:
  - `category` (string, category ID or slug)
  - `search` (string, keyword search against name & description)
  - `dietary` (string, `VEG` | `NON_VEG` | `VEGAN`)
  - `available` (boolean, default: `true`)
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Food items retrieved successfully",
  "data": {
    "items": [
      {
        "id": "670f5e1b7c3d2a1b4c8e9f20",
        "name": "Ghee Podi Idli (2 Pcs)",
        "category": {
          "id": "670f5e1b7c3d2a1b4c8e9f10",
          "name": "South Indian Breakfast",
          "slug": "south-indian-breakfast"
        },
        "description": "Mini rice cakes tossed in aromatic spiced lentil gunpowder and clarified butter",
        "pricePaise": 6000,
        "formattedPrice": "₹60.00",
        "isAvailable": true,
        "dietaryTag": "VEG",
        "spiceLevel": "MEDIUM",
        "imageUrl": "/assets/foods/ghee_podi_idli.jpg"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "limit": 20
    }
  }
}
```

#### 2.3 Get Food Item Details
- **Endpoint**: `GET /foods/:id`
- **Access**: Public
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Food details retrieved successfully",
  "data": {
    "food": {
      "id": "670f5e1b7c3d2a1b4c8e9f20",
      "name": "Ghee Podi Idli (2 Pcs)",
      "category": "670f5e1b7c3d2a1b4c8e9f10",
      "description": "Mini rice cakes tossed in aromatic spiced lentil gunpowder and clarified butter",
      "pricePaise": 6000,
      "formattedPrice": "₹60.00",
      "isAvailable": true,
      "dietaryTag": "VEG",
      "spiceLevel": "MEDIUM",
      "imageUrl": "/assets/foods/ghee_podi_idli.jpg"
    }
  }
}
```

---

### Group 3: Cart Validation & Orders (`/orders`)

#### 3.1 Validate Cart & Preview Bill
- **Endpoint**: `POST /orders/validate-cart` (alias: `POST /orders/preview`)
- **Access**: Public or Authenticated
- **Purpose**: Calculate live bill breakdown before checkout. Ensures food is available and calculates tax/packaging without storing an order.
- **Request Body**:
```json
{
  "items": [
    {
      "foodId": "670f5e1b7c3d2a1b4c8e9f20",
      "quantity": 2
    }
  ],
  "pickupType": "IMMEDIATE"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Cart pricing calculated successfully",
  "data": {
    "items": [
      {
        "foodId": "670f5e1b7c3d2a1b4c8e9f20",
        "name": "Ghee Podi Idli (2 Pcs)",
        "quantity": 2,
        "pricePaise": 6000,
        "lineTotalPaise": 12000,
        "formattedPrice": "₹60.00",
        "formattedLineTotal": "₹120.00"
      }
    ],
    "pricing": {
      "subtotalPaise": 12000,
      "packagingChargePaise": 1500,
      "taxRatePercentage": 5,
      "taxAmountPaise": 600,
      "totalPaise": 14100,
      "formattedSubtotal": "₹120.00",
      "formattedPackaging": "₹15.00",
      "formattedTax": "₹6.00",
      "formattedTotal": "₹141.00"
    },
    "estimatedPrepMinutes": 15
  }
}
```

#### 3.2 Create Order (Place Pickup Order)
- **Endpoint**: `POST /orders`
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Required Header**: `Idempotency-Key: <UUID-v4>`
- **Request Body**:
```json
{
  "items": [
    {
      "foodId": "670f5e1b7c3d2a1b4c8e9f20",
      "quantity": 2
    }
  ],
  "pickupType": "IMMEDIATE",
  "specialInstructions": "Please pack sambar separately"
}
```
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Pickup order placed successfully. Your counter token is ready!",
  "data": {
    "order": {
      "id": "670f5e1b7c3d2a1b4c8e9f50",
      "orderNumber": "NMC-20261017-0042",
      "dailyToken": 42,
      "formattedToken": "#042",
      "status": "PLACED",
      "paymentStatus": "PENDING",
      "paymentMethod": "PAY_AT_COUNTER",
      "items": [
        {
          "foodId": "670f5e1b7c3d2a1b4c8e9f20",
          "name": "Ghee Podi Idli (2 Pcs)",
          "quantity": 2,
          "pricePaise": 6000,
          "lineTotalPaise": 12000
        }
      ],
      "pricing": {
        "subtotalPaise": 12000,
        "packagingChargePaise": 1500,
        "taxAmountPaise": 600,
        "totalPaise": 14100,
        "formattedTotal": "₹141.00"
      },
      "estimatedPrepMinutes": 15,
      "specialInstructions": "Please pack sambar separately",
      "createdAt": "2026-10-17T04:45:00.000Z"
    }
  }
}
```

#### 3.3 List Customer Orders
- **Endpoint**: `GET /orders/my`
- **Access**: Authenticated (`Authorization: Bearer <token>`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order history retrieved successfully",
  "data": {
    "orders": [
      {
        "id": "670f5e1b7c3d2a1b4c8e9f50",
        "orderNumber": "NMC-20261017-0042",
        "dailyToken": 42,
        "formattedToken": "#042",
        "status": "PLACED",
        "paymentStatus": "PENDING",
        "totalPaise": 14100,
        "formattedTotal": "₹141.00",
        "itemCount": 2,
        "createdAt": "2026-10-17T04:45:00.000Z"
      }
    ]
  }
}
```

#### 3.4 Get Customer Order by ID
- **Endpoint**: `GET /orders/:id`
- **Access**: Authenticated (Owner customer or Admin)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order details retrieved successfully",
  "data": {
    "order": {
      "id": "670f5e1b7c3d2a1b4c8e9f50",
      "orderNumber": "NMC-20261017-0042",
      "dailyToken": 42,
      "formattedToken": "#042",
      "status": "PLACED",
      "paymentStatus": "PENDING",
      "items": [
        {
          "foodId": "670f5e1b7c3d2a1b4c8e9f20",
          "name": "Ghee Podi Idli (2 Pcs)",
          "quantity": 2,
          "pricePaise": 6000,
          "lineTotalPaise": 12000
        }
      ],
      "pricing": {
        "subtotalPaise": 12000,
        "packagingChargePaise": 1500,
        "taxAmountPaise": 600,
        "totalPaise": 14100,
        "formattedTotal": "₹141.00"
      },
      "createdAt": "2026-10-17T04:45:00.000Z"
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
  "message": "Admin operations metrics retrieved successfully",
  "data": {
    "todayMetrics": {
      "totalOrders": 128,
      "pendingOrders": 6,
      "preparingOrders": 12,
      "readyOrders": 4,
      "completedOrders": 104,
      "totalRevenuePaise": 2456000,
      "formattedRevenue": "₹24,560.00"
    }
  }
}
```

#### 4.2 List Orders (Admin Queue)
- **Endpoint**: `GET /admin/orders`
- **Access**: Admin only
- **Query Params**:
  - `status` (string, `PLACED` | `CONFIRMED` | `PREPARING` | `READY` | `COMPLETED` | `CANCELLED`)
  - `date` (string, YYYY-MM-DD)
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Admin orders list retrieved successfully",
  "data": {
    "orders": [
      {
        "id": "670f5e1b7c3d2a1b4c8e9f50",
        "orderNumber": "NMC-20261017-0042",
        "dailyToken": 42,
        "formattedToken": "#042",
        "customer": {
          "name": "Sundaram Natarajan",
          "phone": "+91 98765 43210"
        },
        "status": "PLACED",
        "paymentStatus": "PENDING",
        "totalPaise": 14100,
        "createdAt": "2026-10-17T04:45:00.000Z"
      }
    ]
  }
}
```

#### 4.3 Update Order Status
- **Endpoint**: `PATCH /admin/orders/:id/status`
- **Access**: Admin only
- **Request Body**:
```json
{
  "status": "CONFIRMED"
}
```
*(Valid transitions: `PLACED` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`).*
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": "670f5e1b7c3d2a1b4c8e9f50",
      "status": "CONFIRMED",
      "updatedAt": "2026-10-17T04:50:00.000Z"
    }
  }
}
```
