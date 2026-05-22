---
phase: 4
plan: 2
wave: 2
---

# Plan 4.2: Payment Form & UPI Intent Launcher

## Objective
Build the `/pay` route to collect transaction amount and category, and wire up the Capacitor plugin to launch actual UPI apps.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/app/scan/page.tsx
- plugins/capacitor-upi-intent/src/index.ts

## Tasks

<task type="auto">
  <name>Build /pay Form UI</name>
  <files>
    - src/app/pay/page.tsx
  </files>
  <action>
    1. Create the `/pay` route component.
    2. Read `pa` (UPI ID) and `pn` (Name) from `searchParams` via Next.js hooks (like `useSearchParams`). Note: Next.js 14 requires `Suspense` boundary for `useSearchParams()` when exporting static HTML.
    3. Create inputs for `amount` (numeric) and `notes` (text).
    4. Fetch available categories from `localDb.categories` and render a dropdown to assign a category to this transaction.
    5. Render a large "Pay with UPI" button.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    UI contains inputs for amount, category, and notes, wrapped safely in a Suspense boundary.
  </done>
</task>

<task type="auto">
  <name>Connect Capacitor UPI Plugin</name>
  <files>
    - src/app/pay/page.tsx
  </files>
  <action>
    1. Import `{ UpiIntent }` from `'capacitor-upi-intent'`.
    2. On "Pay with UPI" click: 
       - Construct the `upi://pay` URI ensuring `pa`, `pn`, `am`, `tn` (notes), and `tr` (transaction ref, optionally generated locally) are properly URL encoded.
       - Await `UpiIntent.initiatePayment({ url })`.
    3. Console log the response for now.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    `UpiIntent.initiatePayment` is invoked with a correctly structured UPI URI when the form is submitted.
  </done>
</task>

## Success Criteria
- [ ] `/pay` route accepts query parameters and renders correctly.
- [ ] Form captures amount and category.
- [ ] Capacitor plugin bridge triggers the Android intent.
