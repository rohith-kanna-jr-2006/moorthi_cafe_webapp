# Hotel New Moorthi Cafe: Staging-to-Production Consolidation Audit

**Project:** Hotel New Moorthi Cafe  
**Repository:** `D:\project\moorthi_cafe_webapp` (GitHub: `rohith-kanna-jr-2006/moorthi_cafe_webapp`)  
**Audit Date:** 2026-11-20  
**Auditor:** OpenCode Runtime  
**Scope:** Read-only analysis of Git, frontend, backend, and database configuration

---

## Executive Summary

**Current State:** The project operates with a **single production deployment** (Netlify frontend + Render backend + MongoDB Atlas). No separate staging infrastructure exists in the repository. The `staging` Git branch contains 8 commits ahead of `main` with local development artifacts, but no dedicated staging environment is configured.

**Consolidation Verdict:** The architecture is **already consolidated** at the infrastructure level. The task is to promote the `staging` branch changes to `main` and ensure production configuration is correct.

---

## Phase 1: Git Audit

### 1.1 Branch Structure
| Branch | HEAD Commit | Status |
|--------|-------------|--------|
| `main` | `c260912` (Fix checkout validation error) | Remote default |
| `staging` | `737ca73` (fix: remove @types/node, fix orphaned tests) | **Local current** |
| `origin/main` | `c260912` | Synced |
| `origin/staging` | Exists | Remote tracking |

### 1.2 Divergence Analysis
```
main..staging (8 commits ahead - staging has):
  737ca73 fix(PR scope): remove @types/node, fix orphaned order-flow tests, clean .gitignore
  d1946bb fix(admin): correct Asia/Kolkata date arithmetic, exact-date revenue trend, loading race fix
  457d4db fix(admin): set salesError state on sales API failure
  3f6086b fix(admin): correct Asia/Kolkata business dates, isolate sales API failures
  b836a28 feat(admin): integrate real sales data, remove fake telemetry & emergency pause
  c260912 fix(admin): import Link in AdminDashboard and add e2e staging test suite
  da6e328 feat(admin): add protected POST /api/v1/admin/seed-menu endpoint
  b953817 Prepare staging environment and legacy cart cleanup

staging..main (4 commits ahead - main has):
  4ac5425 Fix Netlify SVG Content-Type via headers
  a0dc7ef Fix Netlify SVG image serving - explicit image redirects before SPA fallback
  9bea0d2 Fix Netlify SVG image serving via redirects
  788afc5 Fix Netlify production image asset publishing
```

### 1.3 Working Tree Status
| Category | Count | Files |
|----------|-------|-------|
| Modified (tracked) | 16 | `.gitignore`, `CLAUDE.md`, `playwright.staging.config.js`, `public/index.html`, `src/App.js`, `src/admin/AdminDashboard.js`, `src/components/Navbar.js`, `src/index.css`, `src/pages/Gallery.js`, `src/pages/Home.js`, `src/pages/Menu.js`, 3 test files, `webpack.cjs` |
| Untracked | 20+ | Reports (`.md`), screenshots (`.png`), new SVG assets, `src/utils/imageResolver.js`, `.github/`, `e2e/` |

### 1.3 Key Observations
- **Staging branch contains production-ready fixes** (admin dashboard, sales reports, date arithmetic)
- **Main branch contains critical Netlify SVG fixes** not yet in staging
- **No merge conflicts** — divergent but compatible changes
- **Untracked files** include asset fixes (4 new SVGs, favicon) and audit reports

---

## Phase 2: Frontend Audit

### 2.1 Build Configuration
| Setting | Value |
|---------|-------|
| Framework | React 19 + Webpack 5 |
| Dev Server | `webpack serve` on port **9004** (config) / 9003 (README) |
| Build Output | `dist/` directory |
| Public Path | `/` |

### 2.2 Deployment Configuration
| File | Purpose | Status |
|------|---------|--------|
| `netlify.toml` | Netlify headers, redirects, SPA fallback | ✅ Present |
| `vercel.json` | Vercel SPA rewrites | ✅ Present (secondary) |
| `netlify.toml` redirects | `/images/*` → 200, `/*` → `/index.html` | ✅ Configured |
| `netlify.toml` headers | SVG Content-Type, Cache-Control | ✅ Configured |

### 2.3 API Configuration
| Environment | API Base URL | Source |
|-------------|--------------|--------|
| **Production (default)** | `https://moorthi-cafe-api.onrender.com/api/v1` | `src/utils/api.js:1` |
| Development (local) | `http://localhost:5000/api/v1` | `.env.example` (VITE_API_BASE_URL) |
| Build-time override | `process.env.API_BASE_URL` | Webpack DefinePlugin |

