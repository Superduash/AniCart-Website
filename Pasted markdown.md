# AniCartAi — Express.js Backend Build Prompt

## Project Context

I have a fully built React frontend for **AniCartAi**, an anime-themed e-commerce wallpaper store. I need you to build the complete backend using **Express.js** following the **MVC pattern**. The backend must be production-grade, well-structured, and ready to connect with my existing React client.

---

## Tech Stack (Strict)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Auth:** JWT (jsonwebtoken) + bcrypt for password hashing
- **CORS:** cors package (configured for the React client on port 3000)
- **Validation:** express-validator
- **Environment:** dotenv
- **File uploads (if needed):** multer
- **Rate limiting:** express-rate-limit
- **HTTP security headers:** helmet
- **Logging:** morgan
- **Cookie parsing:** cookie-parser

Do NOT use any packages beyond these unless absolutely necessary. Prioritize lightweight, well-maintained, high-performance npm modules.

---

## Project Directory Structure

```
server/
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── routers/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── db/
│   └── connect.js
├── utils/
│   ├── generateToken.js
│   ├── apiResponse.js
│   ├── apiError.js
│   └── constants.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   ├── validateRequest.js
│   └── rateLimiter.js
├── config/
│   └── index.js
├── seed/
│   └── seedProducts.js
├── .env
├── .env.example
├── server.js
└── package.json
```

---

## Database: MongoDB

- **Database name:** `AniCartAi`
- **Connection:** Use Mongoose with proper connection options (retry logic, connection pooling)
- **Graceful shutdown:** Close the DB connection on SIGINT/SIGTERM

---

## Data Models

### User
```
- name: String (required, min 2 chars, trimmed)
- email: String (required, unique, lowercase, validated)
- password: String (required, min 8 chars, hashed with bcrypt before save)
- avatar: String (default: first letter of name, uppercase)
- role: String (enum: ['user', 'admin'], default: 'user')
- points: Number (default: 150)
- streakDays: Number (default: 1)
- purchasesCount: Number (default: 0)
- library: [ObjectId ref: 'Product'] (purchased wallpapers)
- timestamps: true
```

### Product
```
- name: String (required) — e.g., "Itadori Yuji — Cursed Pulse"
- series: String (required) — e.g., "Jujutsu Kaisen"
- price: Number (required, min 0)
- badge: String — e.g., "HOT", "NEW", "BESTSELLER", "CLASSIC", "PREMIUM"
- badgeType: String (enum: ['neon', 'pink'])
- rating: Number (default: 0, min 0, max 5)
- reviews: Number (default: 0)
- img: String (required, URL)
- resolution: String — e.g., "4K Ultra HD", "2K HD"
- tags: [String]
- isActive: Boolean (default: true)
- timestamps: true
```

### Cart (stored per user in DB, not just localStorage)
```
- user: ObjectId ref 'User' (required, unique — one cart per user)
- items: [{
    product: ObjectId ref 'Product',
    qty: Number (min 1, default 1)
  }]
- timestamps: true
```

