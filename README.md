# Maf Project - platform for Mafia game clubs

A full-stack platform for Mafia game clubs: clubs, venues, tournaments, games, players and the roles and actions that happen during a game. Monorepo with a NestJS GraphQL API, a Next.js frontend and a Docker Compose environment.

> **Status: work in progress.** The backend API and the domain model are the core of the project. The frontend has routing, internationalisation, theming and SEO metadata in place; the product pages are next.

## Architecture

```
maf-project/
  backend/            NestJS + GraphQL API
  frontend/           Next.js App Router
  docker-compose.yml  MySQL, backend and frontend
  makefile            shortcuts for common Docker commands
```

## Backend

**NestJS with 17 domain modules**, each with the same structure: module, resolver, service, entity and input DTOs.

**Code-first GraphQL** on Apollo Server. Entities are both TypeORM tables and GraphQL types, and the schema is generated from TypeScript classes, so the API contract cannot drift from the code. The generated schema has 37 types and 31 queries and mutations.

**Domain model.** The interesting part is how game rules are expressed as data rather than code:

```
game types -> game type roles -> roles -> role actions -> actions -> action types / targets
```

A game type defines which roles are available, a role defines which actions it can take, and each action has a type and targets. Different variants of Mafia can therefore be configured without code changes.

**Domain invariants in services**, for example: the total number of roles in a game type must equal its player count, a game needs at least two players, and names must be unique.

**Authentication.** JWT with Passport, passwords hashed with argon2, a global filter that turns missing entities into proper GraphQL errors.

**Configuration** through typed `@nestjs/config` namespaces for the database, GraphQL and JWT, with async module factories. Nothing environment-specific is hard-coded.

## Frontend

Next.js App Router with locale-based routing (`uk` and `en`) through `next-intl`, locale persisted in a cookie via a server action, light and dark themes, a sitemap with `hreflang` alternates, Tailwind CSS and shadcn/ui components.

## Stack

**Backend:** NestJS, GraphQL, Apollo Server, TypeORM, MySQL, Passport, JWT, argon2, class-validator.
**Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, next-intl, next-themes.
**Infrastructure:** Docker, Docker Compose, Makefile.

## Getting started

Create `.env.dev` in the project root:

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=maf
MYSQL_USER=maf
MYSQL_PASSWORD=maf
MYSQL_HOST=mysql
MYSQL_PORT_IN=3306
MYSQL_PORT_OUT=3306
MYSQL_SYNCHRONIZE=true

DOCKERFILE_BACKEND=Dockerfile.dev
DOCKERFILE_FRONTEND=Dockerfile.dev
BACKEND_PORT=4000

GRAPHQL_PATH=/graphql
GRAPHQL_PLAYGROUND=true
GRAPHQL_INTROSPECTION=true
GRAPHQL_DEBUG=true
GRAPHQL_SORT_SCHEMA=true
GRAPHQL_CORS=true
GRAPHQL_SCHEMA_PATH=src/schema.gql

JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
```

Then start everything:

```bash
make dev
```

The frontend runs on http://localhost:3000 and the GraphQL endpoint on http://localhost:4000/graphql.

Other commands: `make db-up`, `make backend-up`, `make frontend-up`, `make logs`, `make dev-down`.

## Roadmap

- Connect the frontend to the GraphQL API and build the product pages
- Apply the role-based guards to every resolver; they are implemented but not yet wired to all mutations and queries
- Replace `synchronize` with TypeORM migrations
- Unit tests for services and e2e tests for the API
- Health checks for the Docker services
