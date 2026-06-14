# Building the Sawta Guest House APK (Expo)

This project is already configured to produce an **Android `.apk`**. You just run one command — the APK is compiled by Expo's cloud build servers (or your own machine), because building an APK needs the Android SDK + toolchain.

There are two ways. **Option A (EAS cloud) is the easiest and recommended.**

---

## Option A — EAS Cloud Build (recommended, no Android Studio needed)

You only need Node.js, an internet connection, and a free Expo account.

```bash
# 1. Install the EAS CLI (one time)
npm install -g eas-cli

# 2. Go into the app folder and install dependencies
cd sawta-app
npm install

# 3. Log in (create a free account at https://expo.dev if you don't have one)
eas login

# 4. Link the project (first time only — accept the prompts)
eas init

# 5. Build the APK
eas build -p android --profile preview
```

- The `preview` profile is already set in `eas.json` to output a **`.apk`** (not an `.aab`).
- When the build finishes (usually 5–15 min), the terminal prints a **download link**. Open it and download `application-xxxx.apk`.
- You can also see/download every build at **https://expo.dev → your project → Builds**.
- Install the `.apk` on any Android phone (enable “Install unknown apps”), or upload it to your website's `public/downloads/` folder so the website's “Download App” button serves the real APK.

### Put the APK on your website
Once you have the `.apk`:
1. Copy it to `sawta-guest-house/frontend/public/downloads/sawta-guest-house.apk`.
2. In `sawta-guest-house/frontend/src/data/site.js`, set:
   `downloadUrl: '/downloads/sawta-guest-house.apk'`
3. Redeploy the website. The “Download App” popup now hands guests a real installable APK.

---

## Option B — Local build on your own computer (no Expo account)

Needs **Android Studio + Android SDK** and **JDK 17** installed locally.

```bash
cd sawta-app
npm install

# Generate the native android/ project
npx expo prebuild -p android

# Build a release APK with Gradle
cd android
./gradlew assembleRelease        # macOS / Linux
# gradlew.bat assembleRelease     # Windows
```

The APK is created at:
```
android/app/build/outputs/apk/release/app-release.apk
```

> Tip: for a quick installable test build you can also run `./gradlew assembleDebug` → `app-debug.apk`.

---

## Option C — Local EAS build (cloud config, local machine)

If you have the Android SDK locally but still want to use the EAS config:
```bash
eas build -p android --profile preview --local
```

---

## Notes
- App id (package): `com.sawta.guesthouse` — change it in `app.json` if you want a different identifier before your first build.
- Before building, set `expo.extra.apiUrl` in `app.json` to your live backend URL (already defaulted to your Render API).
- Icons/splash: drop `icon.png` (1024×1024) and `adaptive-icon.png` into `assets/` and reference them in `app.json` for a branded launcher icon. Without them, Expo uses a default icon — the build still succeeds.
- Why can't this be built here? An APK build must download and run the Android SDK/Gradle toolchain, which needs internet and the Android build tools — not available in this chat's sandbox. The commands above do it for you in a couple of minutes.
