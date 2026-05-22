---
phase: 7
plan: 1
wave: 1
---

# Plan 7.1: Camera Permissions & Polish

## Objective
Ensure the QR Scanner gracefully handles camera permission denials on Android.

## Context
- .gsd/SPEC.md
- src/app/scan/page.tsx

## Tasks

<task type="auto">
  <name>Handle Camera Permission States</name>
  <files>
    - src/app/scan/page.tsx
  </files>
  <action>
    1. Update `src/app/scan/page.tsx`.
    2. Add an `onError` handler to the `<Scanner>` component (from `@yudiel/react-qr-scanner`).
    3. If an error occurs (e.g. NotAllowedError / Permission denied), display a clear UI message instructing the user to enable Camera permissions in their Android app settings.
    4. Provide a button to manually fall back to the dashboard.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Scan page compiles cleanly and includes an error boundary/fallback for camera failures.
  </done>
</task>

## Success Criteria
- [ ] Users are not left with a blank screen if camera permissions are denied.
