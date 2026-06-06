# 🏗️ How to Build the MediKarp APK

## Option A — EAS Build (Recommended, FREE, no Android Studio needed)

This builds the APK in the cloud. You just run a command and download the APK.

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Create a FREE Expo account
Go to: https://expo.dev/signup

### 3. Log in
```bash
eas login
```

### 4. In the MediKarp folder, configure the build
```bash
eas build:configure
```
When asked "Which platform?", choose **Android**.

### 5. Build the APK
```bash
eas build -p android --profile preview
```
This uploads your code and builds in Expo's cloud (~5–10 minutes).
You'll get a download link for the `.apk` file when done.

### 6. Install on your phone
- Enable "Install from unknown sources" in your Android settings
- Download and open the APK on your phone

---

## Option B — Local Build (Needs Android Studio)

Only do this if you want to build offline:

1. Install Android Studio + SDK (API 21+)
2. Run: `npx expo run:android --variant release`

---

## eas.json (already configured)
The `eas.json` file in this folder sets up the "preview" profile
which produces a standalone APK (not AAB), making it easy to
sideload on any Android phone without the Play Store.
