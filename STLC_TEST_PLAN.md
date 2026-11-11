# Software Testing Life Cycle (STLC) — Test Plan
## Project: Hotel New Moorthi Cafe Web Application

### 1. Test Objectives & Scope
This test plan defines the testing strategy, test suites, execution environment, and verification protocols for the Hotel New Moorthi Cafe web application. The objective is to validate all functional workflows, API contracts, UI rendering, responsive behavior, and administrative control systems against project specifications and quality constraints.

### 2. Test Environment & Tools
- **Frontend Development Server:** Webpack Dev Server running at `http://localhost:9003/` (or `9004`).
- **Backend API Server:** Express / MongoDB backend running at `http://localhost:5000/api/v1`.
- **Browser Automation & E2E Testing Framework:** Playwright (`@playwright/test`) configured in `package.json` with test suites under `tests/e2e/`.
- **Supported Viewports for Responsive Testing:** 320x700 (Mobile), 375x812 (iPhone), 390x844 (Modern Smartphone), 1366x768 (Desktop).

### 3. Test Suites & Coverage

#### A. Route Rendering & Smoke Test Suite (`tests/e2e/routes.spec.js`)
- **Objective:** Verify all customer and admin routes return HTTP 200 status codes and render correct page titles containing "Hotel New Moorthi Cafe".
- **Covered Routes:**
  - `/` (Home)
  - `/about` (About Us)
  - `/menu` (Food Menu)
  - `/gallery` (Gallery)
  - `/contact` (Contact & Inquiries)
  - `/login` (Customer Login)
  - `/signup` (Customer Signup)
  - `/admin/login` (Admin Console Login)
- **Navbar Verification:** Ensures the navigation bar renders all required navigation items and active dining tray counter.

#### B. Home Page & Hero Test Suite (`tests/e2e/home.spec.js`)
- **Objective:** Verify successful home page loading, visibility of hero section, featured tiffin delicacies grid, heritage philosophy pillars, and quick add-to-tray functionality with toast notifications.

#### C. Authentication & Form Validation Test Suite (`tests/e2e/auth.spec.js`)
- **Objective:** Validate client-side and server-side form validation rules and authentication flows.
- **Test Cases:**
  - Login form requires identifier and password fields.
  - Login form displays error banner on invalid credentials.
  - Signup form requires name, email, phone, and password fields.
  - Navigation links between login and signup pages function correctly.

#### D. Responsive Layout & Overflow Test Suite (`tests/e2e/responsive.spec.js`)
- **Objective:** Ensure no horizontal overflow (`scrollWidth > window.innerWidth`) occurs across mobile, tablet, and desktop viewports.
- **Tested Viewports:** 320px, 375px, 390px, and 1366px width.

#### E. End-to-End Ordering & Kitchen Workflow (Manual & Automated Integration Protocol)
1. **Catalog Browsing:** Navigate to `/menu`, filter by category (e.g., Morning Tiffin), apply "Pure Vegetarian Only" filter, and search for specific dishes.
2. **Item Customization:** Select "Golden Ghee Roast Masala Dosa", choose portion variant, adjust quantity via stepper, and add to dining tray.
3. **Tray Management:** Navigate to `/cart`, verify item subtotals, GST (5%), and packaging charge (₹15), enter special kitchen notes, and proceed to checkout.
4. **Checkout & Payment:** Enter/confirm customer contact details, select immediate pickup, choose counter payment method (UPI QR, Cash, Card), and place order.
5. **Token Generation:** Verify redirect to `/order-success` showing generated Daily Pickup Token Number (e.g., Token #42) and Order ID.
6. **Order Tracking:** Navigate to `/my-orders` or `/dashboard` to monitor status and test order cancellation for `PLACED` orders.
7. **Admin Operations:** Log in at `/admin/login` using admin credentials, navigate to `/admin/order-management`, filter by status tabs, search orders, and execute real-time status transitions (Placed -> Confirmed -> Preparing -> Ready -> Completed).

### 4. Defect Reporting & Verification Protocol
- **Execution Command:** Run `npm test` or `npx playwright test` via local shell.
- **Verification Rule:** Every code change must be validated against available tests and `git diff --check`. No completion claim shall be made without actual verification.
- **Reporting:** Document commands run, test pass/fail outcomes, modified files, and any environmental blockers.