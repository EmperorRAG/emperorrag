# AGENTS.md

## Project Overview

- Monorepo managed with Nx and pnpm that delivers a NestJS microservice (`apps/better-auth-nest-js-microservice`) plus two Effect-TS utility libraries (`packages/better-auth-utilities`, `packages/utilities`).
- Core domain is Better Auth integrations: utilities wrap the `better-auth` SDK, while the NestJS service exposes microservice endpoints.
- TypeScript everywhere with strong functional programming conventions (Effect-TS, Option/Either, Match pipelines) and Jest/Vitest for testing.

## Repository Layout

- `apps/better-auth-nest-js-microservice`: NestJS service bundled with Webpack; Jest unit tests live under `src/app`.
- `apps/better-auth-nest-js-microservice-e2e`: Jest-based end-to-end suite that boots the microservice before running.
- `packages/better-auth-utilities`: Publishable Effect-TS helper library composed of adapters, composites, and plugins.
- `packages/utilities`: Shared Effect-TS primitives and helper utilities consumed by the other packages.
- Root project `@emperorrag/source` provides workspace-wide Nx targets like `local-registry` and `test-all-projects`.

## Prerequisites & Tooling

- Node.js 20.x LTS (matching the `@types/node@20` baseline) and pnpm `10.18.3` (`packageManager` in `package.json`).
- Global Nx CLI optional; prefer `pnpm exec nx ...` to stay on the pinned workspace version.
- Ensure `corepack enable` is run once so pnpm resolves correctly.
- Docker is **not** required; local Verdaccio registry is started with `nx local-registry` when you need to test package publishing flows.

## First-Time Setup

```bash
pnpm install
pnpm exec nx graph       # Optional: open project dependency graph in your browser
```

### Environment Variables

- The microservice expects standard NestJS environment variables; copy `.env.example` to `.env` inside `apps/better-auth-nest-js-microservice` if/when it appears. When missing, NestJS defaults apply.
- Keep secrets out of version control. Use your shell profile or a `.env.local` ignored by Git.

## Development Workflow

- Always invoke tasks through Nx (`pnpm exec nx <target> <project>`) to benefit from caching and dependency orchestration.
- Use the provided Nx MCP server tools (`nx_workspace`, `nx_project_details`, `nx_docs`) when you need workspace topology or config insight.

### Microservice (`better-auth-nest-js-microservice`)

- Build once: `pnpm exec nx build better-auth-nest-js-microservice` (Webpack, produces `apps/.../dist`).
- Hot-style rebuild: `pnpm exec nx build better-auth-nest-js-microservice --configuration=development` and rerun on file changes via Nx cache/CLI.
- Serve (after build) in dev mode: `pnpm exec nx serve better-auth-nest-js-microservice` (uses build:development).
- Serve with production bundle: `pnpm exec nx serve better-auth-nest-js-microservice --configuration=production`.
- Webpack dev server preview: `pnpm exec nx preview better-auth-nest-js-microservice`.

### Utility Libraries (`better-auth-utilities`, `utilities`)

- Dev server (Vite): `pnpm exec nx dev better-auth-utilities` or `pnpm exec nx dev utilities`.
- Build library bundles: `pnpm exec nx build better-auth-utilities` / `pnpm exec nx build utilities` (outputs to `dist/`).
- Preview production bundle: `pnpm exec nx preview better-auth-utilities` (mirrors Vite preview).

### Workspace Utilities

- Run all project tests sequentially: `pnpm exec nx test-all-projects` (defined on the root project).
- Start an isolated Verdaccio registry for local package publishing tests: `pnpm exec nx local-registry`.
- Reset Nx cache if builds behave oddly: `pnpm exec nx reset`.

## Testing Instructions

