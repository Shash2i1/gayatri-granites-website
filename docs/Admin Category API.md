# Admin Category API

Base path: `/api/admin/categories`
Auth required: Yes — `token` cookie, role `ADMIN`

---

## GET /api/admin/categories

Returns all categories.

**Response — 200 OK**
```json
[
  {
    "id": 1,
    "name": "Granite",
    "slug": "granite",
    "description": "Natural granite slabs"
  }
]
```

---

## POST /api/admin/categories

Creates a new category.

**Request body**
```json
{
  "name": "Granite",
  "slug": "granite",
  "description": "Natural granite slabs"
}
```

**Response — 200 OK**
```json
{
  "id": 1,
  "name": "Granite",
  "slug": "granite",
  "description": "Natural granite slabs"
}
```

---

## PUT /api/admin/categories/{id}

Updates an existing category. All fields are replaced with the request body values.

**Request body**
```json
{
  "name": "Granite Slabs",
  "slug": "granite-slabs",
  "description": "Updated description"
}
```

**Response — 200 OK**
```json
{
  "id": 1,
  "name": "Granite Slabs",
  "slug": "granite-slabs",
  "description": "Updated description"
}
```

**Response — 404 Not Found** (invalid id)
```json
{
  "success": false,
  "message": "Category not found: 1"
}
```

---

## DELETE /api/admin/categories/{id}

Deletes a category.

**Response — 200 OK**
```json
{
  "success": true,
  "message": "Category deleted"
}
```

**Response — 404 Not Found** (invalid id)
```json
{
  "success": false,
  "message": "Category not found: 1"
}
```

---

## Notes

- `name` is expected to be unique — a duplicate `name` will fail at the DB constraint level (currently surfaces as a generic 500; consider adding an explicit uniqueness check later if you want a cleaner 400 response).
- Deleting a category currently does not check whether products still reference it — deleting a category with existing products will fail at the DB foreign key level once `Product` is wired in. This will be handled properly once Product Management is implemented.