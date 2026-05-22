---
phase: 5
plan: 2
wave: 2
---

# Plan 5.2: Cloud Sync Queue Hook

## Objective
Create the background sync worker that flushes the local Dexie `sync_queue` to our Next.js backend API whenever the device has connectivity.

## Context
- .gsd/SPEC.md
- src/lib/local-db.ts
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Create useCloudSync Hook</name>
  <files>
    - src/hooks/useCloudSync.ts
  </files>
  <action>
    1. Create a custom React hook `useCloudSync`.
    2. Hook should run on mount (e.g. `useEffect` with interval or event listeners for `online`/`offline`).
    3. If `navigator.onLine` is true:
       - Fetch all records from `localDb.sync_queue`.
       - If records exist, retrieve the Capacitor Auth Bearer token (you can read from LocalStorage or wherever auth state is stored, or wait for an auth context. Let's assume a generic `fetch` with token).
       - POST the array of queue items to `/api/sync`.
       - On success (200), delete the successfully synced items from `localDb.sync_queue` and update their respective tables (`transactions`, `vendors`) setting `synced: true`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    `useCloudSync` compiles securely and correctly manages Dexie table mutations.
  </done>
</task>

<task type="auto">
  <name>Mount Sync Hook</name>
  <files>
    - src/app/page.tsx
  </files>
  <action>
    1. Import and mount `useCloudSync()` inside the root dashboard component.
    2. Add a small visual indicator (e.g. a cloud icon) in the header showing whether it is "Synced", "Syncing", or "Offline" based on the queue size and network status.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Dashboard safely integrates the sync worker.
  </done>
</task>

## Success Criteria
- [ ] The app automatically attempts to flush local mutations to the cloud.
- [ ] Network status and sync state is visible to the user.
