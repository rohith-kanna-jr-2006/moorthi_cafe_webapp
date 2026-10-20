# Hotel New Moorthi Cafe — Owner Decisions Log

**Last Updated**: 2026-10-17 (Reconciled under Phase R2.1)  
**Status Rule**: All items are marked as **PENDING** until formal owner confirmation is received. Where implementation is required for MVP functionality, an explicit **MVP Fallback** has been implemented and kept configurable via environment variables or database seeds without inventing unapproved business facts.

---

## Decision Matrix Summary

| # | Item | Status | MVP Fallback / Current Implementation | Impacted Modules |
|---|------|--------|---------------------------------------|-------------------|
| 1 | Official Restaurant Info | 🟡 PENDING | Name: Hotel New Moorthi Cafe, Chidambaram. Hours: 06:00 - 22:30 IST. Address/Phone placeholder. | Frontend branding, Footer, Contact page |
| 2 | Real Menu & Pricing | 🟡 PENDING | 6 illustrative South Indian tiffin items in seed script (`price` in INR: Dosa ₹160, Vada ₹80, Thali ₹220, Coffee ₹45). Real items & prices unconfirmed. | `Food` model, Menu page, Admin menu |
| 3 | GST Rate & Tax Calculation | 🟡 PENDING | Standard composition rate: **5% GST** computed server-side on food subtotal (`subtotal * 0.05`). Configurable via `GST_PERCENTAGE`. | `orderService`, Bill validation, Cart |
| 4 | Packaging Charge | 🟡 PENDING | Flat takeaway parcel charge: **₹15.00** applied once per pickup order. Configurable via `PACKAGING_CHARGE`. | `orderService`, Cart bill summary |
| 5 | Payment Methods for MVP | 🟡 PENDING | **Pay at Counter (Counter Cash / UPI / Card)**. Online payment gateway is dormant/unapproved for MVP. | Order checkout, Admin order settlement |
| 6 | Pickup-Only Scope | 🟡 PENDING | **Counter Pickup Only**. Orders are ready for collection within 15–30 mins. Scheduled pickup is dormant/disabled in MVP UI. | Order creation, checkout flow |
| 7 | Preparation Time Policy | 🟡 PENDING | Default estimated preparation time: **15 minutes** (`MIN_PREPARATION_MINUTES=15`). | Order status, pickup estimate |
| 8 | Cancellation & Refund Rules | 🟡 PENDING | Cancellation allowed by customer **only while order status is `PLACED`**. Once `CONFIRMED` or `PREPARING`, requires staff intervention. | `orderController`, Admin order management |
| 9 | Staff/Admin Roles & Accounts | 🟡 PENDING | Pre-seeded administrator account (`admin@moorthicafe.com`). Two roles enforced: `customer` and `admin`. | `User` model, RBAC middleware |
| 10 | Public Token Tracking | 🟡 PENDING | Order lookup requires authentication (`GET /orders/:id`). Public token board does not reveal customer PII. | Order tracking, Token display |
| 11 | Notifications for MVP | 🟡 PENDING | In-app status polling and on-screen live token display. External SMS/WhatsApp omitted from MVP. | Order confirmation screen |
| 12 | Google Sign-In & Menu Editing | 🟡 PENDING | Excluded from MVP. Authentication via email/phone + password. Full admin CRUD for menu items provided. | Auth screens, Admin menu management |
| 13 | Hosting / Domain / Accounts | 🟡 PENDING | Local development on `localhost:5000` (API) & `localhost:9003` (Frontend Webpack). Cloud hosting on hold for owner credentials. | Deployment config, DNS, SSL |
| 14 | Customer Data Retention | 🟡 PENDING | Minimal customer data stored (Name, Email, Phone, Order History). Passwords hashed using bcrypt (10 rounds). | User model, privacy compliance |

---

## Detailed Decision Records

### 1. Official Restaurant Information
- **Status**: 🟡 PENDING
- **Owner Input Required**: Legal entity name, official logo asset, exact postal address in Chidambaram, primary contact phone number, Google Maps embed link, and business operating hours.
- **MVP Technical Assumption**:
  - Name: `Hotel New Moorthi Cafe`
  - Address: `Chidambaram, Cuddalore District, Tamil Nadu 608001`
  - Operating Hours: `06:00 AM – 10:30 PM IST` (`BUSINESS_OPEN_TIME=06:00`, `BUSINESS_CLOSE_TIME=22:30`)
  - Timezone: `Asia/Kolkata`

### 2. Real Menu, Categories, Portions, and Prices
- **Status**: 🟡 PENDING
- **Owner Input Required**: Complete menu spreadsheet with exact item names (Tamil/English), categories, descriptions, piece/portion sizes, dish photos, dietary flags (Veg/Non-veg/Vegan), and current selling prices.
- **MVP Technical Assumption**:
  - Sample authentic South Indian items seeded in INR numbers (e.g., Golden Ghee Roast Masala Dosa ₹160.00, Medu Vada ₹80.00, Podi Thatte Idli ₹110.00, South Indian Heritage Thali ₹220.00, Kumbakonam Degree Kaapi ₹45.00, Elaneer Payasam ₹95.00).
  - All seed records are illustrative test data only; owner must supply verified production menu.

