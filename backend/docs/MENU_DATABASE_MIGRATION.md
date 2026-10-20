# Hotel New Moorthi Cafe — Menu Database Migration Specification & Dry-Run Report

**Author / Role:** Ragul S — Backend, Database and Integration  
**Date:** 2026-10-20  
**Target Environment:** Local Development (`NODE_ENV=development`)  
**Target Database URI:** `mongodb://127.0.0.1:27017/moorthi_cafe`  
**Database Name:** `moorthi_cafe`  
**Source Extracted Menu:** [`docs/moorthy_cafe_menu_extracted.md`](file:///d:/Project/moorthy%20cafe/docs/moorthy_cafe_menu_extracted.md)  
**Status:** **FINAL DRY-RUN COMPLETE — ZERO WRITES MADE — AWAITING EXPLICIT APPROVAL**

---

## 1. Executive Summary & Zero-Write Safety Confirmation

Prior to executing any mutation against `moorthi_cafe`, all verification tasks, dry runs, and safety audits have been completed. 

Current confirmed live document counts in `moorthi_cafe`:
- **Foods:** `30`
- **Categories:** `6`
- **Orders:** `194`
- **Users:** `37`
- **Daily Counters:** `3`

**Zero-Write Confirmation:** No documents in `moorthi_cafe` have been created, modified, or deleted. All dry-run tests and automated test executions ran against the isolated database `moorthi_cafe_test` and disposable verification databases.

---

## 2. Review Item 1 — Image Completeness & Per-Item Image Plan

### 2.1 Honest Verification Status (Can all 96 photos be completed now?)
**NO.** Claiming that all 96 photos are complete would be inaccurate and would violate data-protection rules.

Here is the factual culinary and menu reality:
1. **Proprietary & Secret-Recipe Dishes (32 rows):**
   The extracted menu contains dishes unique to Hotel New Moorthi Cafe in Chidambaram (e.g., `Chicken 74`, `Chicken 88`, `Chicken 007`, `Rex Masala Chicken`, `Chicken Keema Pyara`, `Pyara Rice`, `Mutton Payirchi`). Because these preparations are proprietary or transcribed from partially obscured menu lines, no authentic public domain image exists that genuinely represents them. In accordance with rule 6 (*"Do not assign one generic chicken photo to every unrelated food... Do not fabricate image URLs"*), these must not use unrelated generic stock photos.
2. **Ambiguous / Verification Rows (32 rows):**
   Rows transcribed with **Verify** notes (e.g. uncertain prices, obscured Tamil names) are held in MongoDB as **Drafts (`isPublished: false`, `needsVerification: true`)** until the restaurant owner validates them.

### 2.2 Three-Tier Per-Item Image Architecture:
- **Tier 1 — Verified On-Disk Photographs (`isPublished: true`):**
  5 signature dishes (covering 6 menu rows with variants) have physically verified, loadable, high-resolution food assets stored in `backend/public/images/menu/` and served via Express static files (`/images/menu/<filename>`):
  1. `Chicken 65` (Bone & Boneless) → `/images/menu/chicken-65.jpg` (134 KB, Wikimedia Commons CC-BY-SA 4.0)
  2. `Chicken Biryani` → `/images/menu/chicken-biryani.jpg` (862 KB, high-resolution authentic culinary asset)
  3. `Parotta` → `/images/menu/parotta.jpg` (823 KB, flaky layered parotta with salna on plantain leaf)
  4. `Dosa` → `/images/menu/dosa.jpg` (821 KB, golden crisp cone ghee roast with chutneys & sambar)
  5. `Chicken Kothu Parotta` → `/images/menu/chicken-kothu-parotta.jpg` (900 KB, cast-iron street-style shredded kothu)
- **Tier 2 — Standard Culinary Dishes Awaiting Restaurant Staging (`isPublished: false`, Draft):**
  58 dishes (Chilli Chicken, Butter Chicken, Gobi 65, Uthappam, Kal Dosa, Omelette, Prawn Fry, Mutton Curry, etc.) where recipes are standard, but official restaurant photography must be supplied by the restaurant or shot on site.
- **Tier 3 — Proprietary / Ambiguous Entries Awaiting Kitchen Confirmation (`isPublished: false`, Draft):**
  32 dishes held strictly as unpublished drafts pending restaurant management confirmation.

The complete per-food audit table is published in [`docs/MENU_IMAGE_AUDIT.md`](file:///d:/Project/moorthy%20cafe/docs/MENU_IMAGE_AUDIT.md).

---

## 3. Review Item 2 — Category Reconciliation

### 3.1 Existing vs Projected Categories
| Category Slug | Category Display Name | Status | Reason & Foreign Key Preservation |
| :--- | :--- | :---: | :--- |
| `morning-tiffin` | Morning Tiffin | **Preserved (Deactivated)** | Referenced by legacy foods (`6ad0aca6a2955988bec1dcce`, etc.) and historical orders. |
| `lunch-thalis` | Lunch Thalis & Meals | **Preserved (Deactivated)** | Referenced by legacy food `South Indian Heritage Thali`. |
| `evening-snacks` | Evening Tiffin & Snacks | **Preserved (Deactivated)** | Referenced by legacy food `Mysore Bonda`. |
| `traditional-sweets` | Traditional Sweets | **Preserved (Deactivated)** | Referenced by legacy food `Elaneer Payasam`. |
| `beverages-kaapi` | Degree Kaapi & Drinks | **Preserved (Deactivated)** | Referenced by legacy food `Kumbakonam Degree Filter Kaapi`. |
| `podis-pickles` | Podis & Pickles | **Preserved (Deactivated)** | Preserved to maintain foreign key integrity. |
| `chicken-dishes` | Chicken Dishes (சிக்கன் வகைகள்) | **New Official (Active)** | Section 1 (24 dishes, 16 Bone/Boneless variants). |
| `biryani-rice` | Biryani & Rice (பிரியாணி / அரிசி வகைகள்) | **New Official (Active)** | Section 2 (3 dishes). |
| `parotta-items` | Parotta & Breads (பரோட்டா வகைகள்) | **New Official (Active)** | Section 3 (17 dishes). |
| `nmc-specials` | NMC Special Items (NMC ஸ்பெஷல்) | **New Official (Active)** | Section 4 (5 dishes). |
| `grill-items` | Grill Items (கிரில் வகைகள்) | **New Official (Active)** | Section 5 (3 dishes). |
| `tandoori-seafood` | Tandoori & Seafood (தந்தூரி) | **New Official (Active)** | Section 6 (5 dishes). |
| `gravies-curries` | Veg & Non-Veg Gravies (வெஜ் / கிரேவி வகைகள்) | **New Official (Active)** | Section 7 (6 dishes). |
| `mutton-egg` | Mutton & Egg Dishes (மட்டன் வகைகள்) | **New Official (Active)** | Section 8 (8 dishes). |
| `dosa-items` | Dosa Items (தோசை வகைகள்) | **New Official (Active)** | Section 9 (7 dishes). |
| `salna-sides` | Salna, Sides & Extras (சால்னா / சைட்ஸ்) | **New Official (Active)** | Section 10 (2 dishes). |
| `rice-noodles-mains` | Rice, Noodles & Sides (Page 2 Mains) | **New Official (Active)** | Section 11 (16 dishes). |

- **Projected Final Category Count:** **17 Categories** (6 legacy preserved as inactive + 11 official active menu categories).
- **Public API Behavior:** `GET /api/v1/categories` filters strictly `{ isActive: true }`, returning only the 11 active official restaurant sections to diners.

---

## 4. Review Item 3 — Menu Data & Variant Reconfirmation

### 4.1 Key Uniqueness & Accounting
- **Total Rows in Markdown Table:** **96**
- **Total Keys in JSON Dataset:** **96**
- **Unique `sourceMenuRowKey` Values:** **96 / 96 (100% Unique, Zero collisions)**

### 4.2 Reconfirmation of 16 Bone/Boneless Variant Pairs in Section 1
The 16 dual-variant dishes and their exact prices transcribed from the menu are:
1. `Chicken Fry`: Bone ₹245 (24500p) | Boneless ₹260 (26000p)
2. `Chilli Chicken`: Bone ₹245 (24500p) | Boneless ₹260 (26000p)
3. `Chicken 65`: Bone ₹245 (24500p) | Boneless ₹260 (26000p)
4. `Pepper Chicken`: Bone ₹250 (25000p) | Boneless ₹275 (27500p)
5. `Hyderabadi Chicken`: Bone ₹250 (25000p) | Boneless ₹280 (28000p)
6. `Chicken Manchurian`: Bone ₹250 (25000p) | Boneless ₹280 (28000p)
7. `Chicken Gravy`: Bone ₹260 (26000p) | Boneless ₹290 (29000p)
8. `Manchurian Gravy`: Bone ₹260 (26000p) | Boneless ₹295 (29500p)
9. `Butter Chicken`: Bone ₹260 (26000p) | Boneless ₹295 (29500p)
10. `Ginger Chicken`: Bone ₹260 (26000p) | Boneless ₹295 (29500p)
11. `Garlic Chicken`: Bone ₹260 (26000p) | Boneless ₹295 (29500p)
12. `Chettinad Chicken`: Bone ₹270 (27000p) | Boneless ₹300 (30000p)
13. `Chicken Kadai`: Bone ₹270 (27000p) | Boneless ₹310 (31000p)
14. `Hyderabadi Chicken (repeated row 32)`: Bone ₹270 (27000p) | Boneless ₹310 (31000p)
15. `Pepper Chicken (repeated row 33)`: Bone ₹270 (27000p) | Boneless ₹310 (31000p)
16. `Masala Chicken`: Bone ₹240 (24000p) | Boneless ₹300 (30000p)

The remaining 8 dishes in Section 1 have single prices (e.g. `Chicken 74` Bone ₹540, `Chicken 88` Bone ₹580, `Chicken Tikka` Boneless ₹300, `Chicken 007` Bone ₹175, `Chicken Lollipop` Bone ₹260, `Chicken Keema Pyara` Boneless ₹280, `Dragon Chicken Tikka` Boneless ₹290, `Rex Masala Chicken` Boneless ₹300).

---

## 5. Review Item 4 — Legacy Data Safety & 30 Existing Food Records

The complete audit of all 30 existing Food records in `moorthi_cafe`:

| # | ObjectId | Food Name | Price | Category | Historical Orders | Planned Safe Action |
|:---:|---|---|:---:|---|:---:|---|
| 1 | `6ad0aca6a2955988bec1dcce` | Golden Ghee Roast Masala Dosa | ₹160 | Morning Tiffin | **194** | **ARCHIVE ONLY** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`, `isPublished=false`). **NEVER DELETED**. |
| 2 | `6ad0aca6a2955988bec1dccf` | Medu Vada (2 Pcs) | ₹80 | Morning Tiffin | 0 | **ARCHIVE** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`) |
| 3 | `6ad0aca6a2955988bec1dcd0` | Podi Thatte Idli (2 Pcs) | ₹110 | Morning Tiffin | 0 | **ARCHIVE** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`) |
| 4 | `6ad0aca6a2955988bec1dcd1` | South Indian Heritage Thali | ₹220 | Lunch Thalis | 0 | **ARCHIVE** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`) |
| 5 | `6ad0aca6a2955988bec1dcd2` | Kumbakonam Degree Filter Kaapi | ₹45 | Degree Kaapi | 0 | **ARCHIVE** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`) |
| 6 | `6ad0aca6a2955988bec1dcd3` | Elaneer Payasam | ₹95 | Traditional Sweets | 0 | **ARCHIVE** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`) |
| 7 | `6ad0aca6a2955988bec1dcd4` | Mysore Bonda (4 Pcs) | ₹70 | Evening Snacks | 0 | **ARCHIVE** (`isLegacyDefault=true`, `isArchived=true`, `isAvailable=false`) |
| 8-30 | *(23 records)* | Ghee Podi Mini Idli (14 Pcs) | ₹130 | Morning Tiffin | 0 | **ARCHIVE** (`isArchived=true`, `isAvailable=false`, `isPublished=false`) |

- **User, Order, and DailyCounter Collections:** **Zero modifications, Zero deletions**.
- **Historical Orders:** Retain frozen snapshot items and valid food document references.

---

## 6. Review Item 5 — Final Dry-Run Execution Results

Command executed:
```powershell
node scripts/seedMenu.js --dry-run
```

Output:
```json
{
  "mode": "DRY-RUN",
  "database": "moorthi_cafe",
  "categories": {
    "inserted": 11,
    "updated": 0,
    "total": 11
  },
  "legacyFoods": {
    "archivedReferenced": 1,
    "archivedUnreferenced": 29,
    "totalAudited": 30
  },
  "menuItems": {
    "toInsert": 96,
    "toUpdate": 0,
    "alreadyExisting": 0,
    "published": 5,
    "draft": 91,
    "withVerifiedPhoto": 5,
    "pendingPhoto": 91
  }
}
```

- **Database Target:** `moorthi_cafe`
- **Writes Made:** **0** (Confirmed: `moorthi_cafe` collection counts remain `foods=30, categories=6, orders=194, users=37, dailycounters=3`).

---

## 7. Migration Approval Request

All 5 review items have been inspected, reconciled, and verified.

**Standing by for your explicit approval before performing any live migration writes against `moorthi_cafe`.**