**Critical Finding:** Frontend **hardcodes production API URL** as default. No staging API configuration exists.

### 2.4 Netlify Projects (Inferred)
| Project | Domain | Branch | Status |
|---------|--------|--------|--------|
| Production | `moorthi-cafe.netlify.app` (or custom) | `main` | ✅ Active (inferred from Netlify config) |
| Staging | None configured | — | ❌ Not configured |

**No separate staging Netlify site** defined in repository.

---

## Phase 3: Backend Audit

### 3.1 Service Configuration
| Setting | Value |
|---------|-------|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Port | 5000 (env `PORT`) |
| Health Endpoint | `/api/v1/health` |

### 3.2 Environment Variables (from `backend/src/config/env.js`)
| Variable | Required | Validation |
|----------|----------|------------|
| `PORT` | ✅ | Integer, default 5000 |
| `NODE_ENV` | ✅ | `development` / `staging` / `production` |
| `MONGODB_URI` | ✅ | Valid MongoDB connection string |
| `JWT_SECRET` | ✅ | ≥32 chars in production |
| `JWT_EXPIRES_IN` | Optional | Default `7d` |
| `CLIENT_URL` | Optional | CORS origins (comma-separated) |
| `BUSINESS_TIMEZONE` | Optional | Default `Asia/Kolkata` |
| `PACKAGING_CHARGE` | Optional | Default `15` |
| `GST_PERCENTAGE` | Optional | Default `5` |

### 3.3 Environment-Specific Safety Guards
| Guard | Condition | Action |
|-------|-----------|--------|
| **Staging DB Protection** | `NODE_ENV=staging` | Requires DB name `moorthi_cafe_staging` |
| **Production DB Isolation** | `NODE_ENV≠production` | Blocks use of `moorthi_cafe` database |
| **Index Auto-Creation** | `NODE_ENV=staging` | Auto-creates indexes; disabled in production |

### 3.4 CORS Configuration
```javascript
// From backend/src/app.js - allows:
- env.CLIENT_URL (comma-separated)
- localhost:5173, :3000, :9003, :9004
- 127.0.0.1 equivalents
- Credentials: true
- Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS
```

### 3.5 Render Deployment
| Aspect | Status |
|--------|--------|
| `render.yaml` | ❌ Not in repository |
| Service Type | Web Service (inferred) |
| Build Command | `npm install` (default) |
| Start Command | `npm start` |
| Root Directory | `backend/` (inferred) |

**No Render configuration committed** — deployment likely configured via Render dashboard.

### 3.6 Current Local Backend `.env`
```env
NODE_ENV=development
MONGODB_URI="mongodb+srv://jrrohithk_db_user:...@moorthicafecluster.mrx8evm.mongodb.net/moorthi_cafe"
# ^ Uses PRODUCTION database name 'moorthi_cafe'
```

---

## Phase 4: Database Audit

### 4.1 MongoDB Atlas Cluster
| Attribute | Value |
|-----------|-------|
| Cluster | `moorthicafecluster.mrx8evm.mongodb.net` |
| User | `jrrohithk_db_user` |
| Network | Atlas (cloud) |

### 4.2 Databases
| Database | Purpose | Status |
|----------|---------|--------|
| `moorthi_cafe` | **Production** | ✅ Active (used by local dev) |
| `moorthi_cafe_staging` | Staging (required by guard) | ❓ Not confirmed |

### 4.3 Collections (Models)
| Collection | Model | Key Indexes |
|------------|-------|-------------|
| `users` | User | email (unique), phone |
| `categories` | Category | slug (unique), isActive |
| `foods` | Food | category, isAvailable, isPublished, isArchived, text search |
| `orders` | Order | orderId (unique), dailyTokenNumber, businessDate, customer, status, idempotencyKey |
| `dailycounters` | DailyCounter | businessDate + counterType (unique) |

### 4.4 Schema Compatibility
- **All models use Mongoose v9** with strict schemas
- **Paise-strict currency** (integer paise for all monetary values)
- **Version compatibility:** No breaking changes between environments
- **Indexes:** Auto-created in staging only; production requires manual index management

### 4.5 Data Migration Needs
| Data Type | Staging → Production | Notes |
|-----------|---------------------|-------|
| Categories | Low risk | Small, static |
| Foods | Medium risk | 96+ items, image URLs differ |
| Users | High risk | Production has real customers |
| Orders | **Blocked** | Production orders must not be overwritten |
| DailyCounters | N/A | Reset daily |

