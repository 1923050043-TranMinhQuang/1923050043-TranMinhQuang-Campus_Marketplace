# AI_LOG — Campus Marketplace (Topic 02)

Student: **1923050043 — Tran Minh Quang**  
Tooling used: **Cursor agent (Composer)** and **Google Gemini** while implementing, auditing, and refining the final project.

This log is required by the brief. It records what was asked, what was accepted, and what was rejected throughout the project lifecycle.

---

## Session 1 — Initial Project Scaffolding & Core Architecture (Cursor Agent)

### Asked
- Read `FinalProject_Topic02_Campus_Marketplace.docx` and implement the initial product architecture against must-haves, should-haves, and technical requirements (Expo Router, Zustand stores with selectors, TanStack Query, SecureStore, offline banner, automated tests, README, AI_LOG).

### Accepted
- Expo Router app structure: sign-in, Browse / Favourites / Cart / Account tabs, dynamic route `listing/[id]`, create listing screen, checkout **modal**, and `+not-found`.
- Zustand stores with selectors for auth, favourites (persisted across restarts), and cart (persisted session, reset on complete sign-out); session token securely stored via SecureStore (AsyncStorage on web only).
- TanStack Query with AsyncStorage persister for catalogue data caching; remote listings structure with local merge for seller-created listings.
- Category filter and text search computed during render via `filterListings` (never stored as derived state).
- Checkout pure functions with delivery rule and stock availability enforcement; compression proof UI on listing creation.
- Offline banner when displaying the last successful catalogue without showing a blank screen; pull-to-refresh with visible last-updated timestamp.
- Role-driven views on listing details driven strictly by `user.role` (seller vs buyer).
- Local notification trigger structure for favourited items' price changes.
- Centralised colour tokens exclusively in `constants/tokens.ts`; reusable `ScreenState` component handling loading / empty / error+retry / content states.
- Automated tests: checkout logic, filters, `AppButton` component, and cart stock critical path.

### Rejected / Corrected
- **Putting filtered listings in `useState` / `useMemo` as a "source of truth"** — Rejected; brief strictly requires filter/search computed during render. Kept only the input query and selected category in state.
- **Using raw phone photo without compression** — Rejected; always execute ImageManipulator resize + JPEG compression and display before/after byte sizes with resolution proof.
- **Hex colours scattered in screens** — Rejected; moved all colours into semantic token keys (`t.background`, `t.text`, `t.tint`, `t.onTint`, etc.).
- **Relying on SecureStore alone on web** — Rejected after observing web platform limitations; implemented explicit AsyncStorage fallback for web demo while keeping native strictly on SecureStore.
- **Treating DummyJSON POST as durable backend storage** — Rejected; persisted seller-created listings in local storage so that newly created items are never lost on catalogue re-fetch.

---

## Session 2 — Catalogue Polish, Stock Deduction & Demo Hardening (Google Gemini)

### Asked
- Audit the remote product seed data and replace inaccurate images with authentic, realistic furniture and accessory photos.
- Troubleshoot why newly created seller listings were not showing up or were being filtered out on the Home screen.
- Fix bug where purchasing newly created seller listings did not reduce remaining stock on the UI while standard seed items reduced normally.
- Neutralise demo identity: change hardcoded sample user credentials from personal names to compliant academic identities ("Sinh viên A" for buyer, "Sinh viên B" for seller) and unify the demo password to `demo`.
- Verify full compliance with the final project brief rubrics (Must-haves, Should-haves, Technical Requirements, Git repo, and Deliverables).

### Accepted
- Curated and updated high-quality, authentic product seed data in `services/api.ts` across all 5 campus categories (Clothing, Electronics, Furniture, Textbooks, Other).
- Unified demo accounts in `services/auth.ts` and `app/(auth)/sign-in.tsx`:
  - Buyer role: **Sinh viên A** (Password: `demo` or `buyer123`)
  - Seller role: **Sinh viên B** (Password: `demo` or `seller123`)
  - Streamlined one-click role switching with auto-filled credentials for presentation convenience.
- Synchronised stock delta deduction for both seed products and seller-created listings within `fetchCatalogue()` in `services/api.ts`.
- Verified persistent session behaviour and complete sign-out flow in `app/_layout.tsx` and `stores/authStore.ts` according to evaluation criteria.

### Rejected / Corrected
- **Auto-signing out on every app start** — Rejected; the brief explicitly mandates *"a persistent session and a complete sign-out"*. Automatically logging out on app launch would break the persistent session requirement. Kept session restoration intact upon restart, reserving sign-out strictly for user-initiated sign-out.
- **Hardcoded filtering of "test" in `readLocalListings()`** — Corrected; discovered an early filter that discarded any listing with title "test", which caused user test listings to disappear silently after successful creation.
- **Skipping stock deltas on local listings in `fetchCatalogue()`** — Corrected; the original implementation only mapped `delta = deltas[p.id]` over `SEED_PRODUCTS`, leaving `local` listings with unreduced stock upon checkout. Updated `fetchCatalogue()` to map stock deltas over both arrays.

---

## Things the Assistant Got Wrong That We Caught (For Reflection)

1. **Missing Stock Deduction on User-Created Listings (`services/api.ts`)**:
   - *What the AI did:* In `fetchCatalogue()`, the AI only subtracted stock deltas (`Math.max(0, p.stock - delta)`) for the static seed array (`SEED_PRODUCTS`), but concatenated `readLocalListings()` directly without applying `deltas[p.id]`.
   - *How we caught and fixed it:* During checkout testing of a newly published item ("abc"), standard items reduced stock correctly while the custom item remained stuck at its initial stock. We traced the data pipeline in `fetchCatalogue()` and added the delta subtraction map to `local` listings before concatenation.

2. **Silent Discard of Test Listings (`readLocalListings`)**:
   - *What the AI did:* The AI previously inserted `.filter((item) => item.title.trim().toLowerCase() !== 'test')` inside `readLocalListings()`.
   - *How we caught and fixed it:* When testing listing creation with the title "test", the app returned a "Creation Success" alert but the item never rendered on the Browse screen. We identified and removed this artificial filtering rule.

3. **Session Auto-Logout Misinterpretation**:
   - *What the AI initially suggested:* Adding an unconditional `signOut()` inside `app/_layout.tsx` to force the login screen on every launch.
   - *How we caught and fixed it:* We cross-referenced with the brief's Must-Have requirement: *"persistent session and a complete sign-out"*. Forcing logout on launch would fail the persistent session criteria; the proper solution was preserving stored session and demonstrating manual sign-out during the viva.

---

## Ongoing Rule for the Team
- Any further AI prompts (UI polish, bug fixes, deployment) must be appended here with **Asked / Accepted / Rejected**.
- Do not paste secrets, API keys, or personal credentials into this log.