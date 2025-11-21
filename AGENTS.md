# Repository Guidelines

This project is a Trello-like web app, but the true goal is an AI-driven development template. Always read `base.txt` and the branch-specific `AI/function.md` before coding; keep TypeScript strict enabled and honor the rules below.

## Structure & Imports
- Root contains `src`, `AI`, `tests`, `db`, `logic`, `scripts`, `assets`, and `requirements.txt`. Next.js App Router lives under `src/app`; shared UI under `src/components`; utilities under `src/utils`; types under `src/types`; business logic under `logic/`. Import from the root with `@/*`.
- Do not write files outside these directories. Keep CSV data in `db/`. Place static assets in `assets/`; translation files live under `assets/translations/` (e.g., `assets/translations/jp.ts`).

## Naming, Style, Comments
- Components: PascalCase files; logic: camelCase file name aligned with the main behavior; DB helpers: snake_case; types: PascalCase; utils: camelCase; API routes use `route.ts`; CSS uses kebab-case.
- All functions require JSDoc (summary, params, returns, errors if not Result-based). No file-level header comments. Comments in English only; prefer “why” over “what.”
- UI style: shadcn/ui + Tailwind. Wrap shadcn components in `src/components/ui`. Custom styling only when necessary; prefer composition.
- UI copy policy: no hardcoded strings in components. All UI text must be sourced from translation files under `assets/translations/`, with keys grouped by domain. Components may import translation helpers/objects but must not inline literals.

## Data & CSV Rules
- No remote DB. Persist to CSV in `db/` with UTF-8 and LF newlines. First row is headers; include an `order` column for ordering.
- IDs are strings generated via `generateId()` (UUIDv4). Never use incremental IDs.
- Do not wrap CSV strings in double quotes. Represent nulls as empty strings; never write `null`/`undefined`.
- All file IO goes through shared helpers in `src/utils/csv/`. Conversion must keep header-to-key 1:1. Add by reading all, appending, and writing all; update by ID replacement; delete by recreating without the removed rows.

## Error Handling & Logging
- Logic returns `Result` types; throwing in logic/utils is forbidden. CSV failures return an error `Result<null>`. UI handles failures at the boundary.
- Error messages are short, technical, and in English. Logging is limited to `console` (prefer `console.error` for errors).

## Component & Logic Boundaries
- Page components contain no business logic. Place domain logic in `logic/`; domain UI goes under `src/components/<domain>`; hooks manage local form/state; keep components single-responsibility.

## Tests
- Add tests after features stabilize. Test only logic (no UI tests): unit tests for pure functions, repository tests for CSV IO, and integration for task/project flows (create → CSV → read → delete). Place tests in `tests/` mirroring `logic/` and `src/utils/`.

## Branching, PRs, and AI Review
- Branch naming: `feature/*`, `fix/*`, `refactor/*`, `chore/*`. No direct pushes to `main`; integrate via `dev` → `main`. Keep `main` buildable.
- PR flow: create branch → update `AI/function.md` → implement with Codex → open PR → AI code review → fix per review → add tests → merge to `dev` → merge to `main` after stabilization.
- AI code review (local diff mode): run only when requested. Developer executes `./scripts/review.sh`, which generates `.ai/diff.txt` and `.ai/review_prompt.txt`. Reviews must use `AGENTS.md`, `AI/function.md`, and the diff in `.ai/review_prompt.txt` as the single sources of truth. Report only comments (no code fixes) covering: specification consistency, security risks, TypeScript strict issues, error handling correctness, CSV/IO handling, logic consistency, and recommended tests. Do not modify source files during review.

## Commands
- Install and run: `npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm start`. Keep dependency versions pinned in `package-lock.json` and list Python deps (if any) in `requirements.txt`.
