---
phase: 5
plan: 3
wave: 3
---

# Plan 5.3: Server Sync Endpoint

## Objective
Build the secure backend API endpoint to receive batches of offline mutations and persist them into MongoDB.

## Context
- .gsd/SPEC.md
- src/lib/verify-jwt.ts
- src/models/Transaction.ts
- src/models/Vendor.ts

## Tasks

<task type="auto">
  <name>Build API Sync Route</name>
  <files>
    - src/app/api/sync/route.ts
  </files>
  <action>
    1. Create `POST` handler at `/api/sync`.
    2. Extract the `Bearer` token and pass it to `verifyJwt(token)`. Reject with 401 if invalid.
    3. Accept JSON payload containing an array of sync queue items.
    4. Iterate over the payload. For each item:
       - If `entity === "transaction"` and `action === "CREATE"`: instantiate and save a Mongoose `Transaction` matching the payload.
       - If `entity === "vendor"` and `action === "CREATE"`: instantiate and save a Mongoose `Vendor` matching the payload using `updateOne(..., {upsert: true})` to prevent duplicates.
    5. Wrap MongoDB inserts in a `try/catch` and return `{ success: true, processed: N }`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Sync route compiles, secures itself with JWT, and implements Mongoose writes accurately based on payload entity strings.
  </done>
</task>

## Success Criteria
- [ ] `/api/sync` successfully proxies Dexie payload arrays into MongoDB Atlas records.
