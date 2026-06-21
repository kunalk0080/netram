# Netram — Deployment Guide

**One deployment serves everything.** The Express backend serves the built React app, so a
single Render service hosts both the website and the API at one URL. With **no environment
variables at all**, it runs out of the box:

- **No database setup** — with no `MONGO_URI`, the server boots an ephemeral in-memory MongoDB
  and auto-seeds products + coupons. (Data resets on restart — add a real DB later.)
- **No Firebase setup** — login runs in demo mode (any number/email logs in).

You only add MongoDB / Firebase later when you want persistence and real auth.

---

## Deploy to Render (the only step)

1. Push the repo to GitHub (done).
2. Render dashboard → **New** → **Blueprint** → connect your repo.
3. Render reads `render.yaml` and proposes the **`netram`** web service. Click **Apply**.
   - It builds the frontend and installs the backend:
     `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - Starts with `node backend/src/server.js`.
   - The `MONGO_URI` / `FIREBASE_SERVICE_ACCOUNT_JSON` vars are marked optional — **leave them blank**.
4. Wait for the deploy. Your app is live at `https://netram.onrender.com` (or similar).
5. Open the URL → the site loads; `…/api/health` returns `{"ok":true}`.

> First boot downloads a ~76 MB MongoDB binary for the in-memory DB (one-time, ~1 min).
> Free Render services also sleep when idle, so the first hit after inactivity takes ~30–60s.

That's the whole deployment. Everything below is **optional, for later.**

---

## Later: add a real database (persistence)
In-memory data resets on every restart. To keep orders/users/bookings:

1. Create a free **MongoDB Atlas** M0 cluster → add a DB user → Network Access `0.0.0.0/0`.
2. Copy the connection string (insert db name `netram`):
   `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/netram?retryWrites=true&w=majority`
3. Render → your service → **Environment** → set **`MONGO_URI`** to that string → save (redeploys).
4. Seed it once from your machine:
   ```bash
   cd backend
   MONGO_URI="<your-atlas-uri>" npm run seed
   ```
The server now uses Atlas instead of the in-memory DB automatically.

## Later: add real login (Firebase Auth)
Without this, demo auth is used. To enable real phone-OTP + email:

1. Create a Firebase project → **Authentication** → enable **Phone** and **Email/Password**.
2. Add your Render domain under Auth → Settings → **Authorized domains**.
3. Web config (Project Settings → Your apps → Web): add these as **build env vars** on Render so
   Vite bakes them into the frontend, then redeploy:
   ```
   VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID
   ```
4. Service account (so the API verifies tokens): Project Settings → **Service accounts** →
   **Generate new private key** → paste the full JSON (one line) into Render's
   **`FIREBASE_SERVICE_ACCOUNT_JSON`** → redeploy.

---

## Local development
Two terminals (Vite proxies nothing; the frontend calls `http://localhost:4000/api` in dev):
```bash
cd backend  && npm install && npm run dev      # API + in-memory DB on :4000 (no MONGO_URI needed)
cd frontend && npm install && npm run dev      # Vite UI on :5173
```
Or test the production single-service build locally:
```bash
cd frontend && npm run build       # produces frontend/dist
cd ../backend && node src/server.js # serves UI + API together on :4000
```

## Resource recap
| When | Resource | Needed? | How |
|---|---|---|---|
| Now | Render (one web service) | **Yes** | `render.yaml` Blueprint |
| Later | MongoDB Atlas | Optional | set `MONGO_URI` env |
| Later | Firebase Auth | Optional | set `VITE_FIREBASE_*` + `FIREBASE_SERVICE_ACCOUNT_JSON` |
