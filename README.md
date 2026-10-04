# Bucket: Express Products API with Caching

A simple Express application that serves products from a JSON file, with an in-memory cache built as middleware. The code is organized in layers.

## Request Flow

```
Route → Middleware → Controller → Service → Database
```

| Layer | Responsibility |
|---|---|
| Route | Maps HTTP method and path to middleware and a controller |
| Middleware | Cache lookup (GET) and cache invalidation (POST/PUT/PATCH/DELETE) |
| Controller | Handles request and response, validation, status codes |
| Service | Business logic (find, create, update, delete products) |
| Database | Reads and writes `db.json` |

## Project Structure

```
bucket/
├── server.js
├── db.json
├── package.json
├── routes/
│   └── productRoutes.js
├── middleware/
│   └── cache.js
├── controllers/
│   └── productController.js
├── services/
│   └── productService.js
└── database/
    └── db.js
```

## Getting Started

```bash
npm install express
node server.js
```

The server runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description | Cached |
|---|---|---|---|
| GET | `/products` | Get all products | Yes |
| GET | `/products/:id` | Get a product by id | Yes |
| POST | `/products` | Create a product (`name`, `price`) | Invalidates cache |
| PUT | `/products/:id` | Replace a product (`name`, `price`) | Invalidates cache |
| PATCH | `/products/:id` | Update `name` and/or `price` | Invalidates cache |
| DELETE | `/products/:id` | Delete a product | Invalidates cache |

## Caching

### How it works
- `cacheMiddleware` runs before the controller on every GET route.
- The cache key is the request URL (for example `/products` or `/products/2`).
- Each cache entry is stored as `{ data, createdAt }`.
- Only `200` responses are cached. A `404` is never cached.

### Cache headers
Every GET response includes an `X-Cache` header:

| Value | Meaning |
|---|---|
| `X-Cache: MISS` | Data came from the database and was stored in the cache |
| `X-Cache: HIT` | Data was served from the cache |

### TTL (Time To Live)
- The TTL is **1 minute**.
- On each request, the middleware compares `Date.now() - createdAt` with the TTL.
- If the entry is older than 1 minute, it is deleted and not used. The request goes to the database, returns a `MISS`, and the fresh value is stored in the cache again.

### Invalidation
- `invalidateCache` runs on POST, PUT, PATCH and DELETE.
- When a write finishes with a `2xx` status, **the entire cache is cleared**. This covers `/products` and every `/products/:id`, because any of them could be stale.
- Failed writes (400, 404, 500) do not clear the cache, since no data changed.

### Race-condition protection
If a GET is waiting on the database while a write clears the cache, the GET would store old data. A `version` counter prevents this. The GET only caches its result if no invalidation happened while it was fetching.

## Testing

The database read has an artificial 2-second delay (`database/db.js`), so cache hits are easy to see.

```bash
# First call: ~2s, X-Cache: MISS
curl -i http://localhost:3000/products

# Second call within 1 minute: instant, X-Cache: HIT
curl -i http://localhost:3000/products

# Create a product (clears the cache)
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Keyboard","price":49.99}'

# Next GET is a MISS again, with fresh data
curl -i http://localhost:3000/products

# Single product
curl -i http://localhost:3000/products/1

# Replace a product
curl -i -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Mechanical Keyboard","price":79.99}'

# Partial update
curl -i -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":59.99}'

# Delete
curl -i -X DELETE http://localhost:3000/products/1
```

To test the TTL, make a GET, wait more than 60 seconds, and make the same GET again. The header will show `MISS`.

## Error Responses

| Status | When |
|---|---|
| 400 | Invalid id, or missing or invalid body fields |
| 404 | Product not found |
| 500 | File read or write failure |

## Notes
- The cache is in memory, so it resets when the server restarts.
- New product ids use `max id + 1` to avoid duplicates after deletions.
- `db.json` is the data store. Writes replace the whole file.
