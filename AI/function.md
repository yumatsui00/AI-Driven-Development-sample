# Function Specification: Login-Gated Routing & /home Page

This function.md defines the authenticated routing and the `/home` protected page.  
All rules in AGENTS.md must be followed strictly.  
Authentication is localStorage-based and NOT secure; it is only for development scaffolding.

---

# Purpose

Implement a simple authenticated routing system:

- `/home` → requires login  
- `(authenticated)/home/page.tsx` → only logged-in users can see  
- `(public)/...` → only non-logged-in users should see  
- Redirection rules depending on login state  
- Landing page CTA (“Start Now”) behavior:
  - Logged-in → `/home`
  - Logged-out → `/login`

Authentication state is stored only in `localStorage.session`.

---

# Directory Structure

Create directories:

```
src/app/(authenticated)/home/page.tsx
src/app/(public)/...
src/middleware.ts
src/utils/session.ts
```

The middleware will enable client-side-like gating at route boundaries.

---

# Session Specification

Session stored in localStorage:

```json
{
  "login": true,
  "userId": "string",
  "email": "string"
}
```

- `"login": true` is the indicator
- No expiration required
- Logout clears session

---

# Routing Rules

## 1. Authenticated Zone: `/home`
- Only accessible if `localStorage.session.login === true`
- Otherwise redirect to `/`

Located under:

```
src/app/(authenticated)/home/page.tsx
```

This file **must be a client component** (`"use client"`).

---

## 2. Public Zone: `(public)`
Includes:
- Landing page `/`
- `/login`
- `/signup`

Rules:
- If a logged-in user tries to access any public route → redirect to `/home`

---

## 3. Redirect Logic Summary

| 状態 | アクセス先 | 結果 |
|------|------------|-------|
| 未ログイン | /home | `/` に強制リダイレクト |
| ログイン済み | /login, /signup, / など public | `/home` に強制リダイレクト |
| LandingPage Start Now | ログイン済み | `/home` |
| LandingPage Start Now | 未ログイン | `/login` |

---

# Middleware Requirements

Create `src/middleware.ts`.

### Rules:
- Middleware **MUST NOT read localStorage** (server-side)
- Instead, allow all requests and rely on client-side redirect

Thus, middleware does NOT enforce redirects.  
Redirection is entirely client-side using hooks inside layout wrappers.

Middleware is only used to declare route groups:

```ts
export const config = {
  matcher: ["/((authenticated)/:path*)", "/((public)/:path*)"]
};
```

No business logic in middleware.

---

# Client-Side Redirect Enforcement

Create:

```
src/components/auth/RequireAuth.tsx
src/components/auth/RedirectIfLoggedIn.tsx
```

### `RequireAuth`
- Used in `(authenticated)` layout
- On mount:
  - if session.login !== true → `router.replace("/")`
- Render children if logged in

### `RedirectIfLoggedIn`
- Used in `(public)` layout
- On mount:
  - if session.login === true → `router.replace("/home")`

Both must be `"use client"` components.

---

# Home Page Requirements

Create:

```
src/app/(authenticated)/home/page.tsx
```

### Requirements:
- `"use client"`
- Use `RequireAuth` wrapper inside layout OR directly
- Display:
  - User greeting
  - Logout button
- Logout clears session + redirect to `/`

Example structure (not code):

```
<HomeLayout>
  <RequireAuth>
     <HomePageContent />
  </RequireAuth>
</HomeLayout>
```

---

# Public Layout Requirements

```
src/app/(public)/layout.tsx
```

Use `RedirectIfLoggedIn` to block logged-in users from accessing public pages.

Should wrap all pages under `(public)`.

---

# LandingPage Start Now Behavior

Inside `LandingHero.tsx`:

- Add a button: “Start Now”
- On click:

```
if (session.login === true) router.push("/home")
else router.push("/login")
```

This requires `"use client"` in LandingHero.

Text comes from translation JSON.

---

# Utils

## `src/utils/session.ts`

### Exports:
- `getSession(): Session | null`
- `setSession(data: Session): void`
- `clearSession(): void`
- Type definitions stored in `src/types/auth.ts`

Session must be read only inside client components.

---

# Acceptance Criteria

- `/home` cannot be accessed without login → redirect to `/`
- Public pages cannot be accessed when logged in → redirect to `/home`
- Start Now redirects according to login state
- Home page loads user data from session
- Logout works correctly
- No sensitive logic in middleware
- All redirects must be **client-side only**
- All files follow TypeScript strict, naming rules, directory rules from AGENTS.md
- No thrown exceptions in logic

---

# Out of Scope
- No server-side authentication
- No JWT
- No HTTP-only cookies
- No user roles
- No API routes

