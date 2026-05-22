# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A personal-use, multi-user architected Android app that acts as a unified entry point and expense ledger for UPI payments by intercepting payment intent before handoff to official UPI apps and capturing the result.

## Goals
1. **Unified Entry Point:** Intercept all QR and manual UPI payment intents.
2. **Unified Expense Ledger:** Automatically log transactions under user-defined categories.
3. **Offline-First Resilience:** Support transaction creation and local caching offline, syncing automatically once reconnected.
4. **Clean Mobile Google Auth:** Implement secure Google OAuth token exchange returning a JWT to Capacitor.
5. **Robust UPI Intent Bridging:** Write a custom Kotlin Capacitor plugin to launch UPI apps and return payment status.

## Non-Goals (Out of Scope)
- iOS application development (Android only).
- Direct processing of UPI payments (rely entirely on official UPI apps).
- SMS transaction parsing, recurring payments, multi-currency support.
- Push notifications, receipt OCR, bank statement reconciliation.
- Sharing/social ledgers or admin panel interface.

## Users
Personal users who use multiple UPI apps (GPay, PhonePe, Paytm, etc.) and want a single source of truth for budgeting and transaction tracking.

## Constraints
- **Language:** TypeScript end-to-end.
- **Frontend & Backend:** Next.js 14+ (App Router) on Vercel (API routes) and static export bundled into Capacitor.
- **Mobile Wrapper:** Capacitor 6+.
- **Database:** MongoDB Atlas (free M0 tier) with Mongoose.
- **Auth:** NextAuth.js (Auth.js v5) with Google OAuth and a custom JWT deep-link bridge.
- **Offline Storage:** IndexedDB via Dexie.js.

## Success Criteria
- [ ] Sign in with Google on a real Android device using secure JWT exchange.
- [ ] Scan a UPI QR code, automatically matching existing vendor/category or requesting one.
- [ ] Launch custom Kotlin plugin to trigger external UPI app, make payment, and capture intent result.
- [ ] Log transaction locally (offline support) and sync with MongoDB Atlas database.
- [ ] Display an accurate dashboard with category-wise budgeting via Recharts.
- [ ] Document research and release a fully functional, recruiter-ready repository.
