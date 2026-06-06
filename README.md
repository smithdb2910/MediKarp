#  MediKarp

> *MediKarp is a simple medication reminder app designed to help users remember their daily medicines without unnecessary complexity.*

![React Native](https://img.shields.io/badge/React%20Native-Expo-orange?style=flat-square&logo=react)
![Android](https://img.shields.io/badge/Android-5.0%2B-brightgreen?style=flat-square&logo=android)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

MediKarp is a lightweight Android medicine tracker built for **older users who just need it to work**. No accounts, no subscriptions, no nonsense. Add your medicines, set a time, get reminded. That's it.

---

##  Screenshots

<img width="649" height="720" alt="Screenshot_20260607-015206" src="https://github.com/user-attachments/assets/17413dc6-8736-4647-b71d-0d903e49a14a" />



---

## Features

-  **Add unlimited medicines** with name, dosage, and notes
-  **Daily notifications** — set once, fires every day automatically
-  **Edit or remove** medicines any time
-  **Fully offline** — no internet needed, no data leaves your phone
-  **Elderly-friendly UI** — large text, big tap targets, clean layout
-  **Broad compatibility** — works on Android 5.0+ (phones from ~2012 onward)

---

##  Tech Stack

| Layer | Tool |
|---|---|
| Framework | React Native (Expo) |
| Navigation | React Navigation v6 |
| Notifications | expo-notifications |
| Local Storage | AsyncStorage |
| Build | EAS Build |

---

##  Getting Started

### Prerequisites
- Node.js 18+
- A free [Expo account](https://expo.dev/signup)

### Run locally (Expo Go)

```bash
git clone https://github.com/yourusername/medikarp.git
cd medikarp
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your Android phone.

### Build APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Expo builds in the cloud (~10 minutes) and gives you a direct `.apk` download link. No Android Studio needed.

---

## Project Structure

```
medikarp/
├── App.js                      # Entry point, navigation, permissions
├── app.json                    # Expo config (package ID, permissions, icons)
├── eas.json                    # Build profiles
└── src/
    ├── screens/
    │   ├── HomeScreen.js       # Medicine list, delete, edit navigation
    │   └── AddMedicineScreen.js # Add/edit form + tap-friendly time picker
    └── utils/
        ├── storage.js          # AsyncStorage read/write helpers
        └── notifications.js    # Permission requests + daily scheduling
```

---

## Design Decisions

- **Orange + dark theme** — high contrast, easy to read in any lighting
- **No date picker libraries** — the custom tap-wheel is more accessible for older users than a native picker
- **Offline-first** — AsyncStorage keeps everything local; no backend, no GDPR headaches
- **Minimal dependencies** — only what's needed, nothing extra

---

## Roadmap

- [ ] Multiple reminder times per medicine (morning + evening)
- [ ] Refill countdown tracker
- [ ] Simple caregiver sharing via export
- [ ] iOS support
- [ ] Home screen widget

---

##  Contributing

PRs welcome. If you have a parent or grandparent who'd actually use this — that's the target user. Keep that in mind with any feature suggestions.

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a PR

---

## License

MIT — do whatever you want with it.

---

*Named after Magikarp because it starts simple but gets the job done. Also because all the good names were taken.*

