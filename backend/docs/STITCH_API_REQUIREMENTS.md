# Hotel New Moorthi Cafe — Stitch Screen API Requirements & Mappings

**Stitch Project**: `10226317095148879480` (*Hotel New Moorthi Website*)  
**Design Theme**: Heritage Culinary Warmth (Noto Serif + Plus Jakarta Sans, Terracotta `#C05621`, Banana Leaf `#2F855A`, Turmeric Gold `#D69E2E`, Warm Ivory `#FAF5EF`)  
**Read-Only Inspection**: All 9 screens inspected via Stitch MCP.

---

## Screen-to-API Mapping Matrix

| # | Stitch Screen | Screen ID | React Component / Action | HTTP Method & Route | Authentication & Role | Request Payload | Key Response Fields |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Customer Signup** | `84141f83649c42afa6b60185ee379f79` | User registers for counter pickup | `POST /api/v1/auth/signup` | Public | `{ name, email, phone, password }` | `{ user: { id, name, email, phone, role }, token }` |
| **2** | **Customer Login** | `5412afd34d8f4c15b996208b2ebad869` | User logs in via Email or Mobile | `POST /api/v1/auth/login` | Public | `{ identifier, password }` | `{ user: { id, name, email, phone, role }, token }` |
| **3** | **Customer Dashboard** | `cacfd69d2e9547a0bb6d4068868da989` | Browse category pills, featured specials & active orders | `GET /api/v1/categories`<br>`GET /api/v1/foods?featured=true`<br>`GET /api/v1/orders/my?active=true` | Optional / Bearer Customer | Query params: `category`, `search` | `categories: [...]`, `specials: [...]`, `activeOrders: [...]` |
| **4** | **Food Menu** | `cf66aef7191e4462bdd7efda2dceedca` | Browse menu with category tabs & dietary filters | `GET /api/v1/categories`<br>`GET /api/v1/foods` | Public | Query: `category`, `search`, `page`, `limit` | `foods: [{ id, name, price, description, imageUrl, isVeg, isAvailable, prepTimeMinutes, category }]` |
| **5** | **Shopping Cart** | `e8a389669bee43dfbb441c60f330a49a` | Cart price preview, quantity steppers, bill breakdown | Frontend local cart + `POST /api/v1/orders/preview` (or computed on placement) | Public / Bearer Customer | `{ items: [{ foodId, quantity }] }` | `{ subtotal, gst, packagingCharge, totalAmount }` |
| **6** | **Checkout** | `6f8b6285b2904e4f8f0684de516fae24` | Pickup time selection (Immediate vs Scheduled), special notes, order submission | `POST /api/v1/orders` | Bearer Customer | `{ items: [{ foodId, quantity }], pickupType, pickupAt, notes }` | `{ order: { orderId, dailyTokenNumber, totalAmount, status, pickupAt } }` |
| **7** | **Order Success** | `3e277b1e1de34752b8d4801603e5d45b` | View generated Daily Token #, Order ID & Estimated time | `GET /api/v1/orders/:id` | Bearer Customer (Owner) | Path param: `id` | `{ orderId: "#HNMC-9824", dailyTokenNumber: 42, estimatedPickupTime, items, status }` |
| **8** | **Order Management** | `b819332163154004a140b7bc72cf653a` | Kitchen / Counter staff live orders, status update & call token | `GET /api/v1/admin/orders`<br>`PATCH /api/v1/admin/orders/:id/status` | Bearer Admin | Query: `status`, `businessDate`<br>Body: `{ status: "READY" }` | List of orders with customer name, phone, token #, items snapshot, payment status |
| **9** | **Admin Dashboard** | `3c35b1470df44029a6007025731266dd` | Daily operations, revenue metrics & recent counter orders | `GET /api/v1/admin/dashboard` | Bearer Admin | None | `{ metrics: { todayRevenue, todayOrdersCount, activeTokensQueue: { from, to }, statusCounts: { placed, confirmed, preparing, ready, completed } }, recentOrders: [...] }` |

---

## Field Specifications & Validation Rules

### 1. Signup & Profile
- `name`: string, trimmed, 2-50 characters.
- `email`: string, valid email format, lowercased, unique.
- `phone`: string, 10-15 digits (e.g. `+91 98765 43210`), normalized to numeric string.
- `password`: string, minimum 6 characters.

### 2. Login
- `identifier`: string, required (either valid email or phone number).
- `password`: string, required.

### 3. Food & Category
- `price`: number in INR (non-negative integer/float, stored as numeric with 2 decimal places or paise).
- `isVeg`: boolean, default `true` (Satvik vegetarian policy).
- `category`: valid MongoDB ObjectId referencing `Category`.
- `prepTimeMinutes`: integer, estimated preparation time (default: 15).

### 4. Order & Billing
- `items`: non-empty array of objects: `{ foodId: ObjectId, quantity: integer (1-50) }`.
- `pickupType`: enum `['IMMEDIATE', 'SCHEDULED']`.
- `pickupAt`: ISO 8601 string, validated within operational cafe hours (06:00 to 22:30 Asia/Kolkata).
- `notes`: optional string, maximum 150 characters (as indicated in Checkout screen "87 / 150 chars").
- Subtotal: calculated on server from current database item prices.
- GST: 5% of subtotal (`subtotal * 0.05`).
- Packaging Charge: Flat ₹15.00 for takeaway tiffin parcels.
- Total Amount: `subtotal + gst + packagingCharge`.

### 5. Order State Machine
Permitted status transitions:
- `PLACED` -> `CONFIRMED`
- `CONFIRMED` -> `PREPARING`
- `PREPARING` -> `READY`
- `READY` -> `COMPLETED`
- `PLACED` -> `CANCELLED` (Customer or Admin)
- Any other transition is rejected with `400 Bad Request`.
