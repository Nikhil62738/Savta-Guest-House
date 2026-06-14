# Savta / Sawta Guest House — Website + Mobile App

Single repository containing both the website and the mobile app.

```
Savta-Guest-House/
├── frontend/     React + Vite website (deploy to Netlify)
├── backend/      Node/Express + MongoDB API (deploy to Render)
└── mobile-app/   React Native (Expo) customer app
```

## What's new in this version
- **Brand logo** used across the website (navbar + footer, `frontend/public/logo.png`) and the app (app icon, splash, adaptive icon, in-app logo).
- **Cancel a booking from the website** — new "My Booking" page (`/manage-booking`): a guest enters the mobile number used at booking, sees their bookings, and cancels. No login required.
- **Cancel a booking from the app** — Bookings screen has a Cancel button.
- **Booking confirmation email** sends automatically when a booking is made.
- **Cancellation email + WhatsApp** sends automatically when a booking is cancelled.

## Website setup
```
cd frontend && npm install && npm run dev      # Netlify env: VITE_API_URL=<backend>/api
cd backend  && npm install && npm run dev      # Render env: see below
```

## Mobile app setup
```
cd mobile-app && npm install && npx expo start
# APK:  EAS_NO_VCS=1 eas build -p android --profile preview
```

## Email / WhatsApp env vars (set on the backend host)
Email (choose one):
- Gmail API: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_REDIRECT_URI, GMAIL_SENDER, MAIL_FROM
- SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
WhatsApp (optional): TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
Core: MONGODB_URI, JWT_SECRET, CLIENT_URL

Without mail vars the app still runs and just logs the email instead of sending it.
