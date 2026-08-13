# Admin Product API

Base path: `/api/admin/products`
Auth required: Yes — `token` cookie, role `ADMIN`

All responses use DTOs (`ProductResponse`, `VariantResponse`, `ImageResponse`) — never raw JPA entities — to avoid lazy-loading serialization errors and to keep internal fields (like S3 keys) out of the response.

---

## GET /api/admin/products

Returns all products.

**Response — 200 OK**
```json
[
  {
    "id": 1,
    "name": "Kashmir White Granite",
    "description": "Premium natural granite slab",
    "category": { "id": 1, "name": "Granite" },
    "materialType": "NATURAL_STONE",
    "origin": "Rajasthan, India",
    "pricingUnit": "PER_SQFT",
    "basePrice": 120.00,
    "discountPrice": null,
    "stockStatus": "IN_STOCK",
    "totalStockQuantity": 45,
    "active": true,
    "variants": [],
    "images": [],
    "createdAt": "2026-08-12T21:40:00",
    "updatedAt": "2026-08-12T21:40:00"
  }
]
```

---

## GET /api/admin/products/{id}

Returns a single product with its variants and images.

**Response — 200 OK**
```json
{
  "id": 1,
  "name": "Kashmir White Granite",
  "description": "Premium natural granite slab",
  "category": { "id": 1, "name": "Granite" },
  "materialType": "NATURAL_STONE",
  "origin": "Rajasthan, India",
  "pricingUnit": "PER_SQFT",
  "basePrice": 120.00,
  "discountPrice": 99.00,
  "stockStatus": "IN_STOCK",
  "totalStockQuantity": 45,
  "active": true,
  "variants": [
    {
      "id": 1,
      "size": "600x600 mm",
      "finish": "POLISHED",
      "thicknessMm": 18.0,
      "priceAdjustment": 10.00,
      "stockQuantity": 20,
      "sku": "KWG-600-POL-18"
    }
  ],
  "images": [
    {
      "id": 1,
      "imageUrl": "https://your-bucket.s3.ap-south-1.amazonaws.com/products/uuid.jpg",
      "isPrimary": true,
      "displayOrder": 1
    }
  ],
  "createdAt": "2026-08-12T21:40:00",
  "updatedAt": "2026-08-12T21:40:00"
}
```

**Response — 404 Not Found**
```json
{ "success": false, "message": "Product not found: 1" }
```

---

## POST /api/admin/products

Creates a new product. Stock status is auto-derived from `totalStockQuantity` (below 10 = `LOW_STOCK`, 0 = `OUT_OF_STOCK`, else `IN_STOCK`).

**Request body**
```json
{
  "name": "Kashmir White Granite",
  "description": "Premium natural granite slab",
  "categoryId": 1,
  "materialType": "NATURAL_STONE",
  "origin": "Rajasthan, India",
  "pricingUnit": "PER_SQFT",
  "basePrice": 120.00,
  "totalStockQuantity": 45
}
```

**Response — 200 OK** — same shape as `GET /{id}` (with empty `variants`/`images` initially)

**Response — 404 Not Found** (invalid `categoryId`)
```json
{ "success": false, "message": "Category not found: 1" }
```

---

## PUT /api/admin/products/{id}

Updates a product. Same request body as create; all fields are replaced.

**Request body** — same as `POST`

**Response — 200 OK** — updated `ProductResponse`

---

## DELETE /api/admin/products/{id}

Soft-deletes a product (sets `active = false`). Does not remove the row — preserves referential integrity with existing orders.

**Response — 200 OK**
```json
{ "success": true, "message": "Product deactivated" }
```

---

## POST /api/admin/products/{id}/images

Uploads an image to S3 and links it to the product. `multipart/form-data`, not JSON.

**Form fields**
| Field | Type | Required |
|---|---|---|
| `file` | file | Yes |
| `isPrimary` | boolean | No (default `false`) |
| `displayOrder` | integer | No |

**curl example**
```bash
curl -X POST http://localhost:8081/api/admin/products/1/images \
  -b "token=<admin JWT>" \
  -F "file=@/path/to/image.jpg" \
  -F "isPrimary=true" \
  -F "displayOrder=1"
```

**Response — 200 OK**
```json
{
  "id": 1,
  "imageUrl": "https://your-bucket.s3.ap-south-1.amazonaws.com/products/uuid.jpg",
  "isPrimary": true,
  "displayOrder": 1
}
```

---

## DELETE /api/admin/products/images/{imageId}

Deletes an image — removes it from S3 and from the database.

**Response — 200 OK**
```json
{ "success": true, "message": "Image deleted" }
```

**Response — 404 Not Found**
```json
{ "success": false, "message": "Image not found: 1" }
```

---

## PUT /api/admin/products/{id}/stock

Updates total stock quantity. Stock status is re-derived automatically.

**Request body**
```json
{ "totalStockQuantity": 60 }
```

**Response — 200 OK** — updated `ProductResponse`

---

## PUT /api/admin/products/{id}/price

Updates the base price.

**Request body**
```json
{ "basePrice": 135.00 }
```

**Response — 200 OK** — updated `ProductResponse`

---

## PUT /api/admin/products/{id}/discount

Sets or clears a discount price. Pass `discountPrice: null` to remove an existing discount.

**Request body**
```json
{ "discountPrice": 99.00 }
```

**Response — 200 OK** — updated `ProductResponse`

---

## POST /api/admin/products/{id}/variants

Adds a variant (size/finish/thickness combination) to a product.

**Request body**
```json
{
  "size": "600x600 mm",
  "finish": "POLISHED",
  "thicknessMm": 18.0,
  "priceAdjustment": 10.00,
  "stockQuantity": 20,
  "sku": "KWG-600-POL-18"
}
```

**Response — 200 OK**
```json
{
  "id": 1,
  "size": "600x600 mm",
  "finish": "POLISHED",
  "thicknessMm": 18.0,
  "priceAdjustment": 10.00,
  "stockQuantity": 20,
  "sku": "KWG-600-POL-18"
}
```

---

## Enum reference

| Enum | Values |
|---|---|
| `MaterialType` | `NATURAL_STONE`, `CERAMIC`, `VITRIFIED`, `PORCELAIN` |
| `PricingUnit` | `PER_SQFT`, `PER_SLAB`, `PER_BOX`, `PER_PIECE` |
| `StockStatus` | `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`, `MADE_TO_ORDER` (auto-derived, not settable directly) |
| `Finish` | `POLISHED`, `HONED`, `MATTE`, `LEATHERED`, `FLAMED`, `RIVER_WASHED` |

---

## Notes

- All list/detail responses use DTOs, not entities — avoids Hibernate lazy-initialization errors and keeps internal fields (e.g. S3 object key) out of the API surface.
- Images are stored in S3 under the `products/` prefix with a randomly generated filename; deleting a `ProductImage` also deletes the underlying S3 object.
- `category` on `Product` is `LAZY` fetch — safe because responses go through the DTO mapper inside a `@Transactional` service method, not serialized directly from the entity.
- There is currently no endpoint to delete a variant or edit an existing variant/image — only add. Add `PUT`/`DELETE` for variants if you need to correct a mistake without deleting and recreating the whole product.