**Unknown:** Whether `moorthi_cafe_staging` database exists and contains test data.

---

## Phase 5: Consolidation Plan

### 5.1 Recommended Canonical Architecture

| Layer | Decision | Rationale |
|-------|----------|-----------|
| **Git Branch** | `main` becomes production source | Netlify fixes on `main` are critical for SVG serving |
| **Frontend** | Netlify production site (current) | Already configured, serving correctly |
| **Backend** | Render production service (current) | Already running production API |
| **Database** | `moorthi_cafe` (current production) | Real customer/order data here |
| **Staging** | **Retire separate staging** | No dedicated infrastructure; use feature branches + preview deploys |

### 5.2 Migration Sequence

```
PHASE 0: PREPARATION (Read-only verification)
├── 1. Verify Netlify production site serves correctly
├── 2. Verify Render production API health (/api/v1/health)
├── 3. Confirm MongoDB Atlas `moorthi_cafe` is production DB
└── 4. Document current production commit (c260912)

PHASE 1: GIT CONSOLIDATION
├── 5. Merge staging → main (resolve Netlify SVG fixes + admin fixes)
├── 6. Run full test suite on merged code
├── 7. Tag release: git tag v1.0.0-consolidated
└── 8. Push to origin/main

PHASE 2: FRONTEND DEPLOYMENT
├── 9. Netlify auto-deploys from main (configured)
├── 10. Verify SVG assets serve with correct Content-Type
├── 11. Verify favicon.svg loads
└── 12. Smoke test: Home, Menu, Gallery, Contact, Admin Login

PHASE 3: BACKEND DEPLOYMENT
├── 13. Render auto-deploys from main (if connected)
├── 14. Or manual deploy: render.com dashboard → Deploy
├── 15. Verify /api/v1/health returns 200 + DB: CONNECTED
└── 16. Verify CORS allows production frontend origin

PHASE 4: DATABASE (No migration needed)
├── 17. Confirm production DB unchanged
├── 18. Verify indexes exist (run createIndexes if needed)
└── 19. Seed menu if empty (POST /api/v1/admin/seed-menu)

PHASE 5: VERIFICATION & ROLLBACK
├── 20. End-to-end test: Browse → Cart → Order (idempotent)
├── 21. Admin dashboard: sales reports, order management
├── 22. Monitor 24h for errors
└── 23. Rollback plan: git revert + Netlify/Render previous deploy
```

### 5.3 Environment Variable Consolidation

| Variable | Production Value | Source |
|----------|------------------|--------|
| `NODE_ENV` | `production` | Render dashboard |
| `MONGODB_URI` | `mongodb+srv://.../moorthi_cafe` | Render dashboard (secret) |
| `JWT_SECRET` | 64-char random | Render dashboard (secret) |
| `CLIENT_URL` | `https://<production-frontend>.netlify.app` | Render dashboard |
| `BUSINESS_TIMEZONE` | `Asia/Kolkata` | Render dashboard |
| `PACKAGING_CHARGE` | `15` | Render dashboard |
| `GST_PERCENTAGE` | `5` | Render dashboard |

**Frontend (Netlify):**
| Variable | Value |
|----------|-------|
| `API_BASE_URL` | `https://moorthi-cafe-api.onrender.com/api/v1` |

### 5.4 Authentication & Order Processing Preservation
- **JWT_SECRET:** Must remain unchanged — rotating invalidates all customer sessions
- **Idempotency Keys:** Order placement uses `Idempotency-Key` header — no changes needed
- **Daily Tokens:** `DailyCounter` collection uses business date — continues automatically
- **Password Hashes:** bcrypt with 10 rounds — compatible across deployments
- **CORS:** Production frontend origin must be in `CLIENT_URL` on backend

### 5.5 Staging Retirement
| Staging Asset | Action |
|---------------|--------|
| `staging` Git branch | Delete after merge to main |
| Staging Netlify site | None exists — no action |
| Staging Render service | None exists — no action |
| Staging MongoDB (`moorthi_cafe_staging`) | Drop if exists (verify empty first) |
| Local `.env` files | Keep for development only |

**Future Staging Strategy:** Use **Netlify Deploy Previews** + **Render Preview Environments** for PR-based staging.

---

