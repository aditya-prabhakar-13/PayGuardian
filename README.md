# PayGuardian

PayGuardian is a privacy-first, offline-capable Personal Finance Manager that intercepts UPI intent calls before they reach apps like Google Pay or PhonePe. It logs the transaction instantly into a local IndexedDB (via Dexie) and seamlessly routes the payment. When you regain internet access, a background sync queue uploads your transaction data to your secure cloud database (MongoDB).

## Features

- **Offline-First Storage**: Uses IndexedDB (Dexie) to instantly log transactions, vendors, and category definitions without any network latency.
- **Custom UPI Intent Plugin**: A custom Capacitor plugin intercepts `upi://pay` URLs from QR scans and forwards them directly to the native Android OS intent handler.
- **Dynamic Budgeting**: Real-time spending analysis utilizing a custom dynamic Hemi-Donut SVG chart.
- **Background Sync**: A custom `useCloudSync` React hook continuously monitors network status and silently drains the local `sync_queue` to your MongoDB backend via Next.js API routes.
- **Modern UI/UX**: Built with Next.js 14+, Tailwind CSS v4, and React QR Scanner. Fully responsive and styled like a native mobile application.

## Tech Stack

- **Frontend**: Next.js 14+ (React), Tailwind CSS v4
- **Mobile Container**: Capacitor v6 (Android)
- **Local DB**: Dexie.js (IndexedDB wrapper)
- **Cloud DB**: MongoDB (via Mongoose)
- **Auth**: NextAuth.js (Google Provider)

## Getting Started

### Local Development (Web)

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Copy `.env.example` to `.env.local` and add your MongoDB URI and Google OAuth credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

### Building for Android

Because API routes cannot be statically exported, PayGuardian uses a custom build script to temporarily hide them during the Capacitor sync process.

1. Build the static web bundle:
   ```bash
   npm run build:mobile
   ```

2. Sync the web assets into the Android native project:
   ```bash
   npm run cap:sync
   ```

3. Compile the APK:
   Open the `android/` directory in **Android Studio** and click "Build APK", or run Gradle from the command line:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   *Note: Ensure you have the Android SDK installed and `ANDROID_HOME` configured on your machine.*

## Architecture Notes

### Why IndexedDB?
We chose IndexedDB over SQLite for zero-configuration setup and true isomorphic code that works identically in the browser and on the mobile device.

### Background Sync
All data mutations (`CREATE`, `UPDATE`) push an event object into `localDb.sync_queue`. The `useCloudSync` hook checks `navigator.onLine`. If true, it POSTs the queue in bulk to `/api/sync` where the server uses MongoDB `updateOne({ upsert: true })` for strict idempotency.

---
Built with GSD.
