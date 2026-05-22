---
phase: 7
plan: 2
wave: 2
---

# Plan 7.2: Final Build & APK Generation

## Objective
Compile the Next.js static bundle, sync it with Capacitor, and generate the final Android APK.

## Context
- .gsd/SPEC.md
- package.json
- capacitor.config.ts

## Tasks

<task type="auto">
  <name>Next.js Export & Capacitor Sync</name>
  <files>
    - package.json
  </files>
  <action>
    1. Run `npm run build` to generate the `out/` directory.
    2. Run `npx cap sync android` to copy the web assets into the Android project.
  </action>
  <verify>
    test -d out && test -d android/app/src/main/assets/public
  </verify>
  <done>
    Web assets are successfully compiled and synced to the Android native directory.
  </done>
</task>

<task type="auto">
  <name>Generate APK</name>
  <files>
    - android/build.gradle
  </files>
  <action>
    1. Navigate to the `android` directory.
    2. Run the Gradle wrapper to build a debug APK: `.\gradlew assembleDebug` (on Windows PowerShell) or `./gradlew assembleDebug`.
  </action>
  <verify>
    test -f android/app/build/outputs/apk/debug/app-debug.apk
  </verify>
  <done>
    The `app-debug.apk` is generated and ready for sideloading.
  </done>
</task>

## Success Criteria
- [ ] A fully functional Android APK is generated containing all Phase 1-6 features.
