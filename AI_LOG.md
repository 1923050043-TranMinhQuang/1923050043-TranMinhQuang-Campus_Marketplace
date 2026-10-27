# AI_LOG — Campus Marketplace (Topic 02)

Team / student: **1923050043 — Tran Minh Quang**  
Tooling used: Cursor agent (Composer) while implementing the final project.

This log is required by the brief. It records what was asked, what was accepted, and what was rejected.

---

## Session — build Topic 02 from brief

### Asked
- Read `FinalProject_Topic02_Campus_Marketplace.docx` and implement the product against must-haves, should-haves, and technical requirements (Expo Router, stores with selectors, TanStack Query, SecureStore, offline banner, tests, README, AI_LOG).

### Accepted
- Expo Router app structure: sign-in, Browse / Favourites / Cart / Account tabs, dynamic `listing/[id]`, create listing, checkout **modal**, `+not-found`.
- Zustand stores with selectors for auth, favourites (persisted), cart (persisted); session token in SecureStore (AsyncStorage on web only).
- TanStack Query + AsyncStorage persister for catalogue; DummyJSON as remote API; local merge for created listings.
- Category + text search computed in render via `filterListings` (not stored as derived state).
- Checkout pure functions with delivery rule and stock messages; compression proof UI on create.
- Offline banner when serving last successful catalogue; pull-to-refresh + last-updated label.
- Seller vs buyer chrome on listing detail driven by `user.role`.
- Local notification when a favourited item’s price changes after a successful refresh.
- Colour tokens only in `constants/tokens.ts`; ScreenState for loading / empty / error+retry / content.
- Automated tests: checkout logic, filters, `AppButton` component, cart stock critical path.
- README with clean-machine run steps and demo accounts.

### Rejected / corrected
- **Putting filtered listings in `useState` / `useMemo` as “source of truth”** — rejected; brief requires filter/search computed during render. Kept only the input query/category in state.
- **Using raw phone photo without compression** — rejected; always run ImageManipulator resize+JPEG and show before/after sizes.
- **Hex colours scattered in screens** — rejected; moved button/label colours into token `onTint` and rewired `+html.tsx` to read tokens.
- **Relying on SecureStore alone on web** — rejected after docs/platform limits; added explicit AsyncStorage fallback for web demos only; native still uses SecureStore.
- **Blind trust of memorised Expo API paths** — corrected via project `AGENTS.md` / docs index; used SDK 58-compatible `expo install` packages already in the tree.
- **Treating DummyJSON POST as durable storage** — rejected; still call it to show remote create, but persist user listings in AsyncStorage so the catalogue does not “lose” new posts.

### Things the assistant got wrong that a human should catch (for the reflection)
1. Early draft of `dangerMuted` token had a typo (`#F purred`) — fixed before shipping.
2. Seller/buyer listing view briefly mixed “ownership” checks with role; brief wants **role-driven** views — simplified to `user.role`.
3. First dependency install failed on TLS (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`) in this environment — not an app bug; retry with system CA / offline-friendly npm was needed.

---

## Ongoing rule for the team
- Any further AI prompts (UI polish, bug fixes, EAS) should be appended here with **Asked / Accepted / Rejected**.
- Do not paste secrets or real passwords into this log beyond the documented demo accounts.
