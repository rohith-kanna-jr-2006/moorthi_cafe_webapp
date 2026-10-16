# Hotel New Moorthi Cafe — Postman Testing Guide

This guide details how to import and execute the API test collection against your local development server.

---

## 1. Import Collection & Environment

1. Open **Postman** (Desktop App or Web).
2. Click **Import** (top left).
3. Select the two files located in your repository:
   - Collection: [`backend/postman/MoorthiCafe.postman_collection.json`](file:///d:/Project/moorthy%20cafe/backend/postman/MoorthiCafe.postman_collection.json)
   - Environment: [`backend/postman/MoorthiCafe.local.postman_environment.json`](file:///d:/Project/moorthy%20cafe/backend/postman/MoorthiCafe.local.postman_environment.json)
4. In Postman, switch the active environment dropdown (top right) to **"Hotel New Moorthi Cafe (Local)"**.

---

## 2. Environment Variables Quick Reference

| Variable | Initial Value | Auto-Populated By |
| :--- | :--- | :--- |
| `baseUrl` | `http://localhost:5000/api/v1` | Pre-configured in environment |
| `customerToken` | `""` | Set automatically on Customer Signup or Customer Login |
| `adminToken` | `""` | Set automatically on Admin Login |
| `categoryId` | `""` | Set automatically by "List Active Categories" |
| `foodId` | `""` | Set automatically by "List Foods with Search & Filters" |
| `orderId` | `""` | Set automatically by "Submit Order" |

---

## 3. Recommended Sequential Test Execution

Execute the folders in this exact sequence for zero-setup end-to-end verification:

### Sequence 1: System Health
1. Run **"Health Check Diagnostic"**.
   - Expected status: `200 OK`
   - Confirms server is running and `database: "CONNECTED"`.

### Sequence 2: Authentication
2. Run **"1. Valid Customer Signup"**.
   - Generates a unique customer email, signs up, and automatically stores `customerToken`.
3. Run **"2. Duplicate Email Signup"**.
   - Attempts to re-register the seeded customer and asserts `409 Conflict`.
4. Run **"5. Admin Login"**.
   - Logs in with default credentials `admin@moorthicafe.com` / `AdminSecretPass123!` and automatically stores `adminToken`.
5. Run **"7. Get Current Profile"**.
   - Verifies Bearer authentication and returns customer identity.

### Sequence 3: Menu & Categories
6. Run **"1. List Active Categories"**.
   - Automatically grabs the first category ID into `{{categoryId}}`.
7. Run **"2. List Foods with Search & Filters"**.
   - Searches for "Dosa" and grabs the food item ID into `{{foodId}}`.
8. Run **"3. Admin Creates New Food Item"**.
   - Verifies Admin role can add items (`201 Created`).
9. Run **"4. Customer Cannot Create Food"**.
   - Asserts role enforcement returns `403 Forbidden`.

### Sequence 4: Orders & Cart
10. Run **"1. Preview Pricing Calculation"**.
    - Previews subtotal, 5% GST, and ₹15 eco-packaging fee.
11. Run **"2. Submit Order (Immediate Pickup)"**.
    - Allocates sequential daily token (`TOKEN #...`) and stores `{{orderId}}`.
12. Run **"3. Get Customer Order History"**.
    - Returns customer's active and past orders.
13. Run **"4. Cancel Order"**.
    - Asserts customer self-cancellation works while order is in `PLACED` status.

### Sequence 5: Admin Operations
14. Run **"1. Live Operations Dashboard"**.
    - Asserts revenue calculation and status breakdown match real transactions.
15. Run **"2. Kitchen Orders Management Table"**.
    - Lists active counter orders for kitchen display screens.
16. Run **"3. Daily Sales & Settlement Report"**.
    - Returns aggregated sales and best-selling dishes.
