# Emperorrag Monorepo

> Nx-powered Better Auth microservice with Effect-TS utilities for authentication integrations.

Nx orchestrates builds, tests, and releases across NestJS and library projects while Effect-TS guidelines enforce pure, composable TypeScript implementations.

## Repository Guides

- [Workspace Overview](AGENTS.md): Monorepo layout, tooling expectations, and testing strategy.
- [FP Guidelines](.github/instructions/fp-paradigm.instructions.md): Mandatory Effect-TS functional programming standards.
- [Instruction Cache](.github/instructions/continuous-improvement/continuous-improvement.instructions.md): Temporary directives and documentation requirements.
- [LLM Prompt Brief](.github/prompts/create-llms.prompt.md): Source requirements that define this navigation file.
- [Better Auth Microservice Agent Guide](apps/better-auth-nest-js-microservice/AGENTS.md): Setup, Nx workflows, Prisma operations, and endpoint guidance for the NestJS service.

## Subproject Indexes

- [Microservice LLM Index](apps/better-auth-nest-js-microservice/llms.md): Focused navigation map for the Better Auth NestJS microservice.

## Workspace Configuration

- [Workspace Manifest](package.json): Dependencies, pnpm version, and Nx target definitions.
- [Nx Configuration](nx.json): Project graph inputs, plugins, and release automation settings.
- [TypeScript Base Config](tsconfig.base.json): Compiler options shared across applications and libraries.
- [pnpm Workspace Map](pnpm-workspace.yaml): Package scopes and workspace inclusion rules.
- [Root Jest Config](jest.config.ts): Shared Jest settings driving unit test execution.
- [CI Workflow](.github/workflows/ci.yml): GitHub Actions pipeline invoking Nx lint, test, build, and typecheck targets.

## Microservice

- [Bootstrap Entry](apps/better-auth-nest-js-microservice/src/main.ts): Configures `NestFactory`, global middleware, and startup lifecycle.
- [App Module](apps/better-auth-nest-js-microservice/src/app/app.module.ts): Registers Prisma, Better Auth, and health modules plus logging middleware.
- [Auth Module](apps/better-auth-nest-js-microservice/src/app/auth/auth.module.ts): Mounts Better Auth REST handlers via `@thallesp/nestjs-better-auth` so user/session endpoints are already exposed.
- [Better Auth Config](apps/better-auth-nest-js-microservice/src/lib/auth.ts): Composes Prisma adapter, secrets, and plugin suite (username, JWT, bearer, admin, organization, OTP, 2FA, API keys).
- [App Controller](apps/better-auth-nest-js-microservice/src/app/app.controller.ts): Legacy example endpoint retained for baseline responses.
- [Project Jest Config](apps/better-auth-nest-js-microservice/jest.config.ts): Unit test environment configuration for the NestJS app.
- [TypeScript App Config](apps/better-auth-nest-js-microservice/tsconfig.app.json): Compiler options for building the microservice.

## Better Auth Utilities

- [Library Entry Point](packages/better-auth-utilities/src/index.ts): Public exports for Better Auth helpers and adapters.
- [Aggregate Exports](packages/better-auth-utilities/src/lib/better-auth-utilities.ts): Centralized exports covering configs, adapters, and services.
- [Configuration Schema](packages/better-auth-utilities/src/lib/config.ts): Plugin registry, OAuth provider types, and configuration defaults.
- [Client Factory](packages/better-auth-utilities/src/lib/client.ts): Effect-TS client constructor wrapping the Better Auth SDK.
- [Server Factory](packages/better-auth-utilities/src/lib/server.ts): Server-side helper and inferred type utilities for Better Auth.
- [Test Utilities](packages/better-auth-utilities/src/lib/test-utils/test-helpers.ts): Shared testing helpers for Better Auth integrations.

## Shared Utilities

- [Shared Entry Point](packages/utilities/src/index.ts): Export surface for cross-library helpers and type guards.
- [Primitive Utilities](packages/utilities/src/lib/helper-functions/primitive.utils.ts): Functional helpers for primitive value inspection and labeling.
- [Object Utilities](packages/utilities/src/lib/helper-functions/object.utils.ts): Utilities for object detection and descriptive metadata.
- [Function Utilities](packages/utilities/src/lib/helper-functions/function.utils.ts): Helpers for categorizing and formatting function values.
- [Stringable Fixtures](packages/utilities/src/lib/types/stringable/stringable.fixtures.ts): Table-driven fixtures supporting serialization tests.

## Testing & Tooling

- [Library Client Tests](packages/better-auth-utilities/src/lib/client.spec.ts): Vitest coverage for the Better Auth client factory.
- [Library Config Tests](packages/better-auth-utilities/src/lib/config.spec.ts): Configuration validation scenarios and edge cases.
- [Microservice Controller Test](apps/better-auth-nest-js-microservice/src/app/app.controller.spec.ts): NestJS unit test covering the HTTP GET endpoint.
- [Utilities Table Tests](packages/utilities/src/lib/helper-functions/runTableTest.utils.ts): Testing helpers for tabular expectation assertions.
- [Vitest Workspace](vitest.workspace.ts): Root-level test runner discovery settings for Nx-managed libraries.
