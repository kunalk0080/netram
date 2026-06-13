# Nayanaa 👁️

**Clear vision for every village.** A Lenskart-style eyewear store for rural India — free eye
checkups, affordable glasses, and referrals to [Sri Sai Eye Hospital, Patna](https://srisaieyehospital.com/)
for serious cases. Apple-minimal, light-mode, English + हिंदी.

## Stack
- **Frontend:** Vite + React + TypeScript + Tailwind, `react-router`, `react-i18next`, Firebase Auth
- **Backend:** Node + Express + Mongoose
- **DB:** MongoDB (Atlas in prod) — **Hosting:** Firebase (frontend) + Render (API)

## Quick start (no external infra)

The fastest way to see the whole thing run — uses an in-memory MongoDB and built-in dev auth,
so **no MongoDB and no Firebase setup is required**.

```bash
# Terminal 1 — API (auto-seeds 18 products + 3 coupons into an in-memory DB)
cd backend && npm install && npm run dev:mem

# Terminal 2 — Frontend
cd frontend && npm install && cp .env.example .env && npm run dev
```

Open http://localhost:5173.

- **Login** works in *demo mode*: any mobile number / OTP / email logs you in instantly.
- **Coupons** to try: `NAYANAA10` (10% off), `FLAT200` (₹200 off ≥ ₹999), `GRAM50` (₹50 off).
- **Payments** are simulated: UPI/Card mark the order *paid*; COD places a *pending* order.

## Run with a real database

```bash
cd backend
cp .env.example .env          # set MONGO_URI (local mongod or Atlas)
npm run seed                  # load products + coupons
npm run dev                   # http://localhost:4000
```

## Enable real Firebase auth (phone OTP + email)

Fill the `VITE_FIREBASE_*` keys in `frontend/.env` and paste your service-account JSON into
`FIREBASE_SERVICE_ACCOUNT_JSON` in `backend/.env`. With these set, the app verifies real Firebase
ID tokens; without them it stays in demo mode.

## Verify

```bash
cd backend && npm run verify    # 17 end-to-end API checks (in-memory DB)
cd frontend && npm run build    # strict type-check + production bundle
```

## Deploy

**Frontend → Firebase Hosting**
```bash
cd frontend && npm run build
firebase deploy --only hosting        # uses firebase.json (public: dist, SPA rewrite)
```
Set `VITE_API_URL` to the deployed Render URL before building.

**Backend → Render**
Push the repo and create a Render web service from `backend/render.yaml`. Set env vars
`MONGO_URI` (Atlas), `CORS_ORIGIN` (your Firebase URL), and optionally `FIREBASE_SERVICE_ACCOUNT_JSON`.

## Project structure
```
backend/   Express API — models, routes, firebase-admin auth, seed, in-memory dev runner
frontend/  React app — pages/, components/, context/ (cart+auth), i18n/ (en+hi), lib/ (api+firebase)
```

## V1 scope
Catalogue · search/filter · product detail · quick-peek · cart · coupons · login · address ·
simulated checkout (UPI/Card/COD) · order history · custom frame request (7-day sourcing) ·
free eye-checkup booking · hospital referral · EN/हिं toggle.

_Out of scope for V1: real payment gateway (Razorpay-ready), admin dashboard, order tracking, virtual try-on._
