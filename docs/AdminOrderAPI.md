# Admin Order API

Base path: `/api/admin/orders`
Auth required: Yes — `token` cookie, role `ADMIN`

All list/detail responses use DTOs (`OrderResponse`, `OrderItemResponse`) — never raw JPA entities.

---

## Charge fields on Order

Each `Order` stores its own **snapshot** of the percentages and amounts applied to it, rather than pulling live from a global settings table at read time. This means an order's invoice always reflects exactly what was charged, even if global GST/SGST rates change later.

| Field | Meaning |
|---|---|
| `subtotal` | Sum of all order items (`quantity × priceAtPurchase`), before tax/shipping |
| `gstPercentage` | GST % applied to this order (e.g. `9.00` = 9%) |
| `gstAmount` | GST amount in ₹, computed from `subtotal × gstPercentage / 100` |
| `sgstPercentage` | SGST % applied to this order |
| `sgstAmount` | SGST amount in ₹ |
| `shippingCharge` | Flat shipping/other charges in ₹ |
| `totalAmount` | `subtotal + gstAmount + sgstAmount + shippingCharge` — final payable amount |

These values are set when the order is created — there is no separate endpoint to edit charges on an existing order. Since customer-facing checkout isn't built yet, set these directly in test `INSERT` statements to match whatever percentages you're testing with.

---

## GET /api/admin/orders

Returns all orders with full item and charge detail.

**Response — 200 OK**
```json
[
  {
    "id": 1,
    "userId": 1,
    "userEmail": "customer@example.com",
    "phoneNumber": "9876543210",
    "status": "PENDING",
    "subtotal": 8400.00,
    "gstPercentage": 9.00,
    "gstAmount": 756.00,
    "sgstPercentage": 9.00,
    "sgstAmount": 756.00,
    "shippingCharge": 500.00,
    "totalAmount": 10412.00,
    "shippingAddress": "12 MG Road, Chennai, TN 600001",
    "transportDetails": null,
    "refundReason": null,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Kashmir White Granite",
        "variantId": 1,
        "variantSku": "KWG-600-POL-18",
        "quantity": 20,
        "priceAtPurchase": 120.00
      },
      {
        "id": 2,
        "productId": 3,
        "productName": "Vitrified Tile 600x600",
        "variantId": 5,
        "variantSku": "VT-600-MATTE",
        "quantity": 15,
        "priceAtPurchase": 400.00
      }
    ],
    "createdAt": "2026-08-13T10:00:00",
    "updatedAt": "2026-08-13T10:00:00"
  }
]
```

An order can contain items across multiple products/categories (granite + tiles + marble in one order) since `items` is a list.

---

## GET /api/admin/orders/{id}

Returns a single order with full item and charge detail.

**Response — 200 OK** — same shape as one entry above.

**Response — 404 Not Found**
```json
{ "success": false, "message": "Order not found: 1" }
```

---

## PUT /api/admin/orders/{id}/status

Updates the order's status.

**Request body**
```json
{ "status": "CONFIRMED" }
```

Valid values: `PENDING`, `CONFIRMED`, `DISPATCHED`, `DELIVERED`, `CANCELLED`

**Response — 200 OK** — updated `OrderResponse`

---

## PUT /api/admin/orders/{id}/assign-transport

Attaches logistics/transport details (carrier, vehicle, ETA — free text).

**Request body**
```json
{ "transportDetails": "Blue Dart, Vehicle TN-01-AB-1234, ETA 3 days" }
```

**Response — 200 OK** — updated `OrderResponse`

---

## GET /api/admin/orders/{id}/invoice

Generates and downloads a PDF invoice for the order, built from its item list, GST/SGST breakdown, shipping charge, and total.

**Response — 200 OK**
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="invoice-order-{id}.pdf"`
- Body: raw PDF bytes

**curl example**
```bash
curl -X GET http://localhost:8081/api/admin/orders/1/invoice \
  -b "token=<admin JWT>" \
  --output invoice-order-1.pdf
```

**Response — 404 Not Found** (invalid order id)
```json
{ "success": false, "message": "Order not found: 1" }
```

---

## PUT /api/admin/orders/{id}/refund

Processes a refund/cancellation. Sets order status to `CANCELLED` and stores the reason.

**Request body**
```json
{ "refundReason": "Customer requested cancellation" }
```

**Response — 200 OK** — updated `OrderResponse` (status now `CANCELLED`)

**Note:** no payment gateway integration is included — this only updates order state in the DB. Actual money movement depends on whichever payment provider is integrated later (Razorpay/Stripe/etc.).

---

## Order status lifecycle

```
PENDING → CONFIRMED → DISPATCHED → DELIVERED
                    ↘ CANCELLED (via refund, or direct status update)
```

No enforced state machine currently — any status can be set from any status via `PUT /{id}/status`.

---

## Notes

- One order = many items, potentially spanning multiple products/categories — modeled via `items: List<OrderItemResponse>`.
- `priceAtPurchase` on each item and `gstPercentage`/`sgstPercentage`/amounts on the order are all frozen snapshots taken at order-creation time — historical orders and their invoices stay accurate even if product prices or tax rates change later.
- `totalAmount` is a stored, server-computed value — never recalculated live or trusted from client input.
- Invoice generation is now implemented (real PDF, downloaded directly) — previously a stub.
- Since customer-facing checkout doesn't exist yet, test orders are inserted manually via SQL, with charge fields set directly to match whatever rates you're testing.