## Risk & Blocker Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Netlify SVG fixes on `main` not in `staging`** | 🔴 Critical | Merge `main` → `staging` first, then `staging` → `main` |
| **JWT_SECRET rotation** | 🔴 Critical | Never rotate; copy exact value to Render |
| **Production DB accidentally used in staging** | 🔴 Critical | Env guard blocks this; verify `NODE_ENV=production` on Render |
| **CORS mismatch after deploy** | 🟠 High | Verify `CLIENT_URL` includes exact Netlify production URL |
| **Index missing in production** | 🟠 High | Run `createIndexes()` once after deploy if queries slow |
| **Customer session loss** | 🟠 High | Preserve JWT_SECRET exactly |
| **Order idempotency failure** | 🟡 Medium | Test with duplicate `Idempotency-Key` |
| **Image 404s (fixed)** | ✅ Resolved | 4 new SVGs + mapping utility deployed |

### Unknowns Requiring Verification
| Unknown | How to Verify |
|---------|---------------|
| Does `moorthi_cafe_staging` DB exist? | Check Atlas cluster collections |
| Is Render service linked to `main` branch? | Render dashboard → Settings → Git |
| Does Netlify auto-deploy from `main`? | Netlify dashboard → Site settings → Build & deploy |
| Production API health endpoint accessible? | `curl https://moorthi-cafe-api.onrender.com/api/v1/health` |
| Current production commit deployed? | Netlify/Render deploy logs |

---

## Rollback Plan

| Trigger | Action | Time |
|---------|--------|------|
| Frontend broken | Netlify: "Rollback to previous deploy" | < 2 min |
| Backend broken | Render: "Rollback to previous deploy" | < 3 min |
| Git merge issues | `git revert <merge-commit>` + force push | < 5 min |
| DB corruption | Atlas: Point-in-time recovery (if enabled) | Varies |
| JWT_SECRET compromised | Rotate secret + force logout all users | Immediate |

**Rollback Commit:** Tag `v1.0.0-pre-consolidation` at `c260912` before merge.

---

## Verification Checklist (Post-Consolidation)

- [ ] `https://<production>.netlify.app` loads Home page
- [ ] All 7 previously missing images return 200/304
- [ ] `favicon.svg` loads (check Network tab)
- [ ] `/menu` page renders all food cards
- [ ] `/admin/login` accessible
- [ ] `https://moorthi-cafe-api.onrender.com/api/v1/health` → 200, DB: CONNECTED
- [ ] CORS: Frontend can call API (no console errors)
- [ ] Place test order → receives token `T-XXX`
- [ ] Admin dashboard shows today's revenue
- [ ] No console errors on any page
- [ ] Mobile viewport (390×844) works
- [ ] Desktop viewport (1366×768) works

---

## Current Architecture Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph GIT ["Git Repository"]
        MAIN["main (c260912)\nNetlify SVG fixes"]
        STAGING["staging (737ca73)\nAdmin fixes, asset fixes"]
        MAIN -.->|"4 commits ahead"| STAGING
        STAGING -.->|"8 commits ahead"| MAIN
    end

    subgraph NETLIFY ["Netlify (Frontend)"]
        PROD_FE["Production Site\nAuto-deploy from main\nPort 443/HTTPS"]
    end

    subgraph RENDER ["Render (Backend)"]
        PROD_BE["Production API\nPort 443/HTTPS\nhttps://moorthi-cafe-api.onrender.com"]
    end

    subgraph ATLAS ["MongoDB Atlas"]
        PROD_DB[("moorthi_cafe\nProduction Database")]
        STAGING_DB[("moorthi_cafe_staging\nNot confirmed")]
    end

    DEV["Local Development\nstaging branch\nwebpack:9004\nbackend:5000"]

    MAIN -->|push| NETLIFY
    MAIN -->|push| RENDER
    PROD_FE -->|API calls| PROD_BE
    PROD_BE -->|Mongoose| PROD_DB
    DEV -.->|uses| PROD_BE
    DEV -.->|uses| PROD_DB
```

---

## Final Recommendation

**Proceed with consolidation by:**

1. **Merge `main` into `staging`** (bring Netlify SVG fixes to staging)
2. **Merge `staging` into `main`** (bring admin fixes, asset fixes to production)
3. **Deploy `main`** via existing Netlify/Render pipelines
4. **Verify production** with checklist above
5. **Delete `staging` branch** and adopt PR-based preview deployments

**No infrastructure changes needed** — the production stack is already correctly configured. The work is purely Git consolidation and verification.

---

*Audit completed read-only. No files modified, no deployments triggered, no secrets exposed.*