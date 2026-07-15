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

The app has exactly two roles:

- **ProductManager** — full CRUD on products and categories.
- **User** — read-only access to products and categories.

As of now `RegisterCommand`/`LoginCommand`/`TokenResponse` in `src/types/api.d.ts` carry no role field and nothing in `src/` reads or branches on a role yet — this split is not implemented in the frontend. When building or verifying product/category CRUD screens (create/edit/delete forms, buttons, etc.), gate them by role, and confirm with a ProductManager account that writes work and with a plain User account that write actions are hidden or rejected. If the generated API types still don't expose a role by then, check with the backend/API contract before assuming a shape.
