---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Project Skeleton & Auth SPIKE

## Objective
Initialize the Next.js 14 monorepo with Tailwind CSS and Capacitor 6. Setup the MongoDB connection and Mongoose User model. Implement NextAuth.js v5 Google OAuth with a custom JWT mobile callback mechanism (`payguardian://auth-callback?token=<jwt_token>`) to allow secure native authentication.

## Context
- [.gsd/SPEC.md](file:///d:/PayGuardian/.gsd/SPEC.md)
- [.gsd/REQUIREMENTS.md](file:///d:/PayGuardian/.gsd/REQUIREMENTS.md)
- [.gsd/ROADMAP.md](file:///d:/PayGuardian/.gsd/ROADMAP.md)
- [.gsd/phases/1/RESEARCH.md](file:///d:/PayGuardian/.gsd/phases/1/RESEARCH.md)

## Tasks

<task type="auto">
  <name>Monorepo Initialization (Next.js 14, Tailwind, Capacitor 6)</name>
  <files>
    - package.json
    - tsconfig.json
    - next.config.js
    - tailwind.config.ts
    - postcss.config.js
    - capacitor.config.ts
    - src/app/layout.tsx
    - src/app/page.tsx
  </files>
  <action>
    1. Create a `package.json` with dependencies for Next.js, React, Tailwind, and Capacitor.
    2. Install packages using npm.
    3. Configure `tsconfig.json` for Next.js and TypeScript.
    4. Write `next.config.js` with dynamic `output: 'export'` toggling.
    5. Setup Tailwind CSS config files and postcss configuration.
    6. Initialize Capacitor with App ID `com.payguardian.app`, App Name `Pay Guardian`, and web directory `out`.
    7. Create basic Next.js layout and a single home page with a sign-in interface.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    Next.js project builds successfully under both standard mode and static export mode, generating files in `/out`. Capacitor is initialized successfully.
  </done>
</task>

<task type="auto">
  <name>Database Setup (Mongoose User Schema & Client)</name>
  <files>
    - src/lib/db.ts
    - src/models/User.ts
  </files>
  <action>
    1. Create database client connection using Mongoose, caching the connection to prevent multiple connections in serverless API routes.
    2. Design the User model with fields: `email` (unique, indexed), `name`, `image`, `google_id`, `created_at`, and `last_login_at`.
  </action>
  <verify>
    npx tsx -e "import './src/lib/db'; console.log('DB client loaded');"
  </verify>
  <done>
    Database connection script compiles and executes without errors, and User schema model is correctly defined.
  </done>
</task>

<task type="auto">
  <name>Google OAuth & Mobile JWT Callback Setup</name>
  <files>
    - src/auth.ts
    - src/app/api/auth/[...nextauth]/route.ts
    - src/app/api/auth/mobile-callback/route.ts
    - android/app/src/main/AndroidManifest.xml
  </files>
  <action>
    1. Configure NextAuth.js (Auth.js v5) with Google OAuth Provider and JWT session strategy.
    2. Create `/api/auth/mobile-callback` route which exchanges the NextAuth session for a signed JWT token containing user ID, then redirects browser to `payguardian://auth-callback?token=<signed_jwt>`.
    3. Add Deep Link intent-filter inside `android/app/src/main/AndroidManifest.xml` targeting `payguardian://auth-callback`.
    4. Install `@capacitor/browser`, `@capacitor/preferences`, and `@capacitor/app` to handle launching browser, listening to `appUrlOpen` deep-link event, and saving token.
  </action>
  <verify>
    npm run build
  </verify>
  <done>
    NextAuth backend routes and deep-link handler compile successfully. Deep link listener in client and native android config are established.
  </done>
</task>

## Success Criteria
- [ ] Next.js project is fully initialized and builds without TypeScript or compilation errors.
- [ ] Static export build mode generates client files in `/out` directory.
- [ ] Mongoose User model is defined and DB client helper is written.
- [ ] NextAuth v5 backend authentication routes are in place, with JWT redirection payload.
- [ ] Capacitor Android platform is configured with deep-linking intent filters.
