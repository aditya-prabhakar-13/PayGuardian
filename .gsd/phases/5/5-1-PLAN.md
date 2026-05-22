---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Dashboard UI & Hemi-Donut Component

## Objective
Replace the placeholder dashboard with a functional dashboard that reads from the local Dexie database, calculates the total spent this month, and visualizes it using a custom SVG hemi-donut chart.

## Context
- .gsd/SPEC.md
- src/app/page.tsx
- src/lib/local-db.ts

## Tasks

<task type="auto">
  <name>Build Hemi-Donut Component</name>
  <files>
    - src/components/HemiDonut.tsx
  </files>
  <action>
    1. Create a `HemiDonut.tsx` React component.
    2. Accept props: `spent` (number), `budget` (number).
    3. Use an SVG `<svg viewBox="0 0 100 50">` to draw a half-circle path.
    4. Calculate the percentage: `Math.min(spent / budget, 1) * 100`.
    5. Use `strokeDasharray` and `strokeDashoffset` to animate/fill the arc dynamically based on the percentage.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    HemiDonut component is fully typed and exports correctly without TypeScript errors.
  </done>
</task>

<task type="auto">
  <name>Integrate Dashboard Data</name>
  <files>
    - src/app/page.tsx
  </files>
  <action>
    1. Update the root `page.tsx` dashboard.
    2. Use `useLiveQuery` from `dexie-react-hooks` to fetch all transactions from `localDb.transactions`.
    3. Sum the `amount` of all transactions in the current month.
    4. Pass the `spent` amount to the `<HemiDonut>` component (use a static `budget` of 50000 for now, or sum category limits if available).
    5. Render a list of the 5 most recent transactions below the chart.
    6. Ensure the "Scan" floating action button (FAB) remains visible and routes to `/scan`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Dashboard compiles, queries Dexie, and integrates the HemiDonut chart cleanly.
  </done>
</task>

## Success Criteria
- [ ] Custom SVG hemi-donut chart renders without external charting libraries.
- [ ] Dashboard displays accurate local transaction data.