- **Run everything**: `pnpm exec nx test-all-projects` or `pnpm exec nx run-many -t test --all --skip-nx-cache` when you want a fresh run.
- **Unit tests (NestJS)**: `pnpm exec nx test better-auth-nest-js-microservice`. Jest config is under `apps/.../jest.config.ts`; coverage output goes to `apps/.../test-output/jest/coverage`.
- **Unit tests (libraries)**: `pnpm exec nx test better-auth-utilities` and `pnpm exec nx test utilities`. These use Vitest; pass `-- --coverage` for V8 coverage reports in `test-output/vitest/coverage`.
- **Type checking**: `pnpm exec nx typecheck better-auth-nest-js-microservice` (or any project) runs `tsc --build --emitDeclarationOnly`.
- **End-to-end**: `pnpm exec nx e2e better-auth-nest-js-microservice-e2e`. Nx ensures the app builds/serves before Jest E2E specs run.
- **Focused runs**:
  - Jest: append `-- --testNamePattern="name"` or `-- --runTestsByPath src/app/foo.spec.ts`.
  - Vitest: append `-- --run tests/lib/client.spec.ts` or `-- --watch` for interactive mode.
- Update snapshots via `pnpm exec nx test better-auth-nest-js-microservice -- --updateSnapshot`.

## Code Style & Quality

- Functional programming first: follow `.github/instructions/fp-paradigm.instructions.md`. Pure functions are `const` arrow exports tagged with `@pure`, composed with `pipe`, and avoid mutation, `if/else`, `null`, or exceptions. Side effects must return `Effect`.
- No `any`. Prefer `unknown`, refine with `effect/Schema`, `Option`, or `Either`.
- Documentation belongs inside JSDoc blocks. Do not add runnable examples outside those comments unless explicitly requested.
- File organization mirrors Effect-TS patterns: keep adapters, composites, and plugins isolated; share primitives through `packages/utilities`.
- Formatting: `pnpm exec nx format:write` for fixes, `pnpm exec nx format:check` in CI or before PRs.
- Linting is not yet configured; rely on TypeScript, tests, and Effect-TS typing discipline until an ESLint target is introduced.

## Build & Release

- Standard build per project: `pnpm exec nx build <project>` (Webpack for apps, Vite for libs). Nx builds dependencies first thanks to `dependsOn` graph.
- Prepare publishable microservice artifacts: `pnpm exec nx prune better-auth-nest-js-microservice` (runs `build`, prunes lockfile, copies workspace modules).
- Libraries ship from `dist/`; ensure `tsconfig.lib.json` and `vite.config.ts` stay aligned with Effect-TS expectations.
- Workspace release flow: `pnpm dlx nx release --dry-run` to preview, then run without `--dry-run` to cut versions. A pre-version hook builds all projects (`pnpm dlx nx run-many -t build`).
- When testing package publishing locally, first run `pnpm exec nx local-registry`, then `pnpm publish --registry http://localhost:4873` from the project’s `dist/` directory.

## Monorepo Practices

- Prefer `nx run-many` for coordinated tasks (`pnpm exec nx run-many -t build --projects better-auth-utilities,utilities`).
- Use `nx affected:test --base master --head HEAD` for selective checks in feature branches.
- Keep `tsconfig` references synchronized by running `pnpm exec nx sync` after structural changes (Nx also syncs automatically on build/typecheck).
- The Nx MCP server is your source of truth for project metadata; call `#mcp_nx_mcp_server_nx_project_details` when you need target definitions.

## Debugging & Troubleshooting

- Clear caches when behavior feels stale: `pnpm exec nx reset` plus optionally `pnpm store prune`.
- Stuck builds often signal stale generated artifacts; remove `apps/*/dist` and `packages/*/dist`, then rebuild.
- When TypeScript references break, run `pnpm exec nx sync` to regenerate project references.

## Support Checklist for Agents

- Start by querying `#mcp_nx_mcp_server_nx_workspace` to confirm project graph state.
- Use `nx_project_details` for target options before crafting commands or automation.
- If a user reports CI failures, follow the Nx Cloud flow: CIPE details → fix task failure → rerun the task locally.
- When in doubt about Nx config, fetch the relevant docs via `#mcp_nx_mcp_server_nx_docs`.
