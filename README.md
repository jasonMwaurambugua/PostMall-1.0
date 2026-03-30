# PostMall Backend API

> Node.js + Express + MongoDB REST API for PostMall — Nairobi's Social Commerce Platform

## Folder Structure

```
postmall-backend/
├── config/
│   └── db.js                 # MongoDB Atlas connection
├── middleware/
│   └── auth.js               # JWT protect / restrictTo / optionalAuth
├── models/
│   ├── User.js
│   ├── Store.js
│   ├── Post.js
│   └── Product.js
├── routes/
│   ├── auth.js               # /register /login /me
│   ├── posts.js              # feed, likes, comments
│   ├── stores.js             # CRUD, follow, reviews
│   ├── products.js           # list, filter, search
│   └── ai.js                 # Lana AI proxy
├── seed/
│   └── seed.js               # Nairobi test data
├── server.js
├── .env.example
└── package.json
```

## Quick Start

```bash
git clone https://github.com/yourname/postmall-backend
cd postmall-backend
npm install
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm run seed             # seed the database
npm run dev              # http://localhost:5000
```

## GitHub Codespaces

```bash
npm install
cp .env.example .env
code .env                # fill in values
npm run seed
npm run dev
# Ports tab → port 5000 → set Public → copy URL for frontend
```

## Test Credentials (post-seed)

| Email | Password | Role |
|-------|----------|------|
| customer@postmall.co.ke | password123 | Customer |
| jason@postmall.co.ke | password123 | Merchant |
| kevin@postmall.co.ke | password123 | Merchant |

## Deploy → Render.com

Build: `npm install` · Start: `npm start` · Add all .env vars in dashboard
