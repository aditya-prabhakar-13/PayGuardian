---
phase: 6
plan: 2
wave: 2
---

# Plan 6.2: Settings Hub & Vendor Management

## Objective
Create the main Settings hub page and a Vendor management page for mapping vendors to default categories.

## Context
- .gsd/SPEC.md
- src/lib/local-db.ts

## Tasks

<task type="auto">
  <name>Build Settings Hub</name>
  <files>
    - src/app/settings/page.tsx
  </files>
  <action>
    1. Create `src/app/settings/page.tsx`.
    2. Render a simple menu linking to `/settings/categories` and `/settings/vendors`.
    3. Add a "Sign Out" button (if auth state allows, else just a placeholder) and app version details.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Settings hub compiles cleanly.
  </done>
</task>

<task type="auto">
  <name>Build Vendor Management UI</name>
  <files>
    - src/app/settings/vendors/page.tsx
  </files>
  <action>
    1. Create `src/app/settings/vendors/page.tsx`.
    2. Use `useLiveQuery` to list all vendors from `localDb.vendors`.
    3. Allow clicking a vendor to update its `name` or map its `default_category_id` using an HTML `<select>`.
    4. Ensure modifications update `localDb.vendors` and push an `UPDATE` action to `localDb.sync_queue`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Vendor management screen compiles and allows modifying vendor records.
  </done>
</task>

## Success Criteria
- [ ] Settings hub provides clear navigation.
- [ ] Vendors can be renamed and assigned default categories.