### Order
```
- user: ObjectId ref 'User' (required)
- items: [{
    product: ObjectId ref 'Product',
    name: String,
    price: Number,
    qty: Number,
    img: String
  }]
- subtotal: Number
- tax: Number
- total: Number
- status: String (enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending')
- timestamps: true
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Route       | Description                    | Auth |
|--------|-------------|--------------------------------|------|
| POST   | /register   | Create new user account        | No   |
| POST   | /login      | Login, return JWT + user data  | No   |
| POST   | /logout     | Clear refresh token cookie     | Yes  |
| GET    | /me         | Get current logged-in user     | Yes  |

### Users — `/api/users`
| Method | Route        | Description              | Auth |
|--------|--------------|--------------------------|------|
| GET    | /profile     | Get user profile         | Yes  |
| PUT    | /profile     | Update display name etc. | Yes  |
| PUT    | /password    | Change password          | Yes  |

### Products — `/api/products`
| Method | Route        | Description                              | Auth  |
|--------|--------------|------------------------------------------|-------|
| GET    | /            | List all products (supports ?series= filter, pagination) | No    |
| GET    | /:id         | Get single product by ID                 | No    |
| POST   | /            | Create product (admin only)              | Admin |
| PUT    | /:id         | Update product (admin only)              | Admin |
| DELETE | /:id         | Soft-delete product (admin only)         | Admin |

### Cart — `/api/cart`
| Method | Route        | Description                   | Auth |
|--------|--------------|-------------------------------|------|
| GET    | /            | Get user's cart (populated)   | Yes  |
| POST   | /add         | Add product to cart           | Yes  |
| PUT    | /update      | Update item quantity          | Yes  |
| DELETE | /remove/:productId | Remove item from cart   | Yes  |
| DELETE | /clear       | Clear entire cart             | Yes  |

### Orders — `/api/orders`
| Method | Route        | Description                    | Auth |
|--------|--------------|--------------------------------|------|
| POST   | /checkout    | Create order from cart, clear cart, add to library | Yes |
| GET    | /            | Get user's order history       | Yes  |
| GET    | /:id         | Get single order detail        | Yes  |

---

## Authentication & Security Requirements

1. **JWT Strategy:**
   - Access token: Short-lived (15 minutes), sent in response body
   - Refresh token: Long-lived (7 days), stored as httpOnly secure cookie
   - Include a `/api/auth/refresh` endpoint to issue new access tokens
2. **Password hashing:** bcrypt with salt rounds of 12
3. **Auth middleware:** Verify JWT from `Authorization: Bearer <token>` header. Attach `req.user` with `{ id, email, role }`
4. **Role-based access:** Admin middleware that checks `req.user.role === 'admin'`
5. **Rate limiting:** Apply to auth routes (max 10 requests per 15 minutes per IP)
6. **Input validation:** Use express-validator on all POST/PUT routes. Return clear error messages
7. **Helmet:** Apply to all routes for security headers
8. **CORS:** Allow origin `http://localhost:3000` with credentials

---

## Response Format (Consistent)

All API responses must follow this shape:

