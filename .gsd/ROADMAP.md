# ROADMAP.md

> **Current Phase**: 1
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [x] Next.js 14+ Monorepo (Static Export client, Server API backend)
- [x] Google OAuth JWT-based Capacitor flow (`payguardian://auth-callback`)
- [ ] Local-linked custom Kotlin Capacitor plugin for UPI intent processing
- [ ] Offline-first IndexedDB (Dexie) architecture with sync queue
- [ ] QR code scanning & auto vendor category matching
- [ ] Dashboard budgeting visualizer (hemi-donut chart)

## Phases

### Phase 1: Project Skeleton & Auth SPIKE
**Status**: ✅ Complete
**Objective**: Setup monorepo codebase, dual-mode Next.js config, Capacitor init, Mongo connection, NextAuth Google OAuth with custom JWT mobile redirect.
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-12

### Phase 2: UPI Intent Capacitor Plugin SPIKE
**Status**: ⬜ Not Started
**Objective**: Build and locally link custom Kotlin Capacitor plugin. Fire UPI intents to GPay, Paytm, and PhonePe, capturing and documenting response payloads.
**Requirements**: REQ-04

### Phase 3: Data Layer & Offline Setup
**Status**: ⬜ Not Started
**Objective**: MongoDB Mongoose schemas, JWT verification API middleware, Dexie.js schema setup, and local data synchronization queue design.
**Requirements**: REQ-05, REQ-06, REQ-07, REQ-11

### Phase 4: Scanning & Payment Flow
**Status**: ⬜ Not Started
**Objective**: Integrate QR scanning, vendor lookup APIs, amount entry, category mapping, confirmation screens, and launch custom UPI plugin.
**Requirements**: REQ-08

### Phase 5: Transaction Logging & Dashboard
**Status**: ⬜ Not Started
**Objective**: Write transaction logs, sync queues, update budget calculations, render dashboard hemi-donut chart, and implement status indicators.
**Requirements**: REQ-09, REQ-11

### Phase 6: Settings & Management
**Status**: ⬜ Not Started
**Objective**: Category CRUD (limits/colors), vendor modification panel, account details, and paginated transaction history log.
**Requirements**: REQ-10

### Phase 7: Polish & CI/CD
**Status**: ⬜ Not Started
**Objective**: Address edge cases, handle camera permissions, deploy backend to Vercel, setup GitHub Actions, document README, and generate release-ready Android APK.
**Requirements**: REQ-12
