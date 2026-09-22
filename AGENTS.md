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

## Frontend data flow
- Only the Next.js server talks to the API: `request()` in `frontend/lib/graphql/client.ts`
  (server-only). The JWT sits in the httpOnly cookie `maf_session`; never expose it to the browser.
- Queries: write `graphql(\`...\`)` documents (see `lib/host/queries.ts`, `lib/public/queries.ts`),
  then run `npm run codegen` in `frontend/`. Commit `frontend/gql/` — CI fails if it is stale.
- Mutations from the UI are server actions (`lib/auth/actions.ts`, `lib/host/actions.ts`) that
  call `requireHost()` where needed and `revalidatePath()` the affected page.
- Client components must not import from `@/components/shared` (the barrel pulls in server-only
  code); import the specific file.
- Anything computed from the current time or theme must not differ between server and browser
  (hydration): compute it in `useEffect` or render both variants and pick with CSS.

## Auth model
- Every resolver requires a JWT unless marked `@Public()` (global guards in `auth/auth.module.ts`).
- Restrict with `@Roles(UserRole.ADMIN)` or `@Roles(UserRole.HOST)`; admins pass every role check.
- Ownership checks (e.g. `updateUser`) live in the resolver; get the caller with `@CurrentUser()`.
- New list queries take `@Args() pagination: PaginationArgs`.
- Schema changes: change the entity, then `npm run migration:generate -- src/migrations/<Name>` in
  `backend/` against a database with all previous migrations applied. Never enable `synchronize`.

## Game engine (`backend/src/game-engine`)
- Rules are pure functions in `domain/` (no DB, no Nest) with unit tests; change rules there first.
- `GameEngineService` loads a game in a transaction with the game row locked, applies the rules,
  writes the result. Game status, phase and round change only through it.
- Roles and action types are data: the engine only knows `Team` and `ActionEffect`.
  Required reference data (e.g. the VOTE action type) is created by migrations.
- Never expose a player's role while the game runs (see `PlayersResolver.canSeeRole`).
- e2e tests (`npm run test:e2e`) need MySQL and drop the database named in `MYSQL_DATABASE`
  (must contain "e2e"); locally: `MYSQL_PASSWORD=<from .env.dev> npm run test:e2e` after granting the
  dev user access once: `GRANT ALL ON maf_e2e.* TO 'maf'@'%'` (as MySQL root).

## Known gaps (see ROADMAP.md)
No refresh tokens yet; no subscriptions.
