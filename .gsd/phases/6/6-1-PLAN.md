---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Category Management UI

## Objective
Provide a UI allowing users to define their spending categories and assign monthly budget limits to them.

## Context
- .gsd/SPEC.md
- src/lib/local-db.ts

## Tasks

<task type="auto">
  <name>Build Categories UI</name>
  <files>
    - src/app/settings/categories/page.tsx
  </files>
  <action>
    1. Create `src/app/settings/categories/page.tsx`.
    2. Use `useLiveQuery` to list existing categories from `localDb.categories`.
    3. Implement a form to add a new category (Name, Hex Color, Budget Limit).
    4. Implement logic: When a user adds a category, generate an ObjectId/UUID, save it to `localDb.categories`, and immediately push a `CREATE` event to `localDb.sync_queue`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Category page renders without TypeScript errors and properly mutates `categories` and `sync_queue` tables.
  </done>
</task>

<task type="auto">
  <name>Update Dashboard Budget Logic</name>
  <files>
    - src/app/page.tsx
  </files>
  <action>
    1. In `src/app/page.tsx`, replace the hardcoded `budget` of 50000.
    2. Use `useLiveQuery` to fetch all categories and sum their `budget_limit` fields to determine the global dashboard budget.
    3. Fallback to 50000 only if no categories have limits defined.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Dashboard compiles and reads budget dynamically from category definitions.
  </done>
</task>

## Success Criteria
- [ ] Users can create and manage categories.
- [ ] Dashboard Hemi-donut chart responds accurately to category budget updates.
