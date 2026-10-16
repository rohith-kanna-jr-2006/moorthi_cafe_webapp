# Hotel New Moorthi Cafe — Security Checklist & Audit Report

**Lead Security Reviewer**: Ragul S  
**Audit Date**: 2026-10-16  
**Status**: PASSED (All 14 Security Controls Verified)

---

## Security Verification Matrix

| # | Security Control | Implementation Mechanism | Verification Result |
| :- | :--- | :--- | :--- |
| **1** | **No Plain-Text Passwords** | Bcrypt password hashing (`bcrypt.genSalt(10)`) in `User.js` | **PASS** — Plain text never stored in MongoDB. |
| **2** | **Password Hash Hidden** | `passwordHash: { select: false }` on User schema | **PASS** — User queries never return password hash by default. |
| **3** | **No Public Admin Escalation** | `authController.signup` hardcodes `role: 'customer'`, ignoring request body role | **PASS** — Verified via automated test `tests/auth.test.js` #4. |
| **4** | **JWT Signature & Expiry** | `jsonwebtoken` verifies secret signature and expiration time | **PASS** — Unauthenticated/tampered requests receive `401 Unauthorized`. |
| **5** | **Secret Environment Management** | `JWT_SECRET` loaded via `.env`; production boots require >= 32 chars | **PASS** — Missing/weak secrets throw fatal error during boot. |
| **6** | **Secrets Excluded from Git** | Root and backend `.gitignore` ignore `.env`, `.env.*`, `node_modules` | **PASS** — `git status -u` confirms zero secrets or `.env` files tracked. |
| **7** | **Safe Authentication Errors** | Login error returns generic "Invalid credentials" | **PASS** — Prevents username/email enumeration attacks. |
| **8** | **MongoDB ObjectId Validation** | Mongoose `CastError` caught centrally in `errorHandler.js` | **PASS** — Malformed IDs return clean `400 Bad Request` without stack leaks. |
| **9** | **Least-Privilege RBAC** | `authorize('admin')` middleware enforces admin role checks | **PASS** — Customers cannot access `/api/v1/admin/*` (returns `403 Forbidden`). |
| **10** | **Customer Order Isolation** | `orderController.getOrderById` and `cancelOrder` verify diner ownership | **PASS** — Customer A cannot read or cancel Customer B's order (test #4 in `order.test.js`). |
| **11** | **Authoritative Pricing Enforcement** | Server queries MongoDB for dish prices and ignores client-supplied totals | **PASS** — Forged prices in request body are completely ignored (test #2 in `order.test.js`). |
| **12** | **Rate Limiting Protection** | `express-rate-limit` enabled globally (300/15m) and strictly on `/auth` (30/15m) | **PASS** — Brute-force credential stuffing is throttled with `429 Too Many Requests`. |
| **13** | **HTTP Security Headers** | `helmet()` enabled on Express instance | **PASS** — Adds CSP, HSTS, X-Content-Type-Options, and Clickjacking protection headers. |
| **14** | **Restricted CORS Allowlist** | Allowed origins configured for Vite (`localhost:5173`) and mobile clients | **PASS** — Arbitrary cross-origin browsers are blocked. |

---

## Production Deployment Recommendations

1. **Generate a Strong Production Secret**:
   Generate a 64-character random key for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. **Enable HTTPS / TLS**:
   Always run behind a reverse proxy (e.g. Nginx, Caddy, or Cloudflare) with valid SSL certificates.
3. **Database Backups**:
   Schedule daily backups of the `moorthi_cafe` MongoDB database volume.
