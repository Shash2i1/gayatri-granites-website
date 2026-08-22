# Customer-Facing API Documentation

Covers everything built so far on the customer side: public product browsing (no auth) and
checkout via Razorpay (auth required). "My Orders" (customer's own order history/invoice)
is not yet built - will be added to this doc once implemented.

---

## Auth reminder (for context when building the frontend)

- Login: redirect the browser to `GET /oauth2/authorization/google` (full page redirect, not fetch).
- After login, an `httpOnly` cookie named `token` is set automatically - the frontend never
  reads or stores this token directly, the browser just sends it on every request.
- All `fetch`/`axios` calls to the backend must include `credentials: "include"` (fetch) or
  `withCredentials: true` (axios), or the cookie won't be sent and you'll get 401s.
- Check login state anytime via `GET /api/me`.

---

# PART 1 — Public Product Browsing

Base path: `/api/products` and `/api/categories`
Auth required: **No** — open to all visitors.

## GET /api/categories

Returns all categories, for building a nav/filter menu.

**Response — 200 OK**
```json
[
  { "id": 1, "name": "Granite", "slug": "granite", "description": "Natural granite slabs" },
  { "id": 2, "name": "Vitrified Tiles", "slug": "vitrified-tiles", "description": "..." }
]
```

---

## GET /api/products

Returns all **active** products in summary form (lighter payload, meant for listing/grid pages).

**Response — 200 OK**
```json
[
  {
    "id": 1,
    "name": "Kashmir White Granite",
    "categoryName": "Granite",
    "materialType": "NATURAL_STONE",
    "pricingUnit": "PER_SQFT",
    "basePrice": 120.00,
    "discountPrice": 99.00,
    "stockStatus": "IN_STOCK",
    "primaryImageUrl": "https://your-bucket.s3.ap-south-1.amazonaws.com/products/uuid.jpg"
  }
]
```

Soft-deleted products (`active = false`) never appear here.

---

## GET /api/products/category/{categoryId}

Same summary shape as above, filtered to one category. Use for category landing pages.

**Response — 404 Not Found** (invalid category id)
```json
{ "success": false, "message": "Category not found: 5" }
```

---

## GET /api/products/search?q={keyword}

Searches active products by name (case-insensitive, partial match).

**Example**
```
GET /api/products/search?q=granite
```

**Response — 200 OK** — array of `ProductSummaryResponse`, same shape as `GET /api/products`.

---

## GET /api/products/{id}

Full product detail — used on the single-product page. Includes all variants and all images
(not just the primary one).

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
    { "id": 1, "imageUrl": "https://.../uuid.jpg", "isPrimary": true, "displayOrder": 1 }
  ],
  "createdAt": "2026-08-12T21:40:00",
  "updatedAt": "2026-08-12T21:40:00"
}
```

**Response — 404 Not Found** — returned both when the product truly doesn't exist and when it
exists but is soft-deleted (`active = false`). Deliberately the same message in both cases so
the frontend/customer can't tell the difference.
```json
{ "success": false, "message": "Product not found: 1" }
```

---

# PART 2 — Checkout (Razorpay)

Base path: `/api/checkout`
Auth required: **Yes** — must be logged in (any role).

The cart itself lives entirely in frontend state (localStorage/React state/etc.) — the backend
never stores a cart. Only at checkout time does the frontend send the list of items.

**Pricing is always calculated server-side** from the current product/variant prices in the DB
and the globally configured GST%/SGST%/shipping charge — the frontend never sends prices, only
`productId` / `variantId` / `quantity`.

## Flow overview

1. Frontend calls `POST /api/checkout/create-order` with cart items + shipping info.
2. Backend computes pricing, creates a Razorpay order, returns payment details.
3. Frontend opens the Razorpay checkout widget using the returned `razorpayOrderId` +
   `razorpayKeyId` + `amountInPaise`.
4. Customer completes payment in the Razorpay widget.
5. Razorpay's widget returns `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`
   to the frontend (via the `handler` callback).
6. Frontend calls `POST /api/checkout/verify-payment` with those three values + the **same**
   cart items + shipping info sent in step 1.
7. Backend verifies the signature, recomputes pricing, creates the real `Order` + `OrderItem`
   rows, returns the full order.

**No order is created until payment is verified** — step 1 does not create a DB order, only a
Razorpay order. Abandoned/failed payments leave no order row behind.

---

## POST /api/checkout/create-order

**Request body**
```json
{
  "items": [
    { "productId": 1, "variantId": 1, "quantity": 5 },
    { "productId": 3, "variantId": null, "quantity": 2 }
  ],
  "shippingAddress": "12 MG Road, Chennai, TN 600001",
  "phoneNumber": "9876543210"
}
```
- `variantId` is optional — omit or send `null` if the product has no variant selected.
- `items` must not be empty.

**Response — 200 OK**
```json
{
  "razorpayOrderId": "order_TSil5BLPnYbD8Y",
  "razorpayKeyId": "rzp_test_xxxxxxxxxxxx",
  "amountInPaise": 131200,
  "currency": "INR",
  "subtotal": 900.00,
  "gstAmount": 81.00,
  "sgstAmount": 81.00,
  "shippingCharge": 250.00,
  "totalAmount": 1312.00
}
```

Use `razorpayOrderId`, `razorpayKeyId`, and `amountInPaise` directly to open the Razorpay JS
widget:
```js
const options = {
  key: response.razorpayKeyId,
  amount: response.amountInPaise,
  currency: response.currency,
  order_id: response.razorpayOrderId,
  handler: function (rzpResponse) {
    // rzpResponse.razorpay_payment_id, .razorpay_order_id, .razorpay_signature
    // -> send these to /api/checkout/verify-payment
  }
};
new Razorpay(options).open();
```

**Response — 400 Bad Request** (empty cart)
```json
{ "success": false, "message": "Cart is empty" }
```

**Response — 404 Not Found** (invalid product/variant id in cart)
```json
{ "success": false, "message": "Product not found: 99" }
```

**Response — 400 Bad Request** (product deactivated since being added to cart, or invalid quantity)
```json
{ "success": false, "message": "Product is no longer available: Kashmir White Granite" }
```

---

## POST /api/checkout/verify-payment

**Request body**
```json
{
  "razorpayOrderId": "order_TSil5BLPnYbD8Y",
  "razorpayPaymentId": "pay_TSimc01YnA8co3",
  "razorpaySignature": "78b75c7364a2def1435ef2a11e51140dec8400d87d9d920f9448dd2b8012895f",
  "items": [
    { "productId": 1, "variantId": 1, "quantity": 5 },
    { "productId": 3, "variantId": null, "quantity": 2 }
  ],
  "shippingAddress": "12 MG Road, Chennai, TN 600001",
  "phoneNumber": "9876543210"
}
```

**IMPORTANT:** `items`, `shippingAddress`, and `phoneNumber` here must exactly match what was
sent to `create-order` for this same checkout attempt. Sending different items here than what
was actually paid for will produce a mismatched order.

**Response — 200 OK** — full `OrderResponse` (same shape as the admin Order API)
```json
{
  "id": 12,
  "userId": 3,
  "userEmail": "customer@example.com",
  "phoneNumber": "9876543210",
  "status": "CONFIRMED",
  "subtotal": 900.00,
  "gstPercentage": 9.00,
  "gstAmount": 81.00,
  "sgstPercentage": 9.00,
  "sgstAmount": 81.00,
  "shippingCharge": 250.00,
  "totalAmount": 1312.00,
  "shippingAddress": "12 MG Road, Chennai, TN 600001",
  "transportDetails": null,
  "refundReason": null,
  "items": [
    {
      "id": 20,
      "productId": 1,
      "productName": "Kashmir White Granite",
      "variantId": 1,
      "variantSku": "KWG-600-POL-18",
      "quantity": 5,
      "priceAtPurchase": 130.00
    }
  ],
  "createdAt": "2026-08-22T12:13:37.868128",
  "updatedAt": "2026-08-22T12:13:37.868128"
}
```

**Response — 400 Bad Request** (signature invalid / tampered / payment not genuine)
```json
{ "success": false, "message": "Payment verification failed" }
```

---

## Notes for frontend implementation

- Cart state (add/remove/update quantity, persist across page reloads) is entirely a frontend
  concern — implement with React state + localStorage, or similar. No backend cart API exists.
- Always re-fetch the product's current price via `GET /api/products/{id}` before checkout if
  the cart was built a while ago (e.g. user left the tab open) — the price shown in cart is
  only a preview; the backend recomputes the authoritative price at checkout regardless.
- Show a loading/processing state between `create-order` and the Razorpay widget opening, and
  between the widget closing and `verify-payment` completing — both involve network round trips.
- Handle the case where the customer closes the Razorpay widget without paying (Razorpay's
  `modal.ondismiss` callback) — no order was created, so just return them to the cart.
- `discountPrice` on a product, if present, is what's actually charged instead of `basePrice` —
  reflect this in the cart/product UI (e.g. strikethrough `basePrice`, show `discountPrice`).