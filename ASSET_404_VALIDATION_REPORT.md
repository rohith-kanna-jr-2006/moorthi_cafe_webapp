# Moorthi Cafe: Asset 404 Diagnosis Validation Report

**Project:** `D:\project\moorthi_cafe_webapp`  
**Branch:** `staging` (commit `737ca730c2fcad848655d9878f87388c4378ae65`)  
**Date:** 2026-11-20  
**Status:** Read-only investigation

---

## 1. Project State Verification

| Metric | Value |
|--------|-------|
| Current branch | `staging` |
| Current commit | `737ca730c2fcad848655d9878f87388c4378ae65` |
| Modified files | 11 (`.gitignore`, `CLAUDE.md`, `playwright.staging.config.js`, `src/App.js`, `src/admin/AdminDashboard.js`, `src/components/Navbar.js`, `src/index.css`, `src/pages/Gallery.js`, 3 test files) |
| Untracked files | 20+ (reports, screenshots, `.github/`, test utils) |
| Remote comparison | Local `staging` branch has 5 commits ahead of `origin/main` (last synced at `c260912`) |

> **Note:** GitHub `main` branch is **not** the current working state. Local `staging` branch has divergent changes.

---

## 2. Missing Image URL Trace Results

### API-Sourced Image URLs (from `https://moorthi-cafe-api.onrender.com/api/v1/foods`)

The frontend uses **remote production API** (default `API_BASE_URL=https://moorthi-cafe-api.onrender.com/api/v1`), not local backend. The API returns 10 SVG image URLs; 7 are missing locally.

| # | Food Item (API `_id`) | API `imageUrl` | Local File Exists? | Local Alternative |
|---|----------------------|----------------|-------------------|-------------------|
| 1 | Ambur Seeraga Samba Chicken Biryani (`6afc738f...`) | `/images/menu/chicken-biryani.svg` | ❌ **MISSING** | `chicken-biryani.jpg` (3.5 MB) |
| 2 | South Indian Heritage Thali (`6afc738e...`) | `/images/menu/heritage-thali.svg` | ❌ **MISSING** | `veg-pulao.svg` (3.4 KB) |
| 3 | Kumbakonam Degree Filter Kaapi (`6afc738e...`) | `/images/menu/filter-kaapi.svg` | ❌ **MISSING** | `cup-of-onion.svg` (3.7 KB) |
| 4 | Crispy Medu Vada (2 Pcs) (`6afc738e...`) | `/images/menu/medu-vada.svg` | ❌ **MISSING** | `roast.svg` (3.2 KB) |
| 5 | Podi Thatte Idli (2 Pcs) (`6afc738e...`) | `/images/menu/podi-idli.svg` | ❌ **MISSING** | `kal-dosa.svg` (3.2 KB) |
| 6 | Special Onion Rava Masala Dosa (`6afc738e...`) | `/images/menu/rava-dosa.svg` | ❌ **MISSING** | `onion-dosa.svg` (3.2 KB) |
| 7 | Golden Ghee Roast Masala Dosa (`6afc738e...`) | `/images/menu/ghee-roast-dosa.svg` | ❌ **MISSING** | `dosa.jpg` (794 KB) or `kal-dosa.svg` |
| 8 | Coastal Masala Prawn Fry (`6afc7391...`) | `/images/menu/prawn-fry.svg` | ✅ **EXISTS** | — |
| 9 | Madurai Bun Parotta (2 Pcs) (`6afc7390...`) | `/images/menu/bun-parotta.svg` | ✅ **EXISTS** | — |
| 10 | Chettinad Pepper Chicken (`6afc738f...`) | `/images/menu/pepper-chicken.svg` | ✅ **EXISTS** | `pepper-chicken.jpg` (2.9 MB) |

### Fallback Data References (Frontend-only, used when API fails)

