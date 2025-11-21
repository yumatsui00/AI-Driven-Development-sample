# Function Specification: Landing Page Design

This function.md describes the landing page UI implementation for the `landingpage-design` branch.  
No backend logic, DB interaction, or authentication implementation is required.  
Only UI, i18n handling, and component structure must be created.

## Purpose
Create a stylish, modern landing page for the AI-driven Trello-like app.  
This page serves as the app’s public entry and provides:
- Introduction and visual appeal
- Links to login / sign-up (UI only)
- Language switcher (functional only for UI text replacement)

## Scope
This specification covers:
- Landing page layout and visuals
- Header with language switcher + login / sign-up buttons
- Translation loading mechanism (client-side only)
- UI component construction following AGENTS.md rules
- No DB writes, no user authentication, no real account processing

---

# UI Requirements

## 1. Page Layout
Use the following structure under the root route `src/app/page.tsx` (rendering the landing layout/component):

- A full-width hero section
- Centered tagline and short description
- A CTA button (e.g., "Start now")
- Clean, minimalistic Shadcn UI components
- Light mode only（ダークモード不要）
- Responsive design (tailwind default utilities)

Design should appear similar to modern SaaS landing pages, with:
- Spacious layout  
- Big bold headline  
- Minimal iconography  
- Soft shadows（tailwind shadow-lg程度）

---

# Header Requirements

## 2. Header UI
Place a header at the top of the page with:

### Left side（画面左上）
- **Language selector (button icon + dropdown)**  
  - Options: `JP`, `EN`, `FR`
  - Use client-side state
  - Selection changes text by loading JSON from `assets/translations`

### Right side（画面右上）
- **Login button**
- **Sign up button**

Buttons should use Shadcn UI:
- `<Button variant="ghost">` for Login
- `<Button variant="default">` for Sign Up

NO routing implementation is required.  
Buttons may have `href="#"` or placeholder onClick.

---

# Translation Requirements

## 3. Translation Files
Create translation files:

```
assets/translations/jp.json
assets/translations/en.json
assets/translations/fr.json
```

Each file should include at least:

```json
{
  "appName": "XXX",
  "tagline": "XXX",
  "description": "XXX",
  "cta": "XXX",
  "login": "Login",
  "signup": "Sign Up",
  "language": "Language"
}
```

The text can be dummy; content is not important here.  
UI must dynamically switch between JSON values.

Implement a simple translation loader:

- Load all JSON statically (import)
- Keep selected language in component state
- Provide a utility function: `src/utils/i18n.ts`

No external libraries (e.g., i18next) allowed unless added to requirements.txt.

---

# Component Structure Requirements

## 4. Components
Follow AGENTS.md rules strictly:

```
src/
  components/
    landing/
      LandingHeader.tsx
      LandingHero.tsx
      LandingLayout.tsx
```

- `LandingHeader.tsx`  
  Contains language selector + login/sign-up buttons.

- `LandingHero.tsx`  
  Contains title, description, CTA button.

- `LandingLayout.tsx`  
  Wraps header + hero. No business logic.

All components:
- Should be functional components
- Must include JSDoc comments
- Use TypeScript strict types
- Props types stored in `src/types/landing.ts`

---

# Logic Requirements

## 5. i18n Handling (client-side only)
Implement `src/utils/i18n.ts`:

- `loadTranslation(lang: Lang): TranslationObject`
- Synchronous import only
- No async FS, no external API calls

Type definitions:

```ts
export type Lang = 'jp' | 'en' | 'fr';

export interface TranslationObject {
  appName: string;
  tagline: string;
  description: string;
  cta: string;
  login: string;
  signup: string;
  language: string;
}
```

State management:
- Use `useState` inside layout/landing page
- Pass translations down as props

---

# Out of Scope
The following must NOT be implemented:
- Real authentication
- Real routing to dashboard
- DB/CVS logic
- API calls
- User account creation
- Login session handling

---

# Acceptance Criteria

- Landing page renders without errors (`npm run dev`)
- Buttons and layout follow Shadcn UI style
- Language switching updates all visible text
- All code respects AGENTS.md coding rules
- All component and utility files follow naming conventions
- No logic outside logic directories (except i18n util)
- Page is visually clean, modern, and responsive