### 3. GST Rate and Calculation Method
- **Status**: 🟡 PENDING
- **Owner Input Required**: GST registration status (GSTIN), applicable GST rate (5% without ITC or 18%), and whether menu prices are tax-inclusive or tax-exclusive.
- **MVP Technical Assumption**:
  - Tax-exclusive calculation at **5% GST** on items subtotal (`Math.round(subtotal * (env.gstPercentage / 100) * 100) / 100`).
  - Configurable via `GST_PERCENTAGE=5` in `.env`.

### 4. Packaging Charges
- **Status**: 🟡 PENDING
- **Owner Input Required**: Fixed packaging charge per item vs per order, or waived above certain order amounts.
- **MVP Technical Assumption**:
  - Flat packaging charge of **₹15.00** per pickup order.
  - Configurable via `PACKAGING_CHARGE=15` in `.env`.

### 5. Payment Methods for MVP
- **Status**: 🟡 PENDING
- **Owner Input Required**: Selection of payment gateway (Razorpay / Cashfree / Paytm) or counter payment.
- **MVP Technical Assumption**:
  - **Pay at Counter (Counter Cash / UPI / Card)**. Payment status initialized to `PENDING` and marked `PAID` by staff upon pickup token presentation.
  - Allowed backend methods: `COUNTER_CASH`, `UPI`, `CARD`. Online gateway integrations are dormant/unsupported for MVP.

### 6. Pickup Policy and Scheduling
- **Status**: 🟡 PENDING
- **Owner Input Required**: Whether advance scheduling (e.g., ordering for 3 hours later or next day) is permitted.
- **MVP Technical Assumption**:
  - Immediate counter pickup only. Scheduled pickup is dormant in backend schema and disabled in customer UI.

### 7. Preparation Time Policy
- **Status**: 🟡 PENDING
- **Owner Input Required**: Standard preparation SLA and buffer time during peak meal rushes.
- **MVP Technical Assumption**:
  - Standard preparation estimate of **15 minutes** (`MIN_PREPARATION_MINUTES=15`).

### 8. Cancellation and Refund Policy
- **Status**: 🟡 PENDING
- **Owner Input Required**: Conditions under which a customer or restaurant can cancel an order.
- **MVP Technical Assumption**:
  - Customer can cancel via `POST /api/v1/orders/:id/cancel` strictly while order status is `PLACED`.
  - Once status changes to `CONFIRMED` or `PREPARING`, customer cannot self-cancel; staff must handle it.

### 9. Staff and Admin Roles
- **Status**: 🟡 PENDING
- **Owner Input Required**: Staff roster, administrative emails, and separate counter vs manager permission levels.
- **MVP Technical Assumption**:
  - Single `admin` role with access to dashboard metrics, order status updates, and menu item toggling.
  - Standard customer accounts have `customer` role.

### 10. Public Pickup Token Tracking
- **Status**: 🟡 PENDING
- **Owner Input Required**: Can customers track orders without logging in, or is a TV/counter display board required?
- **MVP Technical Assumption**:
  - Customer order details require authentication (`GET /api/v1/orders/:id`).
  - Daily pickup token (e.g., `HNMC-20261017-0001`, token `#1`) is displayed prominently on confirmation and order history screens.

### 11. Customer Notifications
- **Status**: 🟡 PENDING
- **Owner Input Required**: Integration with SMS gateway (Fast2SMS / Twilio) or WhatsApp Business API.
- **MVP Technical Assumption**:
  - In-app status polling and on-screen live updates. External SMS/WhatsApp omitted from MVP.

### 12. Google Sign-In & External Identity
- **Status**: 🟡 PENDING
- **Owner Input Required**: Requirement for OAuth 2.0 (Google/Apple) login.
- **MVP Technical Assumption**:
  - Traditional email/phone + password authentication only. Google Sign-In excluded for MVP simplicity.

### 13. Production Hosting and Domain Setup
- **Status**: 🟡 PENDING
- **Owner Input Required**: Domain name (`moorthicafe.com`), cloud hosting accounts (Vercel, Render, AWS, MongoDB Atlas), and monthly infrastructure budget.
- **MVP Technical Assumption**:
  - Backend runs locally on port 5000; Frontend on port 9003 (`webpack.cjs`).
  - Production deployment targets ready for Docker, Render/Railway, and Vercel/Netlify.

### 14. Customer Privacy and Data Retention
- **Status**: 🟡 PENDING
- **Owner Input Required**: Data retention period for completed orders and inactive customer profiles.
- **MVP Technical Assumption**:
  - Store customer order history securely. Customer passwords hashed with salted bcrypt. PII restricted to authenticated user and admins.