| File | Line | Item | `imageUrl` | Local Exists? |
|------|------|------|------------|---------------|
| `src/pages/Home.js` | 27 | Podi Thatte Idli | `/images/menu/kal-dosa.svg` | ✅ |
| `src/pages/Home.js` | 36 | Filter Kaapi | `/images/menu/cup-of-onion.svg` | ✅ |
| `src/pages/Home.js` | 45 | Medu Vada | `/images/menu/roast.svg` | ✅ |
| `src/pages/Home.js` | 54 | Heritage Thali | `/images/menu/veg-pulao.svg` | ✅ |
| `src/pages/Home.js` | 63 | Pepper Chicken | `/images/menu/pepper-chicken.jpg` | ✅ |
| `src/pages/Menu.js` | 59 | Podi Thatte Idli | `/images/menu/kal-dosa.svg` | ✅ |
| `src/pages/Menu.js` | 71 | Filter Kaapi | `/images/menu/cup-of-onion.svg` | ✅ |
| `src/pages/Menu.js` | 83 | Medu Vada | `/images/menu/roast.svg` | ✅ |
| `src/pages/Menu.js` | 95 | Heritage Thali | `/images/menu/veg-pulao.svg` | ✅ |
| `src/pages/Menu.js` | 131 | Ambur Biryani | `/images/menu/chicken-biryani.jpg` | ✅ |
| `src/pages/Menu.js` | 155 | Rava Dosa | `/images/menu/onion-dosa.svg` | ✅ |

> **Key Finding:** The fallback data references **different filenames** than the API. The API returns SVG filenames that don't exist locally; fallback uses existing local assets with semantically appropriate substitutions.

---

## 3. Runtime Image Source Verification

| Aspect | Finding |
|--------|---------|
| **Active API base URL** | `https://moorthi-cafe-api.onrender.com/api/v1` (remote production) |
| **Local backend status** | ❌ Not running on port 5000 |
| **Image request initiator** | API response `imageUrl` field → `<img src={food.imageUrl}>` in `Menu.js:454` and `Home.js` via `FoodCard` |
| **Asset origin** | 100% remote API for live data; local `public/images/menu/` only for fallback assets |
| **Network request evidence** | Playwright captured 7 × 404 for SVG assets + 1 × 404 for favicon.ico |

---

## 4. Existing Asset Suitability Assessment

| Missing SVG | Intended Dish | Local Alternative | Suitability | Notes |
|-------------|---------------|-------------------|-------------|-------|
| `chicken-biryani.svg` | Ambur Seeraga Samba Chicken Biryani | `chicken-biryani.jpg` | ✅ **Excellent** | High-res authentic photograph (3.5 MB) |
| `heritage-thali.svg` | South Indian Heritage Thali | `veg-pulao.svg` | ⚠️ **Partial** | Shows rice bowl, not full banana-leaf thali spread |
| `filter-kaapi.svg` | Kumbakonam Degree Filter Kaapi | `cup-of-onion.svg` | ❌ **Poor** | Shows onion, not brass davarah-tumbler coffee |
| `medu-vada.svg` | Crispy Medu Vada | `roast.svg` | ❌ **Poor** | Generic roast icon, not lentil fritters |
| `podi-idli.svg` | Podi Thatte Idli | `kal-dosa.svg` | ⚠️ **Partial** | Shows dosa, not idli with podi |
| `rava-dosa.svg` | Special Onion Rava Masala Dosa | `onion-dosa.svg` | ✅ **Good** | Specifically onion rava dosa |
| `ghee-roast-dosa.svg` | Golden Ghee Roast Masala Dosa | `dosa.jpg` | ✅ **Excellent** | Authentic ghee roast dosa photograph |

> **Visual verification:** No new images generated. Suitability based on filename semantics and file type (photograph vs icon).

---

## 5. Favicon Verification

| Check | Result |
|-------|--------|
| `public/index.html` | ❌ No `<link rel="icon">` or `<link rel="shortcut icon">` |
| `public/favicon.ico` | ❌ Does not exist |
| `public/logo*.*` | ❌ No logo files |
| `webpack.cjs` | ❌ No `HtmlWebpackPlugin` favicon config; `CopyImagesPlugin` only copies `public/images/` |
| Production build output | Will **not** include favicon.ico |
| Browser behavior | Auto-requests `/favicon.ico` → 404 |

---

## 6. Final Diagnosis Table

