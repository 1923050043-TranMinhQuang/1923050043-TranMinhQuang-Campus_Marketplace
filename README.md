# Campus Marketplace (Topic 02)

Buy-and-sell app for a single campus: listings with photos, categories, search, favourites, cart, and checkout summary.

**Student:** 1923050043 — Tran Minh Quang

**Course:** Mobile App Development (Lập trình Mobile) — TH7011101 (23DTH1)

**Stack:** Expo SDK 58 · TypeScript · Expo Router · Zustand · TanStack Query

## Prerequisites

* Node.js 20+ (LTS recommended)

* npm 10+

* Expo Go on a physical device **or** an Android/iOS emulator

  *(Camera, SecureStore, and local notifications work best on a real device / Expo Go)*

## Run from a clean machine

```
git clone (https://github.com/1923050043-TranMinhQuang/1923050043-TranMinhQuang-Campus_Marketplace.git)
cd 1923050043-TranMinhQuang-Campus_Marketplace
npm install
npx expo start


```

Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with **Expo Go**.

### Useful scripts

| Command | Purpose | 
| ----- | ----- | 
| `npm start` | Start Expo dev server | 
| `npm test` | Run automated Jest tests (pure logic, component, critical path) | 
| `npm run typecheck` | Strict type checking (`tsc --noEmit`) | 
| `npm run lint` | Code quality check (`expo lint`) | 

## Demo accounts

| Role | Display Name | Password | 
| ----- | ----- | ----- | 
| **Buyer** (Người mua) | Sinh viên A | `demo` | 
| **Seller** (Người bán) | Sinh viên B | `demo` | 

*Note: Any student name (2+ characters) with password `demo` works for the selected role.*

## What to try in the demo

1. **Sign in as Buyer (Sinh viên A)**:

   * Select role "Người mua", tap "Đăng nhập" (prefilled with `Sinh viên A` / `demo`).

   * Browse catalogue: category tabs (Phụ kiện, Đồ điện tử, Nội thất, Quần áo, Khác) and real-time text search computed during render.

2. **Favourites (Shared State & Persistence)**:

   * Tap heart icon on any listing → check badge and open **Favourites** tab.

   * Close/kill app and reopen: favourite items remain saved via `AsyncStorage`.

3. **Cart & Stock Enforcement**:

   * Add item to cart → adjust quantity up to available stock.

   * Proceed to **Checkout modal**: verify subtotal, delivery fee rule (free inside campus for orders \$\\ge 200,000₫
