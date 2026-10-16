# Hotel New Moorthi Cafe — Repository & Environment Audit (Phase 1)

**Date**: 2026-10-15  
**Auditor**: Backend & Database Engineering Team (Lead: Ragul S)  
**Workspace**: `D:\Project\moorthy cafe`  
**Backend Root**: `D:\Project\moorthy cafe\backend`  

---

## 1. Executive Summary

An audit of the local filesystem, Git repository, runtime environment, Dockerized MongoDB, and connected Google Stitch screens has been completed.
- Git repository is located at `D:\Project\moorthy cafe`, currently on branch `feature/backend-api`.
- The backend application is located in `D:\Project\moorthy cafe\backend`.
- Node.js (`v22.19.0`) and npm (`10.9.3`) are installed and verified.
- MongoDB 8 is running inside Docker container `moorthi-mongodb` bound to `127.0.0.1:27017` and was verified through an active Mongoose connection.
- Google Stitch project `10226317095148879480` and all 9 target screens were successfully inspected in **read-only** mode via Stitch MCP.

---

## 2. Git & Repository Status

| Attribute | State | Notes |
| :--- | :--- | :--- |
| **Git Root** | `D:\Project\moorthy cafe` | Single Git root encompassing `backend/` and `postman/` |
| **Current Branch** | `feature/backend-api` | Correct isolated branch for backend development |
| **Remote Origin** | `https://github.com/rohith-kanna-jr-2006/moorthi_cafe_webapp.git` | Clean tracking setup |
| **Uncommitted Frontend Work** | None present in this directory | Teammates have unpushed local copies. Safety rule strictly enforced: no frontend edits or deletions. |
| **Tracked Files** | `README.md` | Initial repository README |
| **Untracked Directories** | `backend/`, `postman/`, `.postman/` | Created by user/team for backend implementation |
| **Ignored Patterns** | `backend/.gitignore` properly ignores `node_modules/`, `.env`, `.env.*` | Verified: `git status -u` does not track `backend/node_modules/` |

---

## 3. Environment & Runtime Readiness

1. **Node.js**: `v22.19.0` (Supported LTS)
2. **npm**: `10.9.3`
3. **MongoDB**:
   - Container Name: `moorthi-mongodb` (Image: `mongo:8`)
   - Port Mapping: `0.0.0.0:27017->27017/tcp`
   - Connection String: `mongodb://127.0.0.1:27017/moorthi_cafe`
   - Connectivity Test: Verified with `mongoose.connect()`. Exited 0 with `MONGO_CONNECTED`.
4. **Dependencies (`package.json`)**:
   - `express`: `^5.3.0`
   - `mongoose`: `^9.11.2`
   - `jsonwebtoken`: `^9.0.3`
   - `bcryptjs`: `^3.0.3`
   - `dotenv`: `^18.0.8`
   - `cors`: `^2.8.6`
   - `helmet`: `^8.3.0`
   - `express-rate-limit`: `^8.7.1`
   - `nodemon`: `^3.1.14` (devDependency)

---

## 4. Existing Files Inventory

### A. Reusable Existing Files
- `backend/package.json`: Contains approved dependencies and scripts (`start`, `dev`).
- `backend/package-lock.json`: Lockfile already resolved.
- `backend/.gitignore`: Proper node_modules and .env ignores.
- `backend/.env.example`: Provides baseline configuration keys.

### B. Existing Skeleton Files (0 Bytes — Needs Implementation)
- `backend/src/app.js` (0 bytes)
- `backend/src/server.js` (0 bytes)
- `backend/src/config/db.js` (0 bytes)

---

## 5. Google Stitch Read-Only Screen Inspection Results

Project: `10226317095148879480` (*Hotel New Moorthi Website*)

| Screen Name | Screen ID | MCP Inspection Status | Key Extracted Requirements |
| :--- | :--- | :--- | :--- |
| **Customer Signup** | `84141f83649c42afa6b60185ee379f79` | **SUCCESS (Inspected)** | Fields: Full Name (`name`), Email (`email`), Mobile (`phone`), Password (`password`). Default role: `customer`. |
| **Customer Login** | `5412afd34d8f4c15b996208b2ebad869` | **SUCCESS (Inspected)** | Fields: Email or Mobile identifier + Secret Passcode (`password`). Support both email & mobile login. |
| **Customer Dashboard** | `cacfd69d2e9547a0bb6d4068868da989` | **SUCCESS (Inspected)** | Categories tabs (Breakfast Tiffin, Lunch Thalis, Evening Snacks, Degree Kaapi, Festive Sweets, Podis & Pickles), quick search, specials. |
| **Food Menu** | `cf66aef7191e4462bdd7efda2dceedca` | **SUCCESS (Inspected)** | Category filters, dietary tags (Pure Veg), price in INR, availability badge, prep times. |
| **Shopping Cart** | `e8a389669bee43dfbb441c60f330a49a` | **SUCCESS (Inspected)** | Item qty steppers, special kitchen notes per item / overall, bill breakdown (Subtotal, GST 5%, Eco-packaging ₹15), grand total. |
| **Checkout** | `6f8b6285b2904e4f8f0684de516fae24` | **SUCCESS (Inspected)** | Pickup timing radio: Immediate (~15-20 min) vs Schedule for Later (Time slots e.g. 5:30 PM - 6:00 PM), notes (max 150 chars), counter selection (East Car St, Gate #2). |
| **Order Success** | `3e277b1e1de34752b8d4801603e5d45b` | **SUCCESS (Inspected)** | Order Reference (e.g. `#HNMC-9824`), Daily Token (e.g. `TOKEN #42`), Estimated pickup ready time, barcode identifier. |
| **Order Management** | `b819332163154004a140b7bc72cf653a` | **SUCCESS (Inspected)** | Status tabs: All, Preparing, Ready for Pickup, Completed, Cancelled. Order card displays Token #, Customer name, phone, items snapshot, payment info, call token / print KOT action. |
| **Admin Dashboard** | `3c35b1470df44029a6007025731266dd` | **SUCCESS (Inspected)** | Top metrics: Today's Revenue (UPI vs Cash), Today's Orders count, Active Tokens Queue, Stock & Batters alert; Recent orders table. |

---

## 6. Integration Risks & Business Questions for Team Lead (Ragul S)

1. **GST and Packaging Charge**:
   - The UI displays **5% GST** on food services and an **Eco-friendly Leaf Packaging charge of ₹15.00**.
   - *Recommendation*: Calculate item subtotal from DB prices, apply 5% GST, and add ₹15 packaging fee on takeaway orders.
2. **Order Identifier Format**:
   - Stitch UI displays `#HNMC-9824` / `#MC-9048`.
   - *Recommendation*: Standardise on `HNMC-YYYYMMDD-XXXX` (e.g., `HNMC-20261015-0042`) or compact `HNMC-<counter>`.
3. **Daily Token Reset Policy**:
   - Tokens start at 1 each day at 00:00 Asia/Kolkata timezone (`TOKEN #1`, `TOKEN #2`, etc.).
   - *Recommendation*: Use `DailyCounter` with an atomic `$inc` operation on compound key `businessDate` (`YYYY-MM-DD` Asia/Kolkata) + `counterType` (`token`).
4. **Login Identifier**:
   - UI input is labelled "Email Address or Registered Mobile".
   - *Recommendation*: The login controller will accept an `email` or `identifier` field, matching either `email` (lowercased) or `phone`.

---

## 7. Audit Verdict

Environment is **100% READY** for safe, additive implementation of Phase 2 (Backend Foundation) through Phase 7 (Admin & Reports).
No destructive changes to existing files or frontend work are required.
