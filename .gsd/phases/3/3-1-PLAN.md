---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Server Data Layer & API Middleware

## Objective
Define the cloud database schema using Mongoose for Categories, Vendors, and Transactions. Additionally, create a reusable API utility to securely verify mobile JWTs on backend API routes.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/3/RESEARCH.md
- src/models/User.ts
- src/app/api/auth/mobile-callback/route.ts

## Tasks

<task type="auto">
  <name>Create MongoDB Mongoose Schemas</name>
  <files>
    - src/models/Category.ts
    - src/models/Vendor.ts
    - src/models/Transaction.ts
  </files>
  <action>
    1. Create `Category.ts` with fields: `user_id`, `name`, `color`, `limit`, timestamps.
    2. Create `Vendor.ts` with fields: `user_id`, `name`, `upi_id`, `default_category_id`, timestamps.
    3. Create `Transaction.ts` with fields: `user_id`, `amount`, `vendor_id`, `category_id`, `status` (enum: pending, success, failed), `txn_ref`, `notes`, timestamps.
    4. Ensure strict typing with `InferSchemaType` and that all schemas properly index `user_id`.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    TypeScript cleanly compiles the new model files and relationships are logically defined.
  </done>
</task>

<task type="auto">
  <name>Implement API JWT Verification Utility</name>
  <files>
    - src/lib/verify-jwt.ts
  </files>
  <action>
    1. Create `src/lib/verify-jwt.ts` that exports an async function `verifyApiRequest(req: Request): Promise<{ userId: string } | null>`.
    2. The function should extract the Bearer token from the `Authorization` header.
    3. Use `jsonwebtoken`'s `jwt.verify` alongside `process.env.JWT_SECRET` to decode the token.
    4. Return the decoded `userId` if valid, otherwise return null.
  </action>
  <verify>
    npx tsc --noEmit
  </verify>
  <done>
    Utility function correctly typed and handles missing headers/invalid signatures safely without crashing the server.
  </done>
</task>

## Success Criteria
- [ ] `Category`, `Vendor`, and `Transaction` models are available in `src/models`.
- [ ] `verifyApiRequest` function is ready to be used by Next.js App Router API endpoints.
