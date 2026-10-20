# Hotel New Moorthi Cafe — Admin Dynamic Menu API Contract

**Document Version:** 1.0.0  
**Target Audience:** React Frontend Team, Backend Integration, Admin Dashboard Developers  
**Authentication Scheme:** Bearer JWT in `Authorization` header (`Authorization: Bearer <adminToken>`)  
**Base URL:** `http://localhost:5000/api/v1/admin/foods` (Development) / `/api/v1/admin/foods` (Production)  
**Security Boundary:** All routes require an authenticated user with role `'admin'`. Roles submitted in request bodies or query parameters are untrusted and ignored.

---

## 1. Architectural Summary & Business Rules

1. **MongoDB is Runtime Source of Truth:**
   - Source import datasets (`menuImportData.json`) are one-time initial inputs.
   - Any runtime modifications to food names, prices, discounts, variants, images, publication, and availability are persisted in MongoDB.

2. **Discount Policy & Canonical Currency:**
   - Discounts can be `PERCENTAGE` (0 < value <= 100) or `FIXED_AMOUNT` (0 <= value <= price). 100% discount is valid and yields `effectivePrice = 0`.
   - Discounts support scheduled time windows: `startsAt` and `endsAt`.
   - **No Stacking:** Variant-level discounts take precedence over dish-level discounts. If a variant does not have an active discount, the dish-level discount applies to the variant price.
   - Server computes authoritative `effectivePrice` (Rupees) and `effectivePricePaise` (Paise). React-submitted totals are untrusted.
   - Every placed order item snapshots `originalPrice`, `originalPricePaise`, `pricePaise`, `lineTotalPaise`, and `discountApplied`.

3. **Statutory Taxes & Packaging Charges (Configurable Fallbacks):**
   - **Status:** 🟡 Unconfirmed business requirement (pending owner sign-off in `docs/OWNER-DECISIONS.md`).
   - **Configurability:** Controlled via `GST_PERCENTAGE` (default: `5.0`) and `PACKAGING_CHARGE` (default: `15.0`) in `.env`.
   - If set to `0` (`GST_PERCENTAGE=0` or `PACKAGING_CHARGE=0`), charges are gracefully bypassed without NaN or fallback glitches.
   - **Authoritative Server Formula:**
     * `subtotal = sum(round(effectivePrice * quantity * 100) / 100)`
     * `gst = round(subtotal * (GST_PERCENTAGE / 100) * 100) / 100`
     * `packagingCharge = PACKAGING_CHARGE`
     * `totalAmount = round((subtotal + gst + packagingCharge) * 100) / 100`

4. **Safe Archival Policy & Concurrency Protection:**
   - When `DELETE /api/v1/admin/foods/:id` is invoked:
     - The dish is immediately pre-deactivated (`isAvailable = false, isPublished = false`) to close race conditions with concurrent cart submissions.
     - If the food is referenced in **>= 1 historical orders**, it is **safely archived** (`isArchived: true, isAvailable: false, isPublished: false`). Historical order snapshots and foreign-key references remain 100% intact.
     - If the food has **0 historical orders**, it is **permanently deleted** (`deleteOne()`).

5. **Image Management, Sharing & Security:**
   - Uploads accept JPEG, PNG, or WebP. Actual file content is verified via **magic bytes inspection** (not relying on file extensions).
   - Maximum upload file size is **5MB** (with Express body parser configured to 10MB to accommodate base64 overhead).
   - Executable files, script injection, and path traversal (`..`, `file://`, `javascript:`) are rejected with `400 Bad Request`.
   - Safe filenames are generated server-side: `/images/uploads/food-<id>-<timestamp>.<ext>`.
   - **Shared Asset Preservation:** If multiple food records reference the same uploaded image file, replacing or deleting one food will **never delete the physical file** from disk while another food still references it.
   - Admin can also update dish image metadata using approved/verified relative paths or HTTPS image URLs.

---

## 2. API Endpoints

### 2.1 List All Foods (Admin Dashboard View)
`GET /api/v1/admin/foods`

Allows administrators to review all catalog items, drafts, archived dishes, and active discounts.

