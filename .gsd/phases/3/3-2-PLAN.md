---
phase: 3
plan: 2
wave: 2
---

# Plan 3.2: Offline-First Local Data Store (Dexie.js)

## Objective
Establish the local IndexedDB database using `dexie` to store categories, vendors, and transactions locally. This enables the app to be fully functional offline, appending new operations to a sync queue.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/3/RESEARCH.md

## Tasks

<task type="auto">
  <name>Install Dexie.js</name>
  <files>
    - package.json
  </files>
  <action>
    1. Run `npm install dexie`.
  </action>
  <verify>
    npm ls dexie
  </verify>
  <done>
    Dexie is successfully added to the project dependencies.
  </done>
</task>

<task type="auto">
  <name>Define Dexie Schema & DB Class</name>
  <files>
    - src/lib/local-db.ts
  </files>
  <action>
    1. Create `src/lib/local-db.ts`.
    2. Import `Dexie` and define interfaces for `LocalCategory`, `LocalVendor`, `LocalTransaction`, and `SyncQueueItem`.
    3. Define the database class `PayGuardianDB` extending `Dexie`.
    4. Register tables in the constructor using `this.version(1).stores({ ... })`. Make sure to index common lookup fields (like `category_id`, `vendor_id`, `synced`).
    5. Export a singleton instance `export const localDb = new PayGuardianDB();`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    TypeScript parses the local DB schema cleanly, establishing typed local tables.
  </done>
</task>

## Success Criteria
- [ ] Dexie is installed.
- [ ] Local database tables (`categories`, `vendors`, `transactions`, `sync_queue`) are defined with strict TypeScript interfaces mirroring the MongoDB schema fields (plus local sync metadata).
