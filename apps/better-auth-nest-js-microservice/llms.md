# Better Auth NestJS Microservice

> NestJS service exposing the full Better Auth REST surface via `@thallesp/nestjs-better-auth`, backed by Prisma and managed through the EmperorRAG Nx monorepo.

Agents operating from this directory should pair this index with `AGENTS.md` for setup, Nx workflow, and security guidance. The service already publishes user and session endpoints provided by Better Auth; avoid scaffolding duplicate controllers. Shared Better Auth adapters and types reside in `packages/better-auth-utilities` (not `packages/utilities`).

When working alongside the Next.js frontend, request permission before invoking the Nx MCP generator for new pages or components, per workspace policy.

## Guides

- [Service Agent Guide](AGENTS.md): Local setup, Nx targets, Prisma workflow, and operational caveats.
- [Workspace Agent Guide](../../AGENTS.md): Monorepo topology, Effect-TS norms, and cross-project expectations.
- [Database README](better-auth-db/README.md): Prisma workflows, Better Auth CLI usage, and troubleshooting notes.
- [LLM Prompt Brief](../../.github/prompts/create-llms.prompt.md): Source specification governing this navigation file.

## Service Source

- [Bootstrap Entry](src/main.ts): Configures `NestFactory`, global middleware, and application bootstrap.
- [App Module](src/app/app.module.ts): Wires Prisma, Auth, Health modules, and logging middleware.
- [Auth Module](src/app/auth/auth.module.ts): Mounts Better Auth handlers through `@thallesp/nestjs-better-auth`.
- [Better Auth Config](src/lib/auth.ts): Composes Better Auth plugins, Prisma adapter, and environment-driven secrets.
- [Health Controller](src/app/health/health.controller.ts): Exposes `/health` status endpoint for probes.
- [Logging Middleware](src/app/middleware/logging.middleware.ts): Request logging for trace-level debugging.
- [Prisma Module](src/app/prisma/prisma.module.ts): Provides Prisma service integration for dependency injection.

## Database Assets

- [Prisma Schema](better-auth-db/prisma/schema.prisma): Canonical data model powering Better Auth storage.
- [Migrations](better-auth-db/prisma/migrations/20251027150948_better_auth_init/migration.sql): Initial schema migration generated for the microservice.
- [Environment Template](better-auth-db/.env.example): Sample Postgres connection string for local development.
- [Prisma Client Stub](better-auth-db/prisma/generated/client/index.d.ts): Generated client typings consumed by the service.

## Configuration

- [Project Package](package.json): Declares NestJS, Prisma, and Better Auth dependencies plus Nx targets.
- [Webpack Config](webpack.config.js): Production bundling configuration for the microservice.
- [Jest Config](jest.config.ts): Unit test environment settings and coverage output paths.
- [TypeScript App Config](tsconfig.app.json): Compiler options for runtime build artifacts.
- [TypeScript Test Config](tsconfig.spec.json): Jest-specific TypeScript configuration.
- [Environment Template](.env.example): Required variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) for runtime.

## Testing & Tooling

- [App Controller Spec](src/app/app.controller.spec.ts): Jest coverage validating baseline HTTP responses.
- [App Service Spec](src/app/app.service.spec.ts): Unit test for service-level response contracts.
- [Postman Collection](postman/better-auth-microservice.postman_collection.json): Ready-made requests for Better Auth endpoints.
- [Prisma Validation Script](better-auth-db/scripts/validate-setup.sh): Shell utility to confirm DB readiness.
- [Smoke Test Script](better-auth-db/scripts/smoke-test.sh): End-to-end verification of database connectivity and migrations.
