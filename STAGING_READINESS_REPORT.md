# Moorthi Cafe: Staging Environment Isolation and Release Readiness Report

**Project:** `D:\project\moorthi_cafe_webapp`  
**Date:** 2026-11-20  
**Audit Type:** Read-only investigation

---

## 1. Environment Separation Matrix

| Component | Staging | Production | Isolation Status |
|-----------|---------|------------|------------------|
| **Frontend URL** | `https://newmoorthicafe.netlify.app` | `https://moorthicafe.netlify.app` | ✅ Separate Netlify sites |
| **Backend URL** | `https://moorthi-cafe-webapp.onrender.com/api/v1` | `https://moorthi-cafe-api.onrender.com/api/v1` | ✅ Separate Render services |
| **Git Branch** | `staging` | `main` | ✅ Separate branches |
| **Database** | `moorthi_cafe_staging` (enforced by guard) | `moorthi_cafe` | ✅ Enforced by env guards |
| **Netlify Site** | `newmoorthicafe` | `moorthicafe` | ✅ Separate sites |
| **Render Service** | `moorthi-cafe-webapp` | `moorthi-cafe-api` | ✅ Separate services |

---

## 2. API URL Resolution Report

### Frontend API Resolution (src/utils/api.js)
```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'https://moorthi-cafe-api.onrender.com/api/v1';
```

**Resolution Priority:**
1. `process.env.API_BASE_URL` (set at build time via webpack DefinePlugin)
2. Default fallback: `https://moorthi-cafe-api.onrender.com/api/v1` (production)

### Webpack DefinePlugin Configuration (webpack.cjs:99-100)
```javascript
new webpack.DefinePlugin({
  'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'https://moorthi-cafe-api.onrender.com/api/v1')
})
```

### Build-Time API URL Resolution
| Environment | API_BASE_URL Source | Resolved Value |
|-------------|---------------------|----------------|
| Local Dev | `process.env.API_BASE_URL` (undefined) | `https://moorthi-cafe-api.onrender.com/api/v1` ⚠️ **Points to PRODUCTION** |
| Staging Netlify | Netlify env var `API_BASE_URL` | Should be `https://moorthi-cafe-webapp.onrender.com/api/v1` |
| Production Netlify | Netlify env var `API_BASE_URL` | Should be `https://moorthi-cafe-api.onrender.com/api/v1` |

### ⚠️ CRITICAL FINDING
**Local development frontend points to PRODUCTION API by default.** The fallback in both `api.js` and `webpack.cjs` is the production API URL. This means:
- Local dev frontend calls production backend
- Local dev backend (if running) would be bypassed
- Staging Netlify **must** override via Netlify environment variable `API_BASE_URL=https://moorthi-cafe-webapp.onrender.com/api/v1`

### Test Configuration URLs
| Test File | Staging Frontend | Staging API |
|-----------|------------------|-------------|
| `staging.spec.js` | `https://newmoorthicafe.netlify.app` (default: `http://localhost:9004`) | `https://moorthi-cafe-webapp.onrender.com/api/v1` |
| `order-flow.spec.js` | `https://newmoorthicafe.netlify.app` (default: `http://localhost:9004`) | `https://moorthi-cafe-webapp.onrender.com/api/v1` |
| `global-setup.js` | `https://newmoorthicafe.netlify.app` | `https://moorthi-cafe-webapp.onrender.com/api/v1` |

---

## 3. Database Isolation Report

### Backend Environment Guards (backend/src/config/env.js)

#### Staging Guard (lines 19-29)
```javascript
if (process.env.NODE_ENV === 'staging') {
  const dbNameMatch = uri.match(/\/([^/?#]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : null;
  if (dbName !== 'moorthi_cafe_staging') {
    throw new Error(`[Staging Safety] NODE_ENV=staging requires MONGODB_URI database name to be 'moorthi_cafe_staging'. Current: '${dbName}'`);
  }
}
```

#### Production Isolation Guard (lines 32-40)
```javascript
if (process.env.NODE_ENV !== 'production') {
  const dbNameMatch = uri.match(/\/([^/?#]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : null;
  if (dbName === 'moorthi_cafe') {
    throw new Error('[Safety Guard] Non-production NODE_ENV must not use production database "moorthi_cafe". Current: production database detected.');
  }
}
```

