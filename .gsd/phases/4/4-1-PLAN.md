---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: UI Structure & QR Scanner Integration

## Objective
Set up the QR scanning library in the Next.js frontend and build the `/scan` route. Ensure the Android app has the required camera permissions to launch the web-based scanner.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/4/RESEARCH.md
- android/app/src/main/AndroidManifest.xml

## Tasks

<task type="auto">
  <name>Configure Android Permissions & Dependencies</name>
  <files>
    - package.json
    - android/app/src/main/AndroidManifest.xml
  </files>
  <action>
    1. Run `npm install @yudiel/react-qr-scanner`.
    2. Add `<uses-permission android:name="android.permission.CAMERA" />` to `AndroidManifest.xml` if not present.
  </action>
  <verify>
    npm ls @yudiel/react-qr-scanner && grep "android.permission.CAMERA" android/app/src/main/AndroidManifest.xml
  </verify>
  <done>
    QR scanner library is installed and camera permissions are granted in the manifest.
  </done>
</task>

<task type="auto">
  <name>Create /scan Page</name>
  <files>
    - src/app/scan/page.tsx
  </files>
  <action>
    1. Build the `/scan` page component.
    2. Import `<Scanner>` from `@yudiel/react-qr-scanner`.
    3. Implement `onScan` handler: Parse the `upi://pay?...` URL.
    4. Extract `pa` (payee address) and `pn` (payee name). Use `URL` and `URLSearchParams` to extract query string safely since it's a `upi://` protocol URL.
    5. Redirect to `/pay?pa=<address>&pn=<name>` via `useRouter().push()`.
    6. Provide clear visual UI overlay indicating to scan a UPI QR code.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Scan page compiles with TypeScript and properly handles the `onScan` callback with routing logic.
  </done>
</task>

## Success Criteria
- [ ] `@yudiel/react-qr-scanner` is installed.
- [ ] `AndroidManifest.xml` includes Camera permissions.
- [ ] User can navigate to `/scan` and the `Scanner` component mounts.
