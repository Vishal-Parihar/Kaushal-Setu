# 🪡 KaushalSetu — Digital Marketplace for Local Micro-Entrepreneurs

> *Kaushal* (skill) + *Setu* (bridge) = Bridging India's artisans with customers.

## Tech Stack
- **Frontend**: React.js · Tailwind CSS · React Router · Axios · React Hot Toast
- **Backend**: Node.js · Express.js · JWT Auth · Helmet · Morgan
- **Database**: MongoDB Atlas (cloud) via Mongoose
- **Fonts**: Sora + Noto Serif Devanagari

---

## Project Structure
```
kaushalsetu/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Navbar, Footer, Cards, Badges
│       ├── context/      # AuthContext (JWT)
│       ├── pages/        # Home, Explore, Marketplace, Dashboards, Admin
│       └── utils/        # Axios instance
└── server/               # Express backend
    ├── config/           # MongoDB connection
    ├── controllers/      # Auth, Entrepreneur, Product, Order, ServiceRequest, Review, Admin
    ├── middleware/        # JWT protect + authorize
    ├── models/            # User, Entrepreneur, Product, Order, ServiceRequest, Review
    └── routes/            # All API routes
```

---

## Setup

### 1. MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → create free cluster
2. Create a database user + whitelist IP `0.0.0.0/0`
3. Copy the connection string

### 2. Server
```bash
cd server
cp .env.example .env          # or edit .env directly
# Paste your MongoDB URI into MONGODB_URI
npm install
npm run dev                   # runs on :5000
```

### 3. Client
```bash
cd client
cp .env.example .env
npm install
npm start                     # runs on :3000
```

### 4. Create Admin User
After registering any user, update their role in MongoDB Atlas:
```
Database → kaushalsetu → users → find user → set role: "admin"
```

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | JWT | Get current user |
| PUT | /api/auth/profile | JWT | Update profile |
| GET | /api/entrepreneurs | — | List approved artisans |
| GET | /api/entrepreneurs/:id | — | Artisan detail |
| POST | /api/entrepreneurs | JWT | Create artisan profile |
| PUT | /api/entrepreneurs | JWT | Update artisan profile |
| GET | /api/products | — | List products |
| GET | /api/products/:id | — | Product detail |
| POST | /api/products | entrepreneur | Add product |
| PUT | /api/products/:id | entrepreneur | Update product |
| DELETE | /api/products/:id | entrepreneur | Delete product |
| POST | /api/orders | customer | Place order |
| GET | /api/orders/my | JWT | Customer orders |
| GET | /api/orders/entrepreneur | entrepreneur | Artisan orders |
| PUT | /api/orders/:id/status | entrepreneur | Update order status |
| POST | /api/service-requests | customer | Create request |
| GET | /api/service-requests/my | JWT | Customer requests |
| GET | /api/service-requests/entrepreneur | entrepreneur | Artisan requests |
| PUT | /api/service-requests/:id/respond | entrepreneur | Respond to request |
| POST | /api/reviews | JWT | Add review |
| GET | /api/admin/analytics | admin | Platform stats |
| GET | /api/admin/pending-entrepreneurs | admin | Pending approvals |
| PUT | /api/admin/entrepreneurs/:id/approve | admin | Approve/reject |
| GET | /api/admin/users | admin | All users |
| GET | /api/admin/orders | admin | All orders |

---

## User Roles

| Role | Access |
|------|--------|
| `customer` | Browse, place orders, send service requests, review |
| `entrepreneur` | Dashboard, manage products/orders/requests, profile |
| `admin` | Full admin panel, approve artisans, analytics |

---

## Color Scheme
| Token | Hex | Usage |
|-------|-----|-------|
| `saffron` | `#E8650A` | Primary CTA, highlights |
| `teal` | `#0B4F6C` | Headers, nav, footer |
| `cream` | `#FDF6EC` | Page background |
| `cream-dark` | `#F5E8D0` | Cards, subtle bg |

---

## Future Enhancements (from PRD)
- [ ] Mobile apps (React Native)
- [ ] Digital payments (Razorpay integration)
- [ ] Logistics & delivery tracking
- [ ] Skill training & certification modules
- [ ] AI-based artisan recommendations
- [ ] WhatsApp notifications
