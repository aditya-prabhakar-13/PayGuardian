# Phase 5: Transaction Logging & Dashboard - Research

## Discovery Level 1: Hemi-Donut Chart

### Options for Hemi-Donut Visualizer
A core requirement of the dashboard is the "budget visualizer (hemi-donut chart)".
1. **Recharts**: Very popular, supports `<PieChart>` with `startAngle={180}` and `endAngle={0}`. Requires `recharts` dependency.
2. **Custom SVG**: Drawing a hemi-donut using an SVG `<path>` with `stroke-dasharray`. Very lightweight, 0 dependencies, completely customizable for the sci-fi aesthetic.
3. **Chart.js**: Overkill.

**Decision**: We will use a **Custom SVG** component. It is extremely lightweight and since a hemi-donut is just a semi-circle stroke where the `stroke-dashoffset` controls the percentage, it's trivial to implement in a React component with Tailwind CSS. It saves adding a heavy charting library to the Capacitor bundle.

## Discovery Level 2: Cloud Sync Queue Worker

### Offline-First Architecture
In Phase 3 and 4, we built the local Dexie `sync_queue` table which tracks offline mutations (`action: "CREATE"`, `entity: "transaction"`, `payload: {...}`).

### Sync Worker Execution
The dashboard is the main entry point of the app. It's the perfect place to mount a silent background hook (`useCloudSync`) that:
1. Checks if `navigator.onLine` is true.
2. Polls `localDb.sync_queue` for records.
3. Batches these records and `POST`s them to a new API route `/api/sync`.
4. If successful, deletes the records from `sync_queue` and marks the source entities (`transactions`, `vendors`) as `synced: true`.

This ensures the user sees their dashboard instantly (from Dexie) while the app syncs in the background.