#### Query Parameters
| Parameter | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `page` | Integer | `>= 1` (default: 1) | Pagination page number |
| `limit` | Integer | `1` to `100` (default: 20) | Number of records per page |
| `search` | String | Max 100 chars | Text search across English, Tamil, description, tags |
| `category` | String | Category ObjectId or slug | Filter by category |
| `isPublished` | String | `'true'` or `'false'` | Filter published vs draft items |
| `isAvailable` | String | `'true'` or `'false'` | Filter available vs out-of-stock items |
| `isArchived` | String | `'true'`, `'false'`, `'all'` (default: `'false'`) | Filter archived vs active items |
| `hasDiscount` | String | `'true'` or `'false'` | Filter items with active discount flags |
| `sort` | String | `price_asc`, `price_desc`, `name`, `createdAt`, `-createdAt` | Sorting order |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Admin foods retrieved successfully",
  "data": {
    "foods": [
      {
        "_id": "673cf10b2984123456789abc",
        "name": "Chicken 65",
        "nameTamil": "சிக்கன் 65",
        "nameEnglish": "Chicken 65",
        "description": "Crisp spiced deep-fried chicken marinated in crushed ginger-garlic and curd",
        "price": 240,
        "pricePaise": 24000,
        "effectivePrice": 192,
        "effectivePricePaise": 19200,
        "isDiscountActive": true,
        "discount": {
          "type": "PERCENTAGE",
          "value": 20,
          "startsAt": "2026-10-01T00:00:00.000Z",
          "endsAt": "2026-10-31T23:59:59.000Z",
          "isActive": true
        },
        "discountApplied": {
          "type": "PERCENTAGE",
          "value": 20,
          "discountAmount": 48,
          "discountAmountPaise": 4800
        },
        "variants": [],
        "category": {
          "_id": "673cf10b2984123456789001",
          "name": "Starters & Chicken Dry",
          "slug": "starters-chicken-dry"
        },
        "imageUrl": "/images/menu/chicken_65.jpg",
        "imageAlt": "Chicken 65 crispy deep-fried starter",
        "imageSource": "https://commons.wikimedia.org/wiki/File:Chicken_65.jpg",
        "imageLicense": "CC BY-SA 2.0 (Charles Haynes)",
        "imageStatus": "VERIFIED_PHOTOGRAPH",
        "imageType": "AUTHENTIC_PHOTOGRAPH",
        "isAvailable": true,
        "isPublished": true,
        "isArchived": false,
        "needsVerification": false,
        "hasHistoricalOrders": true,
        "historicalOrderCount": 42
      }
    ],
    "pagination": {
      "total": 96,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

---

### 2.2 Get Food By ID
`GET /api/v1/admin/foods/:id`

Retrieves single food record with detailed audit information, variants, image attribution, and historical order references.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Admin food item retrieved successfully",
  "data": {
    "food": {
      "_id": "673cf10b2984123456789abc",
      "name": "Chicken 65",
      "nameTamil": "சிக்கன் 65",
      "nameEnglish": "Chicken 65",
      "price": 240,
      "pricePaise": 24000,
      "effectivePrice": 192,
      "effectivePricePaise": 19200,
      "isDiscountActive": true,
      "hasHistoricalOrders": true,
      "historicalOrderCount": 42
    }
  }
}
```

---

### 2.3 Create Food Item
`POST /api/v1/admin/foods`

#### Request Body
```json
{
  "name": "Chettinad Pepper Chicken",
  "nameTamil": "செட்டிநாடு மிளகு சிக்கன்",
  "nameEnglish": "Chettinad Pepper Chicken",
  "description": "Succulent chicken sautéed with fresh ground black pepper, shallots, and curry leaves",
  "price": 250,
  "category": "673cf10b2984123456789001",
  "isVeg": false,
  "portion": "Standard Bowl",
  "prepTimeMinutes": 18,
  "variants": [
    { "name": "Bone", "price": 250 },
    { "name": "Boneless", "price": 275 }
  ],
  "discount": {
    "type": "PERCENTAGE",
    "value": 10,
    "isActive": true
  },
  "isAvailable": true,
  "isPublished": true,
  "tags": ["chettinad", "pepper-fry", "chef-special"]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Food item created successfully",
  "data": {
    "food": {
      "_id": "673cf10b2984123456789def",
      "name": "Chettinad Pepper Chicken",
      "price": 250,
      "pricePaise": 25000,
      "effectivePrice": 225,
      "effectivePricePaise": 22500,
      "isDiscountActive": true
    }
  }
}
```

---

### 2.4 Update Food Item (Partial Update)
`PATCH /api/v1/admin/foods/:id`

Allows partial updates of names, prices, categories, variants, and discounts.

#### Request Body (Example: Updating Discount & Price)
```json
{
  "price": 260,
  "discount": {
    "type": "FIXED_AMOUNT",
    "value": 30,
    "startsAt": "2026-10-20T00:00:00.000Z",
    "endsAt": "2026-11-05T23:59:59.000Z",
    "isActive": true
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Food item updated successfully",
  "data": {
    "food": {
      "_id": "673cf10b2984123456789def",
      "name": "Chettinad Pepper Chicken",
      "price": 260,
      "pricePaise": 26000,
      "effectivePrice": 230,
      "effectivePricePaise": 23000,
      "isDiscountActive": true,
      "discountApplied": {
        "type": "FIXED_AMOUNT",
        "value": 30,
        "discountAmount": 30,
        "discountAmountPaise": 3000
      }
    }
  }
}
```

---

### 2.5 Quick Publication Toggle
`PATCH /api/v1/admin/foods/:id/publish`

Dedicated fast toggle for publish/draft state.

#### Request Body
```json
{
  "isPublished": true
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Food item 'Chettinad Pepper Chicken' publication status set to true",
  "data": {
    "food": {
      "_id": "673cf10b2984123456789def",
      "isPublished": true
    }
  }
}
```

---

### 2.6 Quick Availability (86 / Sold-Out) Toggle
`PATCH /api/v1/admin/foods/:id/availability`

Dedicated fast toggle for kitchen stock status.

#### Request Body
```json
{
  "isAvailable": false
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Food item 'Chettinad Pepper Chicken' availability set to false",
  "data": {
    "food": {
      "_id": "673cf10b2984123456789def",
      "isAvailable": false
    }
  }
}
```

---

### 2.7 Safely Archive Food Item (Archive-Only Deletion Policy)
`DELETE /api/v1/admin/foods/:id`

To prevent orphaned foreign-key references and eliminate race conditions with simultaneous customer checkouts, food dishes are **safely retired and archived** rather than permanently deleted from MongoDB.

- Sets `isArchived: true`
- Sets `isAvailable: false`
- Sets `isPublished: false`
- Preserves all historical order snapshots and foreign-key references.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Food item 'Chettinad Pepper Chicken' has been safely archived and retired from the menu.",
  "data": {
    "id": "673cf10b2984123456789def",
    "archived": true,
    "deleted": false,
    "isArchived": true,
    "isAvailable": false,
    "isPublished": false,
    "historicalOrderCount": 18
  }
}
```

---

### 2.8 Secure Image Upload & Metadata Management
`POST /api/v1/admin/foods/:id/image`

Accepts either a **base64 image upload** (validated server-side against genuine JPEG, PNG, or WebP magic bytes) or an **approved image URL**.

#### Option A: Direct File Upload (Base64)
```json
{
  "imageBase64": "/9j/4AAQSkZJRgABAQEASABIAAD...",
  "imageAlt": "Official New Moorthi Cafe Butter Chicken",
  "imageSource": "RESTAURANT_DIRECT_UPLOAD",
  "imageLicense": "PROPRIETARY_RESTAURANT"
}
```

#### Option B: Approved Image URL
```json
{
  "imageUrl": "/images/menu/paneer_butter_masala.jpg",
  "imageAlt": "Paneer Butter Masala curry",
  "imageSource": "https://commons.wikimedia.org/wiki/File:Paneer_Butter_Masala.jpg",
  "imageLicense": "CC BY-SA 4.0",
  "imageStatus": "VERIFIED_PHOTOGRAPH"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Food image successfully updated",
  "data": {
    "food": {
      "_id": "673cf10b2984123456789def",
      "imageUrl": "/images/uploads/food-673cf10b2984123456789def-1729450000000.jpg",
      "imageAlt": "Official New Moorthi Cafe Butter Chicken",
      "imageType": "AUTHENTIC_PHOTOGRAPH",
      "imageStatus": "VERIFIED_ACTIVE"
    }
  }
}
```

---

## 3. Error Handling Contract

| HTTP Status | Error Scenario | Sample Payload |
| :--- | :--- | :--- |
| `400 Bad Request` | Discount validation failure | `{"success": false, "message": "Discount validation failed", "errors": [{"field": "discount.value", "message": "Percentage discount must be greater than 0 and at most 100%"}]}` |
| `400 Bad Request` | Fixed discount > price | `{"success": false, "message": "Discount validation failed", "errors": [{"field": "discount.value", "message": "Fixed discount (₹300) cannot exceed item price (₹240)"}]}` |
| `400 Bad Request` | Invalid image content / fake extension | `{"success": false, "message": "Invalid image content. Only authentic JPEG, PNG, or WebP image files are permitted."}` |
| `401 Unauthorized` | Missing / invalid JWT token | `{"success": false, "message": "Authentication required. Please log in."}` |
| `403 Forbidden` | Authenticated customer accessing admin API | `{"success": false, "message": "Access forbidden: Requires admin privileges"}` |
| `404 Not Found` | Food or Category ID does not exist | `{"success": false, "message": "Food item not found"}` |

---

## 4. Frontend Integration Guidance

1. **Role Enforcement:**
   - Always include the Bearer token in Axios / fetch headers:
     ```typescript
     const headers = { Authorization: `Bearer ${token}` };
     ```
   - Do not display admin buttons to regular customers; if a customer attempts an admin action, the server returns `403 Forbidden`.

2. **Deleting Dishes / UI Warning Dialog:**
   - Before calling `DELETE /api/v1/admin/foods/:id`, check `food.hasHistoricalOrders` or `food.historicalOrderCount`.
   - If `historicalOrderCount > 0`, present the dialog:
     > *"This dish appears in past orders. Deleting it will safely archive and unpublish it to preserve customer order receipts."*

3. **Displaying Prices & Badges:**
   - Always display `food.effectivePrice`.
   - If `food.isDiscountActive === true`, show regular `food.price` with a strike-through (`line-through`) and render a discount tag (e.g. `20% OFF` or `₹30 OFF`).
   - If `food.isPublished === false`, render a yellow `DRAFT` pill.
   - If `food.isAvailable === false`, render a red `SOLD OUT` pill.
   - If `food.isArchived === true`, render a grey `ARCHIVED` pill.

4. **Empty State Guidance:**
   - If `/api/v1/admin/foods?category=...&isPublished=...` returns `foods: []`, display an empty state illustrations with a *"No dishes match your active filter"* message and a *"Clear Filters"* button.
