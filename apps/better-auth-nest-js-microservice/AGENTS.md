---
post_title: Better Auth NestJS Microservice Agent Guide
author1: EmperorRAG
post_slug: better-auth-nest-js-microservice-agents
microsoft_alias: n-a
featured_image: n-a
categories: []
tags:
  - better-auth
  - nestjs
  - nx
ai_note: Generated with AI assistance on 2025-11-01
summary: Operational guide for agents working on the Better Auth NestJS microservice within the Nx monorepo.
post_date: 2025-11-01
---

# Better Auth NestJS Microservice AGENTS Guide

## Project Overview

- Service path: `apps/better-auth-nest-js-microservice` inside the Nx monorepo managed by pnpm.
- NestJS microservice that wraps the Better Auth SDK plus plugins, exposing REST handlers through `@thallesp/nestjs-better-auth`.
- Prisma (PostgreSQL) is the persistence layer. Schemas and migrations live in `better-auth-db/prisma`.
- Shared Better Auth glue code lives in `packages/better-auth-utilities`; do **not** place Better Auth contracts or adapters in `packages/utilities` (reserved for generic helpers).

## Setup Commands

- Install workspace dependencies: `pnpm -w install`
- Copy environment template: `cp .env.example .env` (adjust `DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.)
- Provision database locally: run `docker compose up -d` from `dbms/postgresql` or point to an existing Postgres instance.
- Generate Prisma client (after schema edits): `pnpm exec nx prisma-generate better-auth-nest-js-microservice`

## Development Workflow

- Build once: `pnpm exec nx build better-auth-nest-js-microservice`
- Development build (faster rebuilds): `pnpm exec nx build better-auth-nest-js-microservice --configuration=development`
- Serve with autoreload: `pnpm exec nx serve better-auth-nest-js-microservice --configuration=development`
- Provide environment variables through `.env` or the shell; the webpack bundle reads from process env at build time.
- Prisma workflow: use the Nx targets (`prisma-migrate`, `prisma-reset`, etc.) defined for this project.

## API Surface

- `AuthModule` imports `@thallesp/nestjs-better-auth`. All Better Auth core and plugin endpoints are exposed under the mounted route (default `/api/auth/*`).
- Plugins enabled: username, JWT, bearer, admin, organization, email OTP, two-factor, API keys. Each contributes additional REST endpoints documented in Better Auth.
- No manual controller work is needed for user CRUD: the Better Auth handlers already expose `/api/auth/users`, `/api/auth/sessions`, and related routes.
- Health check lives at `/health` via `HealthModule`.

## Testing Instructions

- Unit tests (Jest): `pnpm exec nx test better-auth-nest-js-microservice`
- Coverage output: `apps/better-auth-nest-js-microservice/test-output/jest/coverage`
- Prisma smoke tests: `pnpm exec nx run better-auth-nest-js-microservice:prisma-validate`
- Prefer `pnpm exec nx test-all-projects` before pushes to ensure cross-project stability.

## Code Style Guidelines

- TypeScript, NestJS, and Effect-TS paradigms apply. Follow `.github/instructions/fp-paradigm.instructions.md` for functional purity requirements.
- Export `const` arrow functions. Avoid `any`; prefer `unknown` with refinement.
- Keep documentation inside JSDoc blocks (per continuous-improvement instructions).
- Place shared Better Auth logic in `packages/better-auth-utilities`. Use `packages/utilities` only for framework-agnostic helpers.

## Build and Deployment

- Build output: `apps/better-auth-nest-js-microservice/dist`
- Production serve: `pnpm exec nx serve better-auth-nest-js-microservice --configuration=production`
- Packaging workflow: `pnpm exec nx prune better-auth-nest-js-microservice` produces pruned lockfile and workspace modules inside `dist/`
- Deployment expects `DATABASE_URL`, `BETTER_AUTH_SECRET`, and any email/SMS secrets configured for OTP plugins.

## Security Considerations

- Never commit `.env` secrets. Use `.env.example` as reference.
- OTP delivery and admin features log to console in development—replace with secure providers before production.
- Ensure HTTPS termination upstream; NestJS relies on proxy for TLS.
- Prisma migrations should be reviewed before applying to production.

## Monorepo Notes

- Use `pnpm exec nx graph --focus=better-auth-nest-js-microservice` to inspect dependencies.
- Shared contracts: import `User` and related types from `packages/better-auth-utilities/src/lib/core/users/users.utils.ts` (or its barrel export) rather than redefining them.
- When updating related Next.js frontends, request permission to invoke the Nx MCP generate UI before scaffolding pages/components (per workspace policy).
- Root `AGENTS.md` routes agents to this file when operating in this app.

## Debugging and Troubleshooting

- Logging middleware in `src/app/middleware/logging.middleware.ts` prints method, path, and user agent—tail logs during debugging.
- Run `pnpm exec nx prisma-studio better-auth-nest-js-microservice` to inspect data quickly.
- If builds behave oddly, clear Nx cache: `pnpm exec nx reset`
- Database connectivity issues: verify `better-auth-db/prisma/schema.prisma` matches the live database and rerun `pnpm exec nx prisma-push better-auth-nest-js-microservice`

## External References

- Better Auth documentation: [https://better-auth.dev/](https://better-auth.dev/)
- `@thallesp/nestjs-better-auth` package docs: [https://www.npmjs.com/package/@thallesp/nestjs-better-auth](https://www.npmjs.com/package/@thallesp/nestjs-better-auth)
- Prisma documentation: [https://www.prisma.io/docs/](https://www.prisma.io/docs/)
