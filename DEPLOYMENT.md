# Deploying Sawta Guest House

Frontend (React + Vite) → **Netlify** · Backend (Express + MongoDB) → **Render**.

---

## 1. Database — MongoDB Atlas (free)

1. Create a free cluster at <https://www.mongodb.com/atlas>.
2. Create a database user and allow network access from anywhere (`0.0.0.0/0`) so Render can connect.
3. Copy the connection string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/sawta_guest_house`

---

## 2. Backend → Render

This repo ships a **`render.yaml`** blueprint.

1. Push the project to GitHub.
2. In Render: **New + → Blueprint → connect the repo**. Render detects `render.yaml`.
3. Fill the secret env vars (marked *sync: false*) in the dashboard:
   - `CLIENT_URL` = your Netlify URL (set after step 3, e.g. `https://sawta-guest-house.netlify.app`)
   - `MONGODB_URI` = the Atlas string
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `CLOUDINARY_*` (from your Cloudinary dashboard)
   - `GMAIL_*` (for confirmation emails) and `TWILIO_*` (optional, for WhatsApp)
4. Deploy. The API serves at `https://<your-service>.onrender.com` and health-checks at `/api/health`.
5. **Seed the admin user + sample data** (once): open the service **Shell** in Render and run:
   ```bash
   npm run seed
   ```

> Note: Render's free plan sleeps after inactivity, so the first request after idle can take ~30s.

### Manual setup (alternative to the blueprint)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add the env vars listed in `backend/.env.example`.

---

## 3. Frontend → Netlify

This repo ships a **`netlify.toml`** (build base `frontend`, publish `dist`) and a
**`frontend/public/_redirects`** file with the SPA fallback `/*  /index.html  200`.
This is what fixes the **`/admin` route error** — without it, static hosts 404 on deep links/refresh.

1. In Netlify: **Add new site → Import from Git** → select the repo. The `netlify.toml` settings apply automatically.
2. Set environment variables (Site settings → Environment variables):
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`  (include `/api`)
   - `VITE_WHATSAPP` = your WhatsApp number (e.g. `919876543210`)
   - `VITE_MAPS_EMBED` = your Google Maps embed URL (optional)
3. Deploy. Then copy the Netlify URL back into Render's `CLIENT_URL` and redeploy the backend so CORS allows it.

---

## 4. Post-deploy test checklist

- [ ] `https://<render>/api/health` returns `{ "status": "ok" }`
- [ ] Home page loads rooms, gallery, reviews
- [ ] Submit a public booking → appears in **Admin → Bookings** with a bell notification
- [ ] Submit a review → appears in **Admin → Reviews** (Pending) → approve → shows on Home
- [ ] Admin login works (seeded `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- [ ] Add an **offline booking** → room availability decrements
- [ ] **Confirm** a booking → guest receives email (+ WhatsApp if Twilio set)
- [ ] Visit `/admin` directly / refresh → **no 404** (SPA redirect working)
- [ ] Install prompt appears (PWA) on the site and `/admin`

---

## CORS

The backend allows the origins in `CLIENT_URL` (comma-separated for multiple).
Always set `CLIENT_URL` in production to your exact Netlify URL.
