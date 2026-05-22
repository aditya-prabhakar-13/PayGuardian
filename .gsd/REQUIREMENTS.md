# REQUIREMENTS.md

## Format
| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | Single project (monorepo) supporting static export for Capacitor client and server mode on Vercel | SPEC Constraints | Pending |
| REQ-02 | Setup next-auth (Auth.js v5) with Google Provider exchanging credentials for JWT | SPEC Goal 4 | Pending |
| REQ-03 | Deep-link authentication handler redirecting `payguardian://auth-callback?token=<jwt>` to store token in Capacitor Preferences | SPEC Goal 4 | Pending |
| REQ-04 | Custom Kotlin Capacitor plugin built as a separate npm package linked locally to launch UPI intents and retrieve payment results | SPEC Goal 5 | Pending |
| REQ-05 | MongoDB Mongoose schemas for Users, Categories, Vendors, and Transactions | SPEC Constraints | Pending |
| REQ-06 | JWT authorization middleware verifying `Bearer <jwt>` for all protected Next.js API routes | SPEC Constraints | Pending |
| REQ-07 | Dexie.js schema setup to cache vendors, categories, and queue pending transactions locally | SPEC Goal 3 | Pending |
| REQ-08 | Full UI workflow: QR Scanner (Capacitor ML Kit) -> Vendor Lookup -> Category Selector -> Confirmation -> Custom UPI Plugin -> Result Screen | SPEC Goal 1, 2 | Pending |
| REQ-09 | Dashboard with hemi-donut chart (Recharts) showing MTD spending per category | Success Criteria | Pending |
| REQ-10 | Settings screens: Category CRUD (budget/color), Vendor management, paginated Transaction history | Success Criteria | Pending |
| REQ-11 | Offline-first sync manager processing transaction queue on network recovery | SPEC Goal 3 | Pending |
| REQ-12 | Public repository files: ESLint/Prettier configs, GitHub Actions CI workflow, `.env.example`, MIT license, and comprehensive README | Success Criteria | Pending |
