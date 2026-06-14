# Sawta Guest House — Mobile App (React Native + Expo)

A premium, customer-facing mobile app for **Sawta Guest House**. It connects **directly to your existing website backend** (Node.js + Express + MongoDB) — no new backend, no new database, no changes to website functionality.

- Theme: Luxury hospitality — Navy `#0F172A`, Gold `#D4AF37`, Ivory `#FAF9F6`
- Bottom tabs: **Home · Rooms · Bookings · Gallery · Profile**
- Bilingual: **English + Marathi**, with a language-aware logo (English wordmark for English, Marathi wordmark for Marathi) — matching the website.
- Light + Dark mode, glassmorphism cards, smooth animations, pull-to-refresh, offline caching.

---

## 1. Requirements

- Node.js 18+
- Expo CLI (`npx expo`) — no global install needed
- Expo Go app on your phone (Android/iOS) **or** an emulator

## 2. Setup

```bash
cd sawta-app
npm install
npx expo start
```

Then scan the QR code with **Expo Go**, or press `a` (Android) / `i` (iOS).

## 3. Point the app at your backend

Open **`app.json`** and edit `expo.extra`:

```json
"extra": {
  "apiUrl": "https://savta-guest-house.onrender.com/api",
  "phone": "+919876543210",
  "whatsapp": "919876543210",
  "email": "info@sawtaguesthouse.com",
  "mapsQuery": "Sawta Guest House, Maharashtra, India"
}
```

- `apiUrl` must be the **same base URL** your website uses (the deployed Render URL, ending in `/api`). For local testing against a backend on your computer, use your machine's LAN IP, e.g. `http://192.168.1.5:5000/api` (not `localhost`, which an Expo phone can't reach).
- Update phone / whatsapp / email / mapsQuery to your real contact details.

No other configuration is required — rooms, gallery, reviews and bookings all come live from your existing APIs.

---

## 4. Features

| Area | What it does |
| --- | --- |
| **First launch** | One-time premium welcome screen ("Download the Sawta Guest House App") with benefits + Continue / Skip. Shown only once. |
| **Auth** | Login, Register, Forgot Password (see note below). |
| **Home** | Hero banner, Featured Rooms, Special Offers, Guest Reviews (live), Facilities, Nearby Attractions, Quick Booking. |
| **Rooms** | Listing with search + category filter, full details, image gallery, amenities, pricing, live availability status. |
| **Booking** | Check-in / check-out date pickers, guest count, room selection, live total, confirmation via your `POST /bookings` API. |
| **Bookings** | Booking history + status tracking (Confirmed / Cancelled / Completed). |
| **Profile** | View / edit profile, saved rooms, booking history, dark mode toggle, language toggle, logout. |
| **Gallery** | Rooms / Reception / Exterior / Dining — fetched live from `GET /gallery`, with full-screen viewer. |
| **Contact** | One-tap Call, WhatsApp, Email, Google Maps directions, Share. |
| **Notifications** | Expo Notifications (booking confirmation + announcements). |
| **Mobile** | Pull-to-refresh, offline caching, dark mode, responsive layout. |

---

## 5. Important — how this maps to your existing backend

Your current backend is built for the **website + admin panel**. It exposes public endpoints for rooms, gallery, reviews, contact and **bookings**, plus an **admin-only** login. It does **not** currently expose customer-account endpoints (customer register/login, per-user booking list, or device push registration). To respect your instruction *"do NOT create a new backend / database"*, the app handles those gaps **on the device** instead of inventing new server routes:

- **Customer accounts** are stored securely **on the device** (Expo SecureStore for the session token, AsyncStorage for the profile). Login/Register/Forgot all work offline-first on the phone. No website or DB changes.
- **Booking history** is saved on the device after each successful real booking is created through your existing `POST /bookings` API (the booking itself is genuinely created in your MongoDB and visible in the website admin panel).
- **Notifications** use **local** Expo notifications (e.g. instant "Booking Confirmed"). True server-pushed broadcasts (offers/announcements to all devices) would require one small backend route to store device tokens and send pushes — **not added** here, per your instruction. The code is structured so this can be enabled later without touching screens.
- **OTP / Email verification**: your backend does not currently support it, so it is **not** forced on. If you later add an OTP endpoint, it can be wired into the existing auth screens.

If you'd like, these can be upgraded to full server-side customer accounts + real push later — that *would* mean adding a few endpoints to the existing backend (still the same DB).

---

## 6. Bilingual logo (English / Marathi)

The app shows a **language-aware wordmark**: the English logo ("SAWTA GUEST HOUSE") in English, and the Marathi logo ("सावता गेस्ट हाउस") in Marathi. Switch language from the Home hero (top-right) or Profile → Language. The website navbar/footer now do the same.

**To use your actual image logos** (the crest you shared): drop `logo-en.png` and `logo-mr.png` into `assets/`, then in `src/components/Logo.js` swap the wordmark `Text` for an `Image` that picks the file based on `lang`. A commented slot is included in that file.

---

## 7. Project structure

```
sawta-app/
├── App.js                      # Providers + navigation root
├── app.json                    # apiUrl + contact config
├── src/
│   ├── api/                    # axios client + service calls (rooms, gallery, bookings...)
│   ├── components/             # Logo, Button, Card, RoomCard, Field, Chip, etc.
│   ├── context/                # Theme, Language, Auth, Saved/Bookings
│   ├── data/                   # static content (hero, offers, facilities, nearby)
│   ├── i18n/                   # English + Marathi strings
│   ├── navigation/             # Root stack + bottom tabs
│   ├── screens/                # Onboarding, auth, Home, Rooms, Booking, etc.
│   ├── theme/                  # colors / spacing / radius (light + dark)
│   └── utils/                  # links (call/whatsapp/maps), notifications
```

## 8. Build for stores (optional)

```bash
npm install -g eas-cli
eas build -p android --profile preview   # APK for testing
eas build -p ios --profile preview
```

Enjoy! The app talks to the exact same database as your website, so every booking, room and photo stays perfectly in sync.
