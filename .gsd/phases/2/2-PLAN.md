---
phase: 2
plan: 2
wave: 1
---

# Plan 2.1: Custom Kotlin Capacitor Plugin for UPI Intents

## Objective
Build a local custom Capacitor plugin in Kotlin to interface with Android's `Intent` system. This allows Pay Guardian to intercept the payment flow, redirect to UPI apps (GPay, PhonePe, Paytm), and capture the transaction result payloads.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md (Phase 2)
- .gsd/phases/2/RESEARCH.md

## Tasks

<task type="auto">
  <name>Scaffold Local UPI Plugin Package</name>
  <files>
    - plugins/capacitor-upi-intent/package.json
    - plugins/capacitor-upi-intent/tsconfig.json
    - plugins/capacitor-upi-intent/src/index.ts
    - plugins/capacitor-upi-intent/src/definitions.ts
    - package.json
  </files>
  <action>
    1. Create a minimal npm package at `plugins/capacitor-upi-intent` containing an empty Capacitor plugin setup.
    2. Define `UpiIntentPlugin` interface in TypeScript with an `initiatePayment(options: { url: string }): Promise<{ status: number, response: string }>` method.
    3. Install the local plugin into the main project by running `npm install file:plugins/capacitor-upi-intent`.
    4. Ensure the plugin exports the `UpiIntent` proxy correctly for the web client.
  </action>
  <verify>
    npm ls capacitor-upi-intent
  </verify>
  <done>
    The local plugin is listed in the root `package.json` dependencies and `npm ls` resolves it to the local folder.
  </done>
</task>

<task type="auto">
  <name>Implement Kotlin Android Intent Logic</name>
  <files>
    - plugins/capacitor-upi-intent/android/build.gradle
    - plugins/capacitor-upi-intent/android/src/main/AndroidManifest.xml
    - plugins/capacitor-upi-intent/android/src/main/java/com/payguardian/plugins/upi/UpiIntentPlugin.kt
    - android/app/src/main/java/com/payguardian/app/MainActivity.java
  </files>
  <action>
    1. Create the Android library structure inside the plugin.
    2. Write `UpiIntentPlugin.kt` annotated with `@CapacitorPlugin(name = "UpiIntent")`.
    3. Implement `initiatePayment` method to fire `Intent.ACTION_VIEW` for the provided UPI URL using `startActivityForResult()`.
    4. Implement `@ActivityCallback` to catch the result, extract the `response` string extra, and resolve the JS call.
    5. Run `npx cap sync android` to ensure the main Android app detects and registers the new local plugin.
  </action>
  <verify>
    npx cap sync android
  </verify>
  <done>
    `npx cap sync` detects `capacitor-upi-intent` and updates the native Android project without errors.
  </done>
</task>

## Success Criteria
- [ ] A local npm package for the plugin exists in `plugins/capacitor-upi-intent`.
- [ ] TypeScript definitions are correctly mapped for `initiatePayment`.
- [ ] Kotlin code builds without syntax errors and properly utilizes `@CapacitorPlugin`.
- [ ] Root Next.js project is successfully linked to the local plugin.
