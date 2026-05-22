# Phase 2: UPI Intent Capacitor Plugin - Research

## Discovery Level 2: Standard Research

### Context
We need to build a custom Capacitor plugin using Kotlin to handle UPI payment intents (e.g., launching Google Pay, PhonePe, Paytm). The plugin must capture the payment intent, launch the appropriate Android app, wait for the transaction to complete, and return the result payload back to the Next.js web client.

### Mechanism
In Capacitor 6, creating a local plugin involves:
1. **Scaffolding:** Using `@capacitor/cli` or manually creating a folder (e.g., `plugins/capacitor-upi-intent`) with a `package.json`, `tsconfig.json`, and the Java/Kotlin Android codebase.
2. **Implementation:**
   - Define a class extending `com.getcapacitor.Plugin` with the `@CapacitorPlugin(name = "UpiIntent")` annotation.
   - Implement a `@PluginMethod` (e.g., `initiatePayment`) that accepts a `PluginCall`.
   - Build an Android `Intent` using `Intent.ACTION_VIEW` and the `upi://pay?pa=...` URI.
   - Use Capacitor's `startActivityForResult(call, intent, "paymentResult")` which automatically handles saving the call state.
   - Define an `@ActivityCallback` method named `paymentResult(call: PluginCall, result: ActivityResult)` to receive the callback from the UPI app.
3. **Linking:** Run `npm install file:plugins/capacitor-upi-intent` in the root `package.json` to link it locally without publishing to npm. Then `npx cap sync android` will pick it up.

### UPI Result Payload
Android UPI apps return a string extra named `response` in the `Intent` when they finish.
Format: `txnId=...&responseCode=...&Status=...&txnRef=...`
The plugin should extract this string and pass it back to JS as an object.

### Implementation Steps
1. Create plugin package structure (`plugins/capacitor-upi-intent`).
2. Write the TS interface (`src/definitions.ts` and `src/index.ts`).
3. Write the Kotlin implementation (`android/src/main/java/com/payguardian/plugins/upi/UpiIntentPlugin.kt`).
4. Link it to the main Next.js project and sync to Android.
