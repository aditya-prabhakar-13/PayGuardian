# Phase 3: Data Layer & Offline Setup - Research

## Discovery Level 1.5: Schema & Middleware Design

### 1. MongoDB Schemas (Mongoose)
The app is multi-tenant by user ID. Every document must strictly tie to a `user_id`.
- **Category:** `user_id` (ObjectId, ref User), `name` (String), `color` (String), `limit` (Number), `created_at` (Date).
- **Vendor:** `user_id` (ObjectId), `name` (String), `upi_id` (String), `default_category_id` (ObjectId, ref Category), `created_at` (Date).
- **Transaction:** `user_id` (ObjectId), `amount` (Number), `vendor_id` (ObjectId, ref Vendor), `category_id` (ObjectId, ref Category), `status` (String: 'pending', 'success', 'failed'), `txn_ref` (String), `notes` (String), `created_at` (Date).

### 2. API JWT Middleware
NextAuth v5 (Auth.js) is cookie-based for web clients, but our mobile Capacitor app uses a JWT passed via `Authorization: Bearer <token>`.
Because Next.js Edge runtime (used by `middleware.ts`) has issues with the `jsonwebtoken` library (which depends on Node's `crypto`), we will create a lightweight API wrapper/utility in `src/lib/verify-jwt.ts`. 
API route handlers will call `const user = await verifyApiRequest(req)` to extract and validate the user.

### 3. Dexie.js (IndexedDB) Schema
Offline-first resilience requires a local mirror of the user's data. 
- **Tables:** `categories`, `vendors`, `transactions`, `sync_queue`.
- **Primary Keys:** We will use the MongoDB `_id` as the primary key locally (mapping it to `id`), except for new items created offline, which will get a local `uuid` until synced.
- **Sync Status:** Every record will have a `synced` (boolean) flag.
- **Queue Table:** A dedicated `sync_queue` table with an auto-increment ID, `action` ('CREATE', 'UPDATE', 'DELETE'), `entity` ('transaction', 'category', 'vendor'), and `payload` (JSON) to track offline changes.
