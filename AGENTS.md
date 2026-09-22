# maf-project

Platform for sports mafia clubs: clubs, venues, players, games (game types, roles, actions),
public website. Development plan: `ROADMAP.md`.

@.standards/AGENTS.md

## Stack
- `backend/` — NestJS 11, GraphQL (Apollo, code-first, schema in `src/schema.gql`), TypeORM, MySQL 8, JWT + argon2
- `frontend/` — Next.js 15 (App Router), React 19, next-intl v4 (`uk` default, `en`), Tailwind, shadcn/ui, Storybook
- Docker Compose for dev (`docker-compose.yml` + `.env.dev`)

## Commands
- `make dev` or `npm run dev` — start mysql, backend (:4000/graphql) and frontend (:3000) in docker
- `make db-up` — only the database (port 3307), for running backend/frontend locally
- `npm run check` (root, or inside `backend/` / `frontend/`) — lint, typecheck, tests, build.
  Run it before finishing any task.

## Project-specific rules (override the shared standards)
- **Framework conventions win.** NestJS needs classes, decorators and `enum` + `registerEnumType`
  for GraphQL enums; Next.js needs default exports for `page`/`layout`/`error`. Keep those.
- **Backend module layout:** one Nest module per entity in `backend/src/<entity>/`
  (`*.module.ts`, `*.resolver.ts`, `*.service.ts`, `dto/`, `entities/`). Business rules go into
  services, not resolvers.
- Validate inputs with `class-validator` on DTOs (global `ValidationPipe`).
- Backend formatting: single quotes, `arrowParens: avoid` (`backend/.prettierrc`).
- **i18n:** every user-facing string goes through next-intl. Add keys to both
  `frontend/messages/uk.json` and `en.json`; `en.json` is the source for message types.
- Pathnames for navigation are declared in `frontend/i18n/routing.ts`; use `Link`/`redirect` from
  `@/i18n/navigation`, not from `next/link`.
- Stories live next to components: `components/**/<name>.stories.tsx`.

## Auth model
- Every resolver requires a JWT unless marked `@Public()` (global guards in `auth/auth.module.ts`).
- Restrict with `@Roles(UserRole.ADMIN)` or `@Roles(UserRole.HOST)`; admins pass every role check.
- Ownership checks (e.g. `updateUser`) live in the resolver; get the caller with `@CurrentUser()`.
- New list queries take `@Args() pagination: PaginationArgs`.
- Schema changes: `npm run migration:generate -- src/migrations/<Name>` in `backend/`.

## Known gaps (see ROADMAP.md)
No initial migration yet (`synchronize` in dev), no refresh tokens.
Do not deploy to production before the initial migration exists.
