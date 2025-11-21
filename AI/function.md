# Function Specification: User Signup & Login Feature

This document defines the requirements and implementation rules for the user signup and login system.  
All rules in AGENTS.md must be strictly followed.  
This feature implements a minimal authentication flow using CSV-based storage and localStorage session handling.

---

# Purpose
Provide a simple authentication mechanism for the application, enabling:
- Account creation (email + password)
- Login with existing credentials
- Local session persistence
- Access control (only logged-in users can visit protected pages)

This is not a security-focused system; it is only for AI-driven development scaffolding.

## Scope
This specification covers:
- Signup and login UI pages
- Dashboard guard behavior
- Translation handling for auth UI, including language preference persistence in localStorage (default to English when absent)
- UI component construction following AGENTS.md rules
- No password hashing or external auth

---

# Files & Directories

## CSV Storage
Create:

```
db/users.csv
```

### CSV Columns
```
id,email,password,created_at
```

### Rules
- `id` is UUIDv4 (string)
- Emails must be unique
- Password is stored as plain text (no hashing)
- `created_at` is ISO string
- Never use null/undefined. Empty string only.
- No quotes around values
- LF (`\n`) only

---

# UI Requirements

## 1. Signup Page
Location:

```
src/app/(public)/signup/page.tsx
```

UI with fields:
- Email input
- Password input
- Signup button

Validation:
- Email required
- Password required
- If email already exists → error message

On success:
- Save user to CSV via logic layer
- Redirect to `/login`

Use shadcn/ui components:
- `<Input>`
- `<Label>`
- `<Button>`
- `<Card>` container

---

## 2. Login Page

Location:

```
src/app/(public)/login/page.tsx
```

UI with:
- Email input
- Password input
- Login button

Behavior:
- If credentials match → Save session to localStorage:

```json
{
  "login": true,
  "userId": "UUID",
  "email": "user@example.com"
}
```

- Redirect to `/dashboard`
- If mismatch → show error

---

## 3. Protected Page (Dashboard)

Create a simple placeholder page:

```
src/app/dashboard/page.tsx
```

Rules:
- If `localStorage.login !== true` → redirect to `/`
- Display a simple greeting using the logged-in email address
- Include logout button  
  → on click: `localStorage.clear()` → `router.push("/")`

This page must be **client-side only** (`"use client"`).

---

# Component Structure

Follow AGENTS.md component rules.

Components:

```
src/components/auth/
  SignupForm.tsx
  LoginForm.tsx
```

Each:
- Receives translations as props
- Emits onSuccess callbacks
- Contains no business logic (validation + UI only)

Type definitions:

```
src/types/auth.ts
```

---

# Logic Requirements

All business logic must be stored under:

```
logic/auth/
  createUser.ts
  findUserByEmail.ts
  verifyCredentials.ts
```

UI からは `app/api/auth/*/route.ts` を経由してこれらの関数を呼び出す（直接 CSV に触れない）。

## 1. createUser.ts
Input: `{ email: string; password: string }`  
Actions:
- Load CSV
- Check for email duplication
- Insert new row with UUIDv4 and timestamp
- Save CSV
- Return `Result<{ id: string }>` (never throw)

## 2. findUserByEmail.ts
Search users.csv by email  
Return `Result<User | null>`

## 3. verifyCredentials.ts
Input: email, password  
Logic:
- findUserByEmail
- Compare plain-text password
- Return success/failure via Result type

---

# CSV Reading/Writing
Must use only:

```
utils/csv/readCsv.ts
utils/csv/writeCsv.ts
```

Never access fs directly from logic.

---

# Session Handling
Client-side only:

- `localStorage.setItem("session", JSON.stringify({...}))`
- `localStorage.removeItem("session")` for logout
- Protected components check this session object

No cookies, no tokens, no encryption.

---

# Error Handling (strict)
All logic functions return:

```
Result<T>
```

Rules:
- No exceptions thrown
- UI handles errors
- Error messages short & English only (e.g., `"email_exists"`, `"invalid_credentials"`)

---

# Acceptance Criteria

Signup:
- When email is unique → CSVに保存 / redirect to login

Signup error:
- Existing email → UI shows error  
- CSV is unchanged

Login:
- Matching credentials → session saved / redirect to dashboard
- Mismatch → error message

Dashboard:
- Requires login
- load welcome message
- logout clears session & redirects home

Code must:
- Follow AGENTS.md naming conventions
- Follow TypeScript strict mode
- Separate logic, UI, utils
- Use Shadcn UI components
- Include full JSDoc on functions
- Zero thrown exceptions

---

# Out of Scope
- No password hashing
- No email verification
- No real security
- No JWT or backend auth
- No rate limiting
- No API endpoints