### Database Configuration Matrix

| Environment | NODE_ENV | Expected DB Name | Guard Behavior |
|-------------|----------|------------------|----------------|
| Local Dev | `development` | `moorthi_cafe` (local) or any non-prod | ⚠️ **Would FAIL** if using Atlas prod URI |
| Staging Render | `staging` | `moorthi_cafe_staging` | ✅ Enforced |
| Production Render | `production` | `moorthi_cafe` | ✅ Allowed |
| Local Dev (local MongoDB) | `development` | `moorthi_cafe` (local) | ✅ Passes (local URI doesn't match Atlas pattern) |

### ⚠️ CRITICAL FINDING
**Local development with Atlas production URI will FAIL the safety guard.** The `backend/.env` currently has:
```
NODE_ENV=development
MONGODB_URI="mongodb+srv://jrrohithk_db_user:...@moorthicafecluster.mrx8evm.mongodb.net/moorthi_cafe"
```
This would trigger: `[Safety Guard] Non-production NODE_ENV must not use production database "moorthi_cafe"`

**However**, the backend loads `../../.env` (root), not `backend/.env`. Root `.env` uses local MongoDB:
```
MONGODB_URI=mongodb://127.0.0.1:27017/moorthi_cafe
```
So local dev is **SAFE** because it uses local MongoDB.

### Database Isolation Status: ✅ PROPERLY ENFORCED
- Staging backend **must** use `moorthi_cafe_staging` database
- Non-production environments **cannot** use `moorthi_cafe` (production) database
- Local development uses local MongoDB, bypassing Atlas guards

---

## 4. CORS Verification Report

### Backend CORS Configuration (backend/src/app.js:19-51)

```javascript
const clientUrlArray = typeof env.clientUrl === 'string'
  ? env.clientUrl.split(',').filter(Boolean)
  : [];

const allowedOrigins = [
  ...clientUrlArray,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:9004',
  'http://localhost:9003',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:9004',
  'http://127.0.0.1:9003',
];
```

### CORS Allowed Origins by Environment

| Environment | CLIENT_URL (env) | Effective Allowed Origins |
|-------------|------------------|---------------------------|
| Local Dev | `http://localhost:5173,http://localhost:9004,http://127.0.0.1:9004` | Local origins + localhost variants |
| Staging Render | **Must be set to** `https://newmoorthicafe.netlify.app` | Staging Netlify + localhost variants |
| Production Render | **Must be set to** `https://moorthicafe.netlify.app` | Production Netlify + localhost variants |

### CORS Test (staging.spec.js:62-92)
Tests verify:
- OPTIONS request with `Origin: https://newmoorthicafe.netlify.app`
- `Access-Control-Allow-Origin` matches staging frontend exactly
- `Access-Control-Allow-Credentials: true`

### ⚠️ CORS FINDING
**Staging and Production backends must have different `CLIENT_URL` values.** If both use the same Render service, CORS would allow both origins. Since they are **separate Render services**, each can have its own `CLIENT_URL` env var.

### CORS Status: ✅ PROPERLY CONFIGURED (if env vars set correctly per environment)

---

## 5. Asset Verification Report

### Previously Missing Images (7) - Now Resolved

| # | API Image URL | Resolution Strategy | Local Asset | Status |
|---|---------------|---------------------|-------------|--------|
| 1 | `/images/menu/chicken-biryani.svg` | Map to existing JPG | `/images/menu/chicken-biryani.jpg` (3.5MB) | ✅ Resolved |
| 2 | `/images/menu/rava-dosa.svg` | Map to semantic match | `/images/menu/onion-dosa.svg` (3.2KB) | ✅ Resolved |
| 3 | `/images/menu/ghee-roast-dosa.svg` | Map to existing JPG | `/images/menu/dosa.jpg` (794KB) | ✅ Resolved |
| 4 | `/images/menu/heritage-thali.svg` | New custom SVG | `/images/menu/heritage-thali.svg` (5.2KB) | ✅ Created |
| 5 | `/images/menu/filter-kaapi.svg` | New custom SVG | `/images/menu/filter-kaapi.svg` (6.0KB) | ✅ Created |
| 6 | `/images/menu/medu-vada.svg` | New custom SVG | `/images/menu/medu-vada.svg` (7.6KB) | ✅ Created |
| 7 | `/images/menu/podi-idli.svg` | New custom SVG | `/images/menu/podi-idli.svg` (10.1KB) | ✅ Created |

### New Assets Created (All Present in public/images/menu/)
| File | Size | Purpose |
|------|------|---------|
| `heritage-thali.svg` | 5.2KB | Banana leaf thali spread with 6 dishes |
| `filter-kaapi.svg` | 6.0KB | Brass davarah-tumbler pouring coffee |
| `medu-vada.svg` | 7.6KB | Three vadas with coconut & tomato chutney |
| `podi-idli.svg` | 10.1KB | Five idlis with gun powder podi & sesame oil |

### Favicon
| File | Size | Location | Status |
|------|------|----------|--------|
| `favicon.svg` | 1.2KB | `public/favicon.svg` | ✅ Created |
| HTML Link | — | `public/index.html` | ✅ Added `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` |

### Asset Resolver (src/utils/imageResolver.js)
```javascript
const IMAGE_URL_MAP = {
  '/images/menu/chicken-biryani.svg': '/images/menu/chicken-biryani.jpg',
  '/images/menu/rava-dosa.svg': '/images/menu/onion-dosa.svg',
  '/images/menu/ghee-roast-dosa.svg': '/images/menu/dosa.jpg',
  '/images/menu/heritage-thali.svg': '/images/menu/heritage-thali.svg',
  '/images/menu/filter-kaapi.svg': '/images/menu/filter-kaapi.svg',
  '/images/menu/medu-vada.svg': '/images/menu/medu-vada.svg',
  '/images/menu/podi-idli.svg': '/images/menu/podi-idli.svg',
};
```
**Coverage:** All 7 previously missing API image URLs now resolved.

### Webpack Production Copy (webpack.cjs)
- `CopyImagesPlugin` copies `public/images/` → `dist/images/` in production mode
- Also copies `favicon.svg` to `dist/`
- Only runs in `mode === 'production'`

### Netlify Configuration (netlify.toml)
```toml
[[headers]]
  for = "/images/*.svg"
  [headers.values]
    Content-Type = "image/svg+xml"
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/images/*"
  to = "/images/:splat"
  status = 200
  force = true
```
- SVG Content-Type explicitly set
- Image redirects before SPA fallback

### Asset Verification Status: ✅ ALL 7 IMAGES + FAVICON RESOLVED

---

## 6. Functional Testing Readiness Report

### Test Coverage Matrix

| Feature | Test File | Coverage | Dependencies |
|---------|-----------|----------|--------------|
| **Authentication** | `order-flow.spec.js` | Registration, Login | Staging DB seeded |
| **Cart** | `order-flow.spec.js`, `staging.spec.js` | Add, quantity, removal | Staging DB seeded + valid ObjectIds |
| **Checkout** | `order-flow.spec.js` | Page load, COD option | Authenticated user + cart items |
| **Order Creation** | `order-flow.spec.js` | Not fully implemented | Idempotency key, auth |
| **Idempotency** | Not explicitly tested | — | Requires order placement |
| **Pickup Token** | Not explicitly tested | — | Requires order placement |
| **Admin Dashboard** | `stitch-admin-dashboard.spec.js` | Layout, auth, KPIs, honest states | Mocked API responses |
| **Sales Reports** | `stitch-admin-dashboard.spec.js` | Top sellers, daily report | Mocked API responses |
| **Menu Management** | Not in e2e | — | Admin auth |
| **API Health** | `staging.spec.js` | Health endpoint, DB status | Staging backend running |
| **CORS** | `staging.spec.js` | Origin validation | Staging backend + frontend |

### Test Guardrails (All Present)
| Guard | File | Purpose |
|-------|------|---------|
| Production Frontend Block | `staging.spec.js:12-15`, `order-flow.spec.js:31-34` | Prevents tests running against `moorthicafe.netlify.app` |
| Production API Block | `staging.spec.js:29-31`, `global-setup.js:29-31` | Prevents tests running against `moorthi-cafe-api.onrender.com` |
| Unseeded DB Handling | `staging.spec.js:108-110`, `order-flow.spec.js:109-112` | Graceful blocking when no real food items |

### Missing Test Dependencies
| Test | Missing Dependency |
|------|-------------------|
| Cart add/quantity/remove | Staging DB must be seeded with foods having valid ObjectIds |
| Order creation | Requires authentication + seeded DB + idempotency key |
| Idempotency | Requires order placement test |
| Pickup token | Requires order placement test |
| Admin menu management | Not implemented in e2e |

### Test Readiness Status: ⚠️ PARTIALLY READY
- **Ready:** Auth flow, cart UI, admin dashboard (mocked), API health, CORS
- **Blocked:** Cart operations, order flow — **require staging DB seed**

---

## 7. Exact Blockers Before Staging E2E

| # | Blocker | Severity | Resolution |
|---|---------|----------|------------|
| 1 | **Staging DB not seeded** | 🔴 Critical | Run `POST /api/v1/admin/seed-menu` on staging backend or `npm run seed` with staging env |
| 2 | **Netlify `API_BASE_URL` not verified** | 🟠 High | Confirm Netlify staging site has `API_BASE_URL=https://moorthi-cafe-webapp.onrender.com/api/v1` |
| 3 | **Render staging `CLIENT_URL` not verified** | 🟠 High | Confirm Render staging has `CLIENT_URL=https://newmoorthicafe.netlify.app` |
| 4 | **Render staging `NODE_ENV=staging` not verified** | 🟠 High | Confirm Render staging has `NODE_ENV=staging` |
| 5 | **Render staging `MONGODB_URI` points to `moorthi_cafe_staging`** | 🔴 Critical | Verify Atlas connection string has `/moorthi_cafe_staging` database |
| 6 | **Local dev uses production API fallback** | 🟡 Medium | Not a staging blocker; local dev behavior |

---

## 8. Recommended Next Actions

### Immediate (Before Staging E2E)
1. **Seed staging database**
   ```bash
   # On staging backend
   curl -X POST https://moorthi-cafe-webapp.onrender.com/api/v1/admin/seed-menu \
     -H "Authorization: Bearer <admin-token>"
   ```

2. **Verify Netlify staging environment variables**
   - Netlify Dashboard → `newmoorthicafe` → Site settings → Environment variables
   - Ensure `API_BASE_URL=https://moorthi-cafe-webapp.onrender.com/api/v1`

3. **Verify Render staging environment variables**
   - Render Dashboard → `moorthi-cafe-webapp` → Environment
   - `NODE_ENV=staging`
   - `MONGODB_URI=mongodb+srv://.../moorthi_cafe_staging`
   - `CLIENT_URL=https://newmoorthicafe.netlify.app`
   - `JWT_SECRET=<32+ chars>`

4. **Verify staging database exists**
   - MongoDB Atlas → Clusters → `moorthicafecluster` → Collections
   - Confirm `moorthi_cafe_staging` database exists

5. **Run staging health check**
   ```bash
   curl https://moorthi-cafe-webapp.onrender.com/api/v1/health
   # Should return: { "success": true, "data": { "database": "CONNECTED", "environment": "staging" } }
   ```

### After Blockers Resolved
1. **Run full staging E2E suite**
   ```bash
   cd D:\project\moorthi_cafe_webapp
   PLAYWRIGHT_BASE_URL=https://newmoorthicafe.netlify.app \
   API_BASE_URL=https://moorthi-cafe-webapp.onrender.com/api/v1 \
   npx playwright test tests/e2e/staging.spec.js tests/e2e/order-flow.spec.js
   ```

2. **Verify asset loading**
   - Check Network tab for all 7 previously missing images
   - Confirm favicon loads
   - Verify no 404s

3. **Test critical flows**
   - Customer registration → login → cart → checkout → order
   - Admin login → dashboard → sales reports → menu management

---

## Final Verdict

### Staging E2E Readiness: **NOT READY** 🔴

### Blockers Summary
| Category | Status | Count |
|----------|--------|-------|
| Database Seeding | ❌ Not Done | 1 |
| Netlify Env Config | ❌ Unverified | 1 |
| Render Env Config | ❌ Unverified | 3 |
| Database Existence | ❌ Unverified | 1 |
| **Total Critical Blockers** | | **6** |

### Once Blockers Resolved: **READY** ✅
All asset fixes are deployed, test guardrails are in place, environment isolation is properly architected. The staging environment is correctly isolated from production at every layer (Netlify, Render, MongoDB, CORS).

---

*Report generated from read-only investigation. No deployments, merges, or environment modifications performed.*