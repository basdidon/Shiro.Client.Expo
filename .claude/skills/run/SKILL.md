---
name: run
description: Use when asked to run, start, or preview the Shiro.Client.Expo app, or to verify a change works in the running app.
---

# Running Shiro.Client.Expo

This is an Expo Router app (Expo SDK 56 — read https://docs.expo.dev/versions/v56.0.0/ before relying on API behavior, since it changed significantly from older Expo versions).

## Prerequisites

- `npm install` if `node_modules` is missing.
- The app talks to a backend API at the URL in `.env` (`EXPO_PUBLIC_API_URL`, currently `http://192.168.1.37:5000`). That backend must already be running and reachable — this repo does not start it. If API calls fail, check the backend is up and the host/port in `.env` is reachable from the device/emulator/browser being used.

## Starting the app

- `npm run web` — runs in a browser (fastest loop for UI verification; static web output).
- `npm run android` — opens in an Android emulator/device.
- `npm run ios` — opens in an iOS simulator/device.
- `npm run start` — plain `expo start`, lets you pick a platform interactively.

## Notes for verification

- The app gates everything behind auth (`src/app/_layout.tsx`): unauthenticated users only see `login` and `register`; everything else requires `isAuthenticated`. To test authenticated screens you need a valid account on the backend — either register one via the in-app "สมัครสมาชิก" flow or use existing test credentials.
- Auth tokens persist via `expo-secure-store` (`src/lib/tokenStorage.ts`), so a logged-in session survives reloads until logout.
- `npm run lint` runs `expo lint`; there is no test suite configured in `package.json`.

## Roles & permissions

A user can hold more than one role at once. Roles are read from claims on the JWT access token (`src/lib/jwt.ts`, `getRolesFromToken`) and exposed as `roles: Role[]` on `useAuthStore` — gate screens with `roles.includes("x")`, not `role === "x"`.

Role names on the wire are **kebab-case** (e.g. `"order-manager"`, not `"OrderManager"`) — the backend switched formats; `src/lib/jwt.ts`'s `Role` union and `VALID_ROLES` are the source of truth for the exact strings.

The system has six roles:

- **super-admin** — assigns roles to users.
- **owner** — can add/remove lower roles on users.
- **order-manager** — full CRUD on order lines; can also set an order as completed or cancelled.
- **product-manager** — full CRUD on products and categories.
- **staff** — full CRUD on order lines (cannot complete/cancel an order).
- **user** — read-only access to their own orders.

Every authenticated user, regardless of role, can read products/categories and create orders.

What's actually gated in the frontend today:
- Product/category create/edit/delete (`(tabs)/products.tsx`, `(tabs)/categories.tsx`, `(tabs)/scanner.tsx`, `products/[id]/index.tsx`, `products/[id]/edit.tsx`, `categories/create.tsx`, `categories/[id]/edit.tsx`, and their `Stack.Protected` guards in `_layout.tsx`): **product-manager** only.
- Order line management — add via barcode scan, update quantity, remove (`orders/[id]/edit.tsx`, `orders/[id]/scan-item.tsx`): **order-manager** or **staff**.
- Completing/cancelling an order (`orders/[id]/edit.tsx`): **order-manager** only.
- User list + role assignment (`users/index.tsx`, `users/[id].tsx`, via `src/api/users/` and `src/hooks/useUsers.ts`): **super-admin** or **owner**. The role picker/remove buttons are driven by `GET /api/v1/users/assignable-roles`, not the raw six-role list, so it already reflects each caller's own hierarchy.

When building or verifying a role-gated screen, confirm with an account holding the relevant role that the action works, and with an account lacking it that the action is hidden or rejected.