| # | Failed URL | Exact Source | Current Data Source | Existing Asset Alternative | Confirmed Root Cause | Recommended Correction | Confidence |
|---|------------|--------------|---------------------|---------------------------|---------------------|------------------------|------------|
| 1 | `/images/menu/chicken-biryani.svg` | API `imageUrl` for `6afc738f...` (Ambur Biryani) | Remote API (production DB) | `chicken-biryani.jpg` (3.5 MB photo) | API returns `.svg` but only `.jpg` exists locally | Add `chicken-biryani.svg` or update API to return `.jpg` | 🔴 **High** |
| 2 | `/images/menu/heritage-thali.svg` | API `imageUrl` for `6afc738e...` (Heritage Thali) | Remote API (production DB) | `veg-pulao.svg` (rice bowl icon) | API returns `.svg` not in local assets | Add `heritage-thali.svg` or map to existing asset | 🔴 **High** |
| 3 | `/images/menu/filter-kaapi.svg` | API `imageUrl` for `6afc738e...` (Filter Kaapi) | Remote API (production DB) | `cup-of-onion.svg` (wrong icon) | API returns `.svg` not in local assets | Add `filter-kaapi.svg` with davarah-tumbler artwork | 🔴 **High** |
| 4 | `/images/menu/medu-vada.svg` | API `imageUrl` for `6afc738e...` (Medu Vada) | Remote API (production DB) | `roast.svg` (wrong icon) | API returns `.svg` not in local assets | Add `medu-vada.svg` with lentil fritter artwork | 🔴 **High** |
| 5 | `/images/menu/podi-idli.svg` | API `imageUrl` for `6afc738e...` (Podi Idli) | Remote API (production DB) | `kal-dosa.svg` (dosa not idli) | API returns `.svg` not in local assets | Add `podi-idli.svg` with idli+podi artwork | 🔴 **High** |
| 6 | `/images/menu/rava-dosa.svg` | API `imageUrl` for `6afc738e...` (Rava Dosa) | Remote API (production DB) | `onion-dosa.svg` (good match) | API returns `.svg` not in local assets | Add `rava-dosa.svg` or alias to `onion-dosa.svg` | 🟡 **Medium** |
| 7 | `/images/menu/ghee-roast-dosa.svg` | API `imageUrl` for `6afc738e...` (Ghee Roast Dosa) | Remote API (production DB) | `dosa.jpg` (excellent photo) | API returns `.svg` not in local assets | Add `ghee-roast-dosa.svg` or map to `dosa.jpg` | 🟡 **Medium** |
| 8 | `/favicon.ico` | Browser auto-request | N/A (no asset) | None | No favicon in `public/`, no webpack config | Add `favicon.ico` to `public/` | 🔴 **High** |

---

## 7. Summary of Confirmed Findings vs Hypotheses

| Category | Confirmed | Hypothesis / Unresolved |
|----------|-----------|-------------------------|
| **API source** | ✅ Remote production API (`moorthi-cafe-api.onrender.com`) | — |
| **Missing SVGs** | ✅ 7 of 10 API-referenced SVGs missing locally | — |
| **Asset mismatch** | ✅ API returns `.svg`; local has `.jpg` for some items | — |
| **Fallback data** | ✅ Uses different, existing local filenames | — |
| **Favicon** | ✅ Absent from public/, index.html, webpack config | — |
| **Visual suitability** | ⚠️ Based on filename semantics only | Need human visual review for `veg-pulao.svg`→thali, `cup-of-onion.svg`→kaapi, `roast.svg`→vada |
| **API imageUrl fix** | — | Whether to fix in API (DB) or frontend (mapping) is a design decision |
| **Production build** | — | `CopyImagesPlugin` only runs in production mode; dev server serves from `public/` directly |

---

## 8. File Paths & Line Numbers Reference

| File | Relevant Lines |
|------|----------------|
| `src/utils/api.js` | 1 (API_BASE_URL default) |
| `src/pages/Home.js` | 13–67 (FALLBACK_FEATURED_ITEMS), 74–85 (API fetch) |
| `src/pages/Menu.js` | 40–161 (HERITAGE_FALLBACK_FOODS), 163–202 (fetchFoods), 452–458 (img render) |
| `public/index.html` | 6 (title), no favicon link |
| `webpack.cjs` | 81–85 (HtmlWebpackPlugin), 9–56 (CopyImagesPlugin) |
| `backend/scripts/menuImportData.json` | 1187, 1192 (chicken-biryani.jpg reference) |

---

*Investigation complete. No files modified. No commands executed that alter state.*