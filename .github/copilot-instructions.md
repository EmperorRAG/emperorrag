---
description: 'Focused instructions for AI coding agents collaborating on the Emperorrag Nx monorepo'
applyTo: '.github/copilot-instructions.md'
---

# Copilot Instructions

Guidance for AI collaborators working inside the Emperorrag Nx monorepo.

## General Instructions

- Operate from the Nx root unless a project-level `AGENTS.md` redirects you elsewhere; start with `AGENTS.md` and `llms.md` for navigation.
- Keep documentation in JSDoc blocks or Markdown with front matter; comply with `.github/instructions/continuous-improvement/continuous-improvement.instructions.md`.
- Prefer existing helpers over reimplementation—shared logic belongs in `packages/better-auth-utilities` or `packages/utilities`.

## Architecture & Responsibilities

- Treat the workspace as four pillars: NestJS microservice (`apps/better-auth-nest-js-microservice`), Prisma Better Auth package (`packages/prisma/better-auth-db`), Effect-TS helper libraries (`packages/better-auth-utilities`, `packages/utilities`), and the Next.js UI (`apps/better-auth-next-js-frontend`).
- Use `packages/prisma/better-auth-db/src/lib/auth/auth.ts` as the Better Auth source of truth; import its `authServer`, `authClient`, and type aliases instead of rebuilding configs.
- Remember the microservice already mounts Better Auth via `src/app/auth/auth.module.ts`; do not scaffold duplicate controllers for `/api/auth/*` routes.

## Code Standards & Patterns

- Follow Effect-TS FP rules from `.github/instructions/fp-paradigm.instructions.md`: export `const` arrows, mark pure functions with `@pure`, use `pipe`, `Match`, `Option`, and avoid `any`.
- Reuse plugin maps and configuration builders from `packages/better-auth-utilities` when wiring Better Auth in other projects.
- Keep environment-dependent values in `.env` files; never hardcode `BETTER_AUTH_SECRET`, database URLs, or admin IDs.

## Developer Workflows

- Build and serve the microservice with `npx nx build better-auth-nest-js-microservice` and `npx nx serve better-auth-nest-js-microservice --configuration=development`; webpack outputs land in `apps/better-auth-nest-js-microservice/dist`.
- Build the Prisma package with `npx nx build prisma-better-auth-db`; Vite emits `dist/client.js`, `dist/server.js`, and `dist/types.js` to satisfy the package exports.
- Run Prisma maintenance through Nx (`nx run better-auth-nest-js-microservice:prisma-generate`, `:prisma-migrate`, etc.) to keep `better-auth-db/prisma` and generated clients aligned.
- Execute tests with project-specific targets—Jest for the microservice (`npx nx test better-auth-nest-js-microservice`) and Vitest for libraries (`npx nx test better-auth-utilities`, `npx nx test prisma-better-auth-db`); `npx nx test-all-projects` provides a pre-PR sweep.

## Frontend Coordination

- `apps/better-auth-next-js-frontend` runs React 19 with shared UI from `packages/components`; ask before invoking Nx generators and prefer reusing exported components/effect hooks.
- Align client-side Better Auth usage with the server config by importing from `@emperorrag/prisma-better-auth-db/client` or `.../types` rather than crafting new adapters.

## Troubleshooting & Utilities

- Use `nx graph` for dependency visualization and `nx reset` when cache artifacts misbehave.
- If Prisma drift arises, run `nx run prisma-better-auth-db:prisma-validate` followed by `:prisma-generate`, then rebuild the Prisma package.
- When preparing deployments, run `npx nx prune better-auth-nest-js-microservice` to build, prune lockfiles, and copy workspace modules in one flow.

Feel free to request clarifications or propose additions when patterns shift.