**Success:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Email is required" }]
}
```

---

## Error Handling

- Create a custom `ApiError` class that extends `Error` with `statusCode` and `errors` array
- Global error-handling middleware in `middleware/errorHandler.js`
- Catch async errors using a `catchAsync` wrapper utility (no unhandled promise rejections)
- Handle Mongoose validation errors, duplicate key errors, and cast errors gracefully
- In development: return full error stack. In production: return clean messages only

---

## Seed Script

Create `seed/seedProducts.js` that:
- Connects to MongoDB
- Drops the existing products collection
- Inserts these 8 products matching the frontend data:

```js
[
  { name: "Itadori Yuji — Cursed Pulse", series: "Jujutsu Kaisen", price: 4.99, badge: "HOT", badgeType: "neon", rating: 4.9, reviews: 234, img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop", resolution: "4K Ultra HD", tags: ["Action", "Dark Fantasy"] },
  { name: "Mikasa Ackerman — Titan's Edge", series: "Attack on Titan", price: 3.99, badge: "NEW", badgeType: "pink", rating: 4.8, reviews: 189, img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop", resolution: "4K Ultra HD", tags: ["Action", "Post-Apocalyptic"] },
  { name: "Nezuko — Bamboo Blossom", series: "Demon Slayer", price: 5.99, badge: "BESTSELLER", badgeType: "neon", rating: 5.0, reviews: 412, img: "https://images.unsplash.com/photo-1492576540313-31ad3a64ba5e?w=400&h=300&fit=crop", resolution: "4K Ultra HD", tags: ["Fantasy", "Adventure"] },
  { name: "Naruto — Nine-Tails Awakening", series: "Naruto Shippuden", price: 3.49, badge: "CLASSIC", badgeType: "neon", rating: 4.7, reviews: 567, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop", resolution: "2K HD", tags: ["Action", "Ninja"] },
  { name: "Gojo Satoru — Infinity Veil", series: "Jujutsu Kaisen", price: 6.99, badge: "PREMIUM", badgeType: "pink", rating: 4.9, reviews: 321, img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop", resolution: "4K Ultra HD", tags: ["Action", "Supernatural"] },
  { name: "Levi Ackerman — Thunder Spear", series: "Attack on Titan", price: 4.49, badge: "NEW", badgeType: "neon", rating: 4.8, reviews: 276, img: "https://images.unsplash.com/photo-1547636780-9b865e394b50?w=400&h=300&fit=crop", resolution: "4K Ultra HD", tags: ["Action", "Drama"] },
  { name: "Luffy — Gear Fifth", series: "One Piece", price: 5.49, badge: "HOT", badgeType: "pink", rating: 4.9, reviews: 398, img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop", resolution: "4K Ultra HD", tags: ["Adventure", "Comedy"] },
  { name: "Zoro — Asura Phantom", series: "One Piece", price: 4.99, badge: "CLASSIC", badgeType: "neon", rating: 4.7, reviews: 245, img: "https://images.unsplash.com/photo-1580130732478-4e339fb33746?w=400&h=300&fit=crop", resolution: "2K HD", tags: ["Action", "Adventure"] }
]
```

Also create a default admin user: `{ name: "Admin", email: "admin@anicart.com", password: "Admin@1234", role: "admin" }`

---

## .env.example

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/AniCartAi
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
```

---

## package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed/seedProducts.js"
  }
}
```

---

## Implementation Rules

1. **Every controller function** must use the `catchAsync` wrapper — no raw try/catch blocks in controllers
2. **Never return the password field** in any user response. Use Mongoose `select('-password')` or `.toJSON()` transform
3. **Populate references** where needed (cart items should return full product details)
4. **Index frequently queried fields:** `User.email`, `Product.series`, `Cart.user`, `Order.user`
5. **Use HTTP status codes correctly:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict for duplicate email), 422 (Validation Error), 500 (Server Error)
6. **server.js** should be clean — import routes, apply middleware, connect DB, start server. No business logic in the entry file
7. **All file-level and function-level code must have clear comments** explaining purpose
8. Write **every single file** — do not skip any. Every file in the directory structure above must be fully implemented

---

## Frontend Integration Notes

The React client currently uses:
- `localStorage` for auth and cart persistence — this will be replaced by API calls + JWT
- Demo users array for login — replace with real MongoDB user lookup
- Hardcoded `PRODUCTS_DATA` array in `App.js` — replace with `GET /api/products` fetch
- Client-side cart state — sync with server-side cart via API
- Pages: LandingPage, LoginPage, SignupPage, Dashboard (with tabs: Overview, Cart, Library, Profile)
- Axios is already installed on the client (`axios: ^1.13.6`)
- Client runs on port 3000, so backend should run on port 5000

The frontend expects product objects in this shape:
```json
{
  "id": "...",
  "name": "Itadori Yuji — Cursed Pulse",
  "series": "Jujutsu Kaisen",
  "price": 4.99,
  "badge": "HOT",
  "badgeType": "neon",
  "rating": 4.9,
  "reviews": 234,
  "img": "https://...",
  "resolution": "4K Ultra HD",
  "tags": ["Action", "Dark Fantasy"]
}
```

Map MongoDB `_id` to `id` in the API response using a Mongoose `toJSON` virtual or transform.

---

## Summary

Build a **complete, working, enterprise-quality Express.js backend** for AniCartAi. Every file must be production-ready with proper error handling, validation, security, and clean code. The backend should be ready to `npm install && npm run seed && npm run dev` and immediately work with the React frontend after minor client-side refactoring to use API calls instead of localStorage.