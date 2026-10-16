# Hotel New Moorthi Cafe — React Frontend Integration Guide

**Audience**: Rohith, Ravi, and Frontend Team Members  
**Backend Base URL**: `http://localhost:5000/api/v1`  
**Authentication**: Bearer Token in `Authorization: Bearer <token>`  
**Design Theme**: Heritage Culinary Warmth (Terracotta `#C05621`, Banana Leaf `#2F855A`, Turmeric Gold `#D69E2E`, Warm Ivory `#FAF5EF`)

---

## 1. Quick Integration Architecture

```
React (Vite / localhost:5173)
  ├── 1. AuthContext: Holds { user, token, isAuthenticated, login(), logout() }
  ├── 2. CartContext: Stores [{ foodId, name, price, quantity }] in localStorage
  ├── 3. API Client: Axios or fetch wrapper with baseURL and Auth header interceptor
  └── 4. Stitch Components: Customer Signup, Login, Menu, Cart, Checkout, Order Success, Admin Dash
```

---

## 2. Screen-by-Screen Integration Details

### A. Customer Signup Screen
- **Stitch ID**: `84141f83649c42afa6b60185ee379f79`
- **React Action**: Form submission (`onSubmit`)
- **API**: `POST /api/v1/auth/signup`
- **Payload**:
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: fullName,
    email: emailAddress,
    phone: mobileNumber,
    password: password,
  }),
});
const data = await response.json();
if (data.success) {
  localStorage.setItem('moorthi_token', data.data.token);
  // Navigate to /menu or /dashboard
} else {
  alert(data.message);
}
```

### B. Customer Login Screen
- **Stitch ID**: `5412afd34d8f4c15b996208b2ebad869`
- **React Action**: Form submission
- **API**: `POST /api/v1/auth/login`
- **Payload**:
```javascript
// Accepts either email or registered 10-digit mobile number!
const payload = {
  identifier: emailOrPhoneInput,
  password: secretPasscode,
};
```

### C. Food Menu & Category Pills Screen
- **Stitch ID**: `cf66aef7191e4462bdd7efda2dceedca`
- **React Action**: Component Mount (`useEffect`) + Category Filter Click
- **APIs**:
  1. `GET /api/v1/categories`: Render sticky category chips.
  2. `GET /api/v1/foods?category=${activeCategorySlug}&search=${query}`: Render food cards.
- **Display Fields**:
  - `food.name`: Dish title.
  - `food.price`: Tabular bold price (`₹${food.price}`).
  - `food.portion`: Portion badge (e.g. "2 Pcs", "Single Cone").
  - `food.prepTimeMinutes`: Preparation time pill (e.g. "Ready in ~8 mins").
  - `food.tags`: Tags like `chef-special` or `pure-ghee`.

### D. Shopping Cart & Billing Screen
- **Stitch ID**: `e8a389669bee43dfbb441c60f330a49a`
- **React Action**: Quantity change (`+` / `-`) or page view
- **API**: `POST /api/v1/orders/preview`
- **Payload**:
```javascript
const payload = {
  items: cartItems.map((item) => ({
    foodId: item.foodId,
    quantity: item.quantity,
  })),
};
```
- **Response Mapping**:
  - `data.subtotal`: Item Subtotal.
  - `data.gst`: GST (5% Food Services).
  - `data.packagingCharge`: Eco-friendly Plantain Leaf Packing (Flat ₹15.00).
  - `data.totalAmount`: Total Amount Payable.

### E. Checkout Screen
- **Stitch ID**: `6f8b6285b2904e4f8f0684de516fae24`
- **React Action**: "Proceed to Payment / Place Order" button click
- **API**: `POST /api/v1/orders`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Idempotency-Key: ${uuidv4()}` (Crucial: prevents duplicate orders on accidental double click)
- **Payload**:
```javascript
const orderPayload = {
  items: cartItems.map((item) => ({
    foodId: item.foodId,
    quantity: item.quantity,
  })),
  pickupType: isImmediate ? 'IMMEDIATE' : 'SCHEDULED',
  pickupAt: isImmediate ? undefined : scheduledDate.toISOString(),
  notes: specialKitchenInstructions, // max 150 chars
  paymentMethod: selectedPaymentMethod, // "UPI" | "COUNTER_CASH" | "CARD"
};
```

### F. Order Success Screen
- **Stitch ID**: `3e277b1e1de34752b8d4801603e5d45b`
- **React Action**: Render response data from `POST /orders` or fetch `GET /api/v1/orders/:id`
- **Display Fields**:
  - `order.dailyTokenNumber`: Big badge -> `TOKEN #${order.dailyTokenNumber}`
  - `order.orderId`: Order Reference code -> `#${order.orderId}` (e.g. `#HNMC-20261016-0042`)
  - `order.pickupStation`: "Chidambaram Central Dining Hall - Express Parcel Counter 2"
  - `order.pickupAt`: Estimated ready time.
  - Barcode label: `TOKEN-${order.dailyTokenNumber}-HNMC`

### G. Admin Operations & Kitchen Queue
- **Stitch IDs**: `3c35b1470df44029a6007025731266dd` & `b819332163154004a140b7bc72cf653a`
- **APIs**:
  - `GET /api/v1/admin/dashboard`: Metrics cards (`todayRevenue`, `activeTokensQueue`, `statusCounts`).
  - `GET /api/v1/admin/orders?status=all`: Orders table with diner name and phone.
  - `PATCH /api/v1/admin/orders/:id/status`: When kitchen moves order from `PREPARING` to `READY` to `COMPLETED`.

---

## 3. Critical Rules for Frontend Teammates

1. **Never Calculate Final Total on Frontend**:
   - The server is authoritative for dish prices, GST, and packaging charges.
   - Always call `/api/v1/orders/preview` or use the server's returned `totalAmount`.
2. **Do Not Generate Token Numbers on Frontend**:
   - The server automatically calculates sequential daily tokens restarting at 1 for each calendar day in Asia/Kolkata.
3. **Handle 401 Gracefully**:
   - If an API returns `401 Unauthorized`, clear `localStorage.removeItem('moorthi_token')` and prompt the diner to sign in again.
4. **Idempotency**:
   - When submitting orders, generate a UUID or timestamp string in `Idempotency-Key` header so rapid clicks never create twin orders.
