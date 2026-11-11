# Software Testing Life Cycle (STLC) — Requirement Analysis
## Project: Hotel New Moorthi Cafe Web Application

### 1. Executive Summary
Hotel New Moorthi Cafe is an authentic South Indian dining and takeaway web application celebrating heritage tiffin, stone-ground batters, pure desi ghee dishes, and Kumbakonam degree filter kaapi. The system provides a seamless digital storefront for customers in Chidambaram to browse menus, manage dining trays, execute secure counter-pickup checkouts, track live kitchen preparation tokens, and access administrative dashboard and order management consoles.

### 2. Stakeholders & User Roles
- **Customer / Diner:** Browses menus, registers/logs in, manages dining tray items with custom variants and kitchen notes, selects takeaway pickup times and counter payment methods, places orders, receives daily sequential pickup tokens, tracks order status in real time, and manages account profile and order history.
- **Counter Cashier / Operations Manager (Admin):** Authenticates securely into the admin console, monitors real-time revenue, payment splits (UPI vs Cash), order volume breakdowns, daily token ranges, kitchen equipment load, active alerts, and manages customer order lifecycle transitions (Placed -> Confirmed -> Preparing -> Ready -> Completed / Cancelled).
- **Kitchen Staff:** Views incoming live orders, updates preparation stages, and monitors tawa griddle, steamer, and coffee urn capacities.

### 3. Functional Requirements Breakdown

#### A. Customer Authentication & User Management
- **Signup (`/signup`):** Requires Full Name, Email Address, 10-digit Mobile Phone Number, and Password (minimum 8 characters). Validates inputs against backend contracts and stores JWT authentication token (`moorthi_token`) and user profile (`moorthi_user`) upon success.
- **Sign In (`/login`):** Supports authentication via registered email or mobile number with password. Automatically routes customers to their dashboard (`/dashboard`) or admins to the admin console (`/admin/dashboard`) based on role attributes.
- **Password Recovery (`/forgot-password`):** Allows identifier input to simulate OTP dispatch and recovery verification.
- **Customer Profile (`/profile`) & Dashboard (`/dashboard`):** Displays account credentials, membership duration, active in-flight takeaway orders, and lifetime order history.

#### B. Menu, Categories & Item Exploration
- **Menu (`/menu`):** Fetches categories and food items from the backend API (`http://localhost:5000/api/v1/foods` and `/categories`). Includes fallback curated heritage dishes (e.g., Golden Ghee Roast Masala Dosa, Podi Thatte Idli, Kumbakonam Degree Filter Kaapi, Chettinad Pepper Chicken, South Indian Heritage Thali) when the database is offline.
- **Filters & Search:** Real-time search query matching dish names, Tamil names, and descriptions. Dietary toggle for "Pure Vegetarian Only" (`isVeg`). Category filter pills (Morning Tiffin, Lunch Thalis & Meals, Evening Snacks, Beverages, Non-Veg, Seafood).
- **Item Details (`/item-details?id=...`):** High-resolution media presentation, dietary indicators, pricing in Indian Rupees (₹), portion descriptions, variant selectors (e.g., bone vs boneless, portion sizes), quantity steppers, and direct tray addition.

#### C. Dining Tray / Cart & Checkout Workflow
- **Cart (`/cart`):** Persistent local storage cart (`moorthi_cafe_cart`) with real-time badge updates in the navigation bar. Supports item quantity increment/decrement, item removal, tray clearing, and special cooking instructions / kitchen notes input.
- **Checkout (`/checkout`):**
  - Customer information pre-fill from authenticated user profile.
  - Takeaway pickup time selection (Immediate collection in 15–20 minutes).
  - Counter Payment Method selection: UPI / QR Code scan, Cash at Counter, Card Swipe / Tap at point of pickup.
  - Bill summary calculation: Item Subtotal, Statutory GST (5%), and Takeaway Parcel Packaging charge (flat ₹15), resulting in an authoritative final payable amount in Indian Rupees (₹).
  - Secure order placement using `Idempotency-Key` headers and JWT authorization. Clears cart upon successful creation.

#### D. Order Success & Tracking
- **Order Success (`/order-success?orderId=...`):** Displays confirmation badge, authoritative Daily Pickup Token Number (e.g., Token #42), Order ID (HNMC-...), estimated pickup window, line item breakdown, payment method, and navigation to live tracking.
- **My Orders (`/my-orders`):** Lists all historical and active takeaway orders with status pills (Placed, Confirmed, Preparing, Ready, Completed, Cancelled). Supports customer-initiated cancellation for orders in `PLACED` status.

#### E. Admin Console & Kitchen Display System (KDS)
- **Admin Authentication (`/admin/login`):** Secure login restricted to users with `role: 'admin'`.
- **Admin Dashboard (`/admin/dashboard`):** Real-time metrics including total revenue, UPI vs Cash split, order volume breakdown, daily token range, average preparation time, station notes, inventory alerts, quick actions, top-selling dishes, and kitchen equipment load (Tawa Griddle, Idli Steamers, Coffee Decoction Urn).
- **Order Management (`/admin/order-management`):** Filter orders by status tabs (`ALL`, `PLACED`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`) and search by token number, order ID, or customer name/phone. Perform real-time status updates (`PATCH /admin/orders/:id/status`).

### 4. Non-Functional Requirements & Technical Constraints
- **Architecture:** React + Webpack + JavaScript (Strictly no TypeScript, .ts, .tsx, Vite, or Angular).
- **API Base URL:** `http://localhost:5000/api/v1` with Bearer token authorization.
- **Currency:** Strictly Indian Rupees (₹) with proper decimal formatting (`.toFixed(2)`).
- **Responsiveness & UX:** Fully responsive layout across viewports from mobile (320px width) to desktop (1366px+), ensuring zero horizontal overflow, cohesive warm terracotta and forest green color palette, and accessible typography.
- **Security:** Zero credential exposure, robust error handling, session management, and idempotent checkout execution.