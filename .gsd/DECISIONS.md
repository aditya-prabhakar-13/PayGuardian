# DECISIONS.md

# Architecture Decision Records (ADRs)

This file tracks the key technical decisions made over the course of the project, their rationale, status, and alternatives considered.

## ADR-01: Single-Project Monorepo with Dual Build Configs
- **Status:** Approved
- **Context:** The mobile app requires client-side static assets bundled into Capacitor, while the backend API requires a Node/Next.js server-side environment on Vercel.
- **Decision:** Use a single Next.js project. We will configure next.config.js to allow static exports (`output: 'export'`) when targeted for mobile builds, and standard server builds for Vercel deployment.
- **Consequences:** Keeps all code, models, and shared types in a single repository. Requires managing static vs. dynamic imports and page components carefully.

## ADR-02: Google OAuth with JWT App Handshake
- **Status:** Approved
- **Context:** Capacitor WebViews struggle with NextAuth cookie persistence across different API domains.
- **Decision:** Open OAuth in `@capacitor/browser`. Have Vercel auth backend generate a custom JWT and deep-link back to the app (`payguardian://auth-callback?token=...`). The mobile app saves the token securely using `@capacitor/preferences` and attaches it via `Authorization: Bearer <jwt>` to API calls.
- **Consequences:** Safe, scalable mobile session management without CORS or cookie sharing issues.
