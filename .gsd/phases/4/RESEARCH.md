# Phase 4: Scanning & Payment Flow - Research

## Discovery Level 2: QR Scanning & Capacitor Integration

### 1. QR Scanner Technology
For a Next.js Capacitor app, we have two paths for camera scanning:
A) Native Capacitor Plugins (e.g. `@capacitor-mlkit/barcode-scanning`): Fast, but requires complex transparent WebView backgrounds and z-index trickery so the native camera view renders "behind" the HTML.
B) Web-based WebRTC Scanners (e.g. `@yudiel/react-qr-scanner`): Renders a `<video>` tag directly in the DOM. Extremely easy to style with Tailwind/CSS, integrates perfectly with React components, and Capacitor natively bridges `navigator.mediaDevices.getUserMedia()` to Android camera hardware.

**Decision:** We will use `@yudiel/react-qr-scanner`. It allows for rapid UI development and seamless integration into our Next.js pages without native UI fighting. We just need to ensure `<uses-permission android:name="android.permission.CAMERA" />` is in `AndroidManifest.xml`.

### 2. UPI Intent URL Parsing
Indian merchant QR codes encode data as: `upi://pay?pa=merchant@upi&pn=Merchant%20Name&mc=0000...`
- `pa`: Payee Address (VPA / UPI ID)
- `pn`: Payee Name
- `am`: Amount (if fixed)
We will parse this URL using standard `URL` and `URLSearchParams` to extract the destination vendor.

### 3. Payment Flow Architecture
1. **`/scan` Route**:
   - Renders the QR Scanner.
   - On scan: decodes the `pa` and `pn`.
   - Looks up the `localDb.vendors` table to see if `upi_id === pa` exists.
   - Pushes to `/pay?pa=...&pn=...`
2. **`/pay` Route**:
   - Shows merchant name.
   - Large numeric keypad or input for amount (if not specified in QR).
   - Allows selecting/changing the Category (defaults to vendor's `default_category_id`).
   - "Pay" button invokes `UpiIntent.initiatePayment({ url: reconstructedUpiUrl })`.
3. **Intent Response Handling**:
   - The plugin returns `{ response: string }`.
   - E.g. `txnId=123&responseCode=00&Status=SUCCESS&txnRef=456`.
   - We parse this to determine `success` vs `failed`.
   - Write a new `LocalTransaction` to Dexie `transactions` table.
   - Write a `CREATE` payload to `sync_queue` table.
   - Redirect to `/success` or show failure toast.
