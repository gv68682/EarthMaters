# 🌴 EarthMaters

A full-stack e-commerce web app for buying plants, seeds, and garden decor — built with Next.js, MongoDB, and Stripe.

🔗 **Live Site:** [earth-maters.vercel.app](https://earth-maters.vercel.app)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB + Mongoose
- **Auth:** NextAuth.js
- **Payments:** Stripe Checkout
- **Styling:** Custom CSS with glass-morphism design
- **Deployment:** Vercel

---

## Features

- 🛍️ Browse 100+ plants, seeds, and garden products
- 🗂️ Filter by category — Flower Plants, Fruit Plants, Trees, Seeds, Garden Decor
- 🛒 Add to cart with quantity controls
- 💳 Checkout via Stripe
- 🔐 User authentication with NextAuth
- 💾 Cart persistence via localStorage

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Stripe account

### Installation

```bash
git clone https://github.com/your-username/earth-maters.git
cd earth-maters
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Home page
│   ├── products/          # All products page
│   ├── cart/              # Cart page
│   ├── api/
│   │   ├── products/      # Products API
│   │   └── checkout/      # Stripe checkout API
├── components/
│   └── ProductTabs.tsx    # Product grid with category tabs
├── context/
│   └── CartContext.tsx    # Global cart state + localStorage
├── lib/
│   └── mongodb.ts         # MongoDB connection
└── models/
    └── Product.ts         # Mongoose product schema
```

---

## Deployment

Deployed on Vercel. Set the following environment variables in your Vercel project settings:

```
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL=https://your-vercel-url.vercel.app
STRIPE_SECRET_KEY
```

---

## License

MIT
