---
phase: 4
plan: 3
wave: 3
---

# Plan 4.3: Local Transaction & Sync Queue Logging

## Objective
Handle the response generated from the native Android UPI intent, parse its status, and securely write the transaction into our local offline-first database (Dexie).

## Context
- .gsd/SPEC.md
- src/app/pay/page.tsx
- src/lib/local-db.ts

## Tasks

<task type="auto">
  <name>Process Intent Response & Log to DB</name>
  <files>
    - src/app/pay/page.tsx
  </files>
  <action>
    1. Parse the `{ response }` from the `UpiIntent` invocation.
    2. Example response: `txnId=XYZ&responseCode=00&Status=SUCCESS&txnRef=123`.
    3. Determine if the transaction was `success`, `failed`, or `pending`.
    4. Auto-create the Vendor in `localDb.vendors` if they don't already exist (lookup by `upi_id`).
    5. Write the transaction to `localDb.transactions` with `id: crypto.randomUUID()`, `synced: false`.
    6. Push a `CREATE` event to `localDb.sync_queue` with `entity: "transaction"`.
    7. Push a `CREATE` event for the Vendor if a new vendor was implicitly created.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Intent responses are parsed effectively and mapped cleanly into the local database tables with sync queue entries.
  </done>
</task>

<task type="auto">
  <name>Build Success / Redirect Screen</name>
  <files>
    - src/app/pay/success/page.tsx
  </files>
  <action>
    1. Create a simple success confirmation screen at `/pay/success` displaying the recorded amount and status.
    2. Add a button to return to the dashboard.
    3. Ensure `src/app/pay/page.tsx` routes the user to this screen after logging the transaction.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Success page handles the redirection flow elegantly.
  </done>
</task>

## Success Criteria
- [ ] Intent responses translate correctly to Dexter entries.
- [ ] A success confirmation page exists and is navigable.
