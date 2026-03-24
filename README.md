# DeenBase — React Native App

> Verified Islamic reference. Quran · Prayer · Zikir · Qibla · 99 Names.  
> No AI. No ads. No API keys. Real native iOS & Android app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 51 (React Native) |
| Navigation | React Navigation v6 (Bottom tabs + Stack) |
| State | Zustand + AsyncStorage (persisted) |
| Notifications | expo-notifications (real background alerts) |
| Compass | expo-sensors (Magnetometer) |
| Location | expo-location |
| Audio | expo-av (Quran recitation) |
| Speech | expo-speech (Arabic pronunciation) |
| Fonts | Amiri · Cormorant Garamond · Sora |

---

## Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npx expo start

# 3. Run on your phone
#    Install "Expo Go" app on iPhone/Android
#    Scan the QR code shown in terminal

# OR run on simulator:
npx expo run:ios       # requires Xcode + Mac
npx expo run:android   # requires Android Studio
```

---

## Build Real Native Binaries (EAS Build)

This compiles the app into a real .ipa (iOS) or .apk/.aab (Android) that can be installed directly or submitted to the App Store / Play Store.

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo account (free)
eas login

# 3. Configure project (run once)
eas build:configure

# 4. Build for Android (APK for direct install)
eas build --platform android --profile preview

# 5. Build for iOS (requires Apple Developer account $99/yr)
eas build --platform ios --profile production

# 6. Submit to App Store
eas submit --platform ios

# 7. Submit to Play Store
eas submit --platform android
```

---

## Background Adzan Notifications

The app uses **expo-notifications** which schedules native OS-level alerts:

- **Android**: Notifications fire even when app is closed (uses AlarmManager)
- **iOS**: Scheduled local notifications work when app is backgrounded or closed
- Each time the user opens the app, prayer times are re-fetched and notifications are **re-scheduled** for the day
- The user only needs to open the app once per day (or enable Background App Refresh on iOS for fully automatic daily re-scheduling)

---

## Qibla Compass

Uses **expo-sensors Magnetometer** for real hardware compass:
- Reads raw magnetometer X/Y data → calculates heading
- Qibla bearing calculated via Haversine formula (offline, no API needed)
- Verified against Aladhan API when online
- Haptic feedback when device is aligned with Mecca (< 5° tolerance)
- Smooth Animated spring for needle movement

---

## App Store Setup

### iOS (Apple Developer Program — $99/year)
1. Register at [developer.apple.com](https://developer.apple.com)
2. Create App ID: `com.deenbase.app`
3. Create provisioning profiles for distribution
4. Run `eas build --platform ios`
5. Submit via `eas submit --platform ios` or Xcode

### Android (Google Play — one-time $25)
1. Register at [play.google.com/console](https://play.google.com/console)
2. Create new app: `DeenBase`
3. Run `eas build --platform android --profile production`
4. Upload `.aab` file to Play Console → Internal Testing → Production

---

## Project Structure

```
DeenBase/
├── App.js                    # Root entry: fonts, store init, navigation
├── app.json                  # Expo config + native permissions
├── eas.json                  # EAS Build profiles
├── src/
│   ├── data/
│   │   └── constants.js      # Colors, 99 Names, Azkar, Quotes
│   ├── services/
│   │   ├── store.js          # Zustand state + AsyncStorage persistence
│   │   ├── prayerService.js  # Prayer API, Qibla, Adzan scheduling
│   │   └── quranService.js   # Quran API (text, translation, tafsir, audio)
│   ├── navigation/
│   │   └── AppNavigator.js   # Bottom tabs + stack navigators
│   ├── components/
│   │   └── UI.js             # Shared components (Card, Btn, Header, etc.)
│   └── screens/
│       ├── HomeScreen.js     # Dashboard, prayer hero, stats
│       ├── QuranScreen.js    # Surah list with filters + Juz
│       ├── ReaderScreen.js   # Ayah reader, audio, bookmarks, tafsir
│       ├── PrayerScreen.js   # Prayer times + Adzan toggle
│       ├── QiblaScreen.js    # Live compass with Magnetometer
│       └── AllScreens.js     # Zikir, 99 Names, Quotes, Search, More
├── assets/
│   ├── icon.png              # App icon (1024x1024)
│   ├── splash.png            # Splash screen (1284x2778)
│   ├── adaptive-icon.png     # Android adaptive icon foreground
│   └── azan.mp3              # Azan audio file (bundled)
└── README.md
```

---

## Required Assets

Add these files to `./assets/` before building:

| File | Size | Notes |
|---|---|---|
| `icon.png` | 1024×1024 | App icon (no transparency for iOS) |
| `splash.png` | 1284×2778 | Splash screen |
| `adaptive-icon.png` | 1024×1024 | Android foreground (can be transparent) |
| `azan.mp3` | < 2MB | Any azan recording in MP3 format |
| `notification-icon.png` | 96×96 | Android notification icon (white on transparent) |

---

## Data Sources (All Free, No Keys)

| Feature | Source |
|---|---|
| Quran text | api.alquran.cloud (Tanzil verified) |
| EN translation | Sahih International |
| BM translation | Abdullah Muhammad Basmeih |
| Tafsir | en.italiansafar (AlQuran.cloud) |
| Quran audio | cdn.islamic.network (Mishary Alafasy) |
| Prayer times | api.aladhan.com |
| Qibla | api.aladhan.com + local Haversine |
| Geocoding | nominatim.openstreetmap.org |
| Hijri date | api.aladhan.com |
