# AGENTS.md

## Project Overview

- Monorepo managed with Nx and npm that delivers a NestJS microservice (`apps/better-auth-nest-js-microservice`) plus two Effect-TS utility libraries (`packages/better-auth-utilities`, `packages/utilities`).
- Core domain is Better Auth integrations: utilities wrap the `better-auth` SDK, while the NestJS service exposes microservice endpoints.
- TypeScript everywhere with strong functional programming conventions (Effect-TS, Option/Either, Match pipelines) and Jest/Vitest for testing.

## Agent Navigation

- Start with `llms.md` for a high-level map of documentation and subproject indexes.
- When you work within a project directory, you **must** read that project's `AGENTS.md` for authoritative context and workflows before making changes.
- Current project guides:
  - [`apps/better-auth-nest-js-microservice/AGENTS.md`](apps/better-auth-nest-js-microservice/AGENTS.md): Better Auth NestJS service setup, Nx targets, Prisma guidance, and endpoint inventory.

## Repository Layout

- `apps/better-auth-nest-js-microservice`: NestJS service bundled with Webpack; Jest unit tests live under `src/app`.
- `apps/better-auth-nest-js-microservice-e2e`: Jest-based end-to-end suite that boots the microservice before running.
- `apps/better-auth-next-js-frontend`: App Router Next.js frontend pinned to React 19; relies on `packages/components` for shared UI.
- `apps/better-auth-next-js-frontend-e2e`: Playwright suite covering the Next.js experience end-to-end.
- `packages/better-auth-utilities`: Publishable Effect-TS helper library composed of adapters, composites, and plugins.
- `packages/utilities`: Shared Effect-TS primitives and helper utilities consumed by the other packages.
- `packages/components`: Shared React component library (including the admin datagrid) consumed by the frontend.
- Root project `@emperorrag/source` provides workspace-wide Nx targets like `local-registry` and `test-all-projects`.
- `llms.md`: Root-level navigation map (per llms.txt spec) that summarizes key documentation and points to subproject indexes like `apps/better-auth-nest-js-microservice/llms.md` for directory-specific context.

## Workspace Policies

- Better Auth REST endpoints are already exposed by `apps/better-auth-nest-js-microservice` through `@thallesp/nestjs-better-auth`; do not scaffold duplicate controllers.
- Shared Better Auth adapters and contracts belong in `packages/better-auth-utilities`. Use `packages/utilities` strictly for framework-agnostic helpers.
- When generating Next.js routes or components, request user approval before invoking the Nx MCP `generate` flow (`apps/better-auth-next-js-frontend` is wired to `@nx/next`).
- Follow project-specific instructions in each subproject's `AGENTS.md` before modifying code or adding new files.
- Consult `.github/instructions/nextjs.instructions.md` and `.github/instructions/reactjs.instructions.md` for frontend work; align shared UI changes with guidance in `packages/components`.
- Keep this document aligned with `llms.md`—update both when restructuring documentation or directories.

## Prerequisites & Tooling

- Node.js 20.x LTS (matching the `@types/node@20` baseline) and npm `10.9.2` (`packageManager` in `package.json`).
- Global Nx CLI optional; prefer `npx nx ...` to stay on the pinned workspace version.
- Ensure you're using Node.js 20.x LTS with npm 10.x.
- Docker is **not** required; local Verdaccio registry is started with `nx local-registry` when you need to test package publishing flows.

## First-Time Setup

```bash
npm install
npx nx graph
```

### Environment Variables

- The microservice expects standard NestJS environment variables; copy `.env.example` to `.env` inside `apps/better-auth-nest-js-microservice` if/when it appears. When missing, NestJS defaults apply.
- Keep secrets out of version control. Use your shell profile or a `.env.local` ignored by Git.

## Development Workflow

- Always invoke tasks through Nx (`npx nx <target> <project>`) to benefit from caching and dependency orchestration.
- Use the provided Nx MCP server tools (`nx_workspace`, `nx_project_details`, `nx_docs`) when you need workspace topology or config insight.

### Microservice (`better-auth-nest-js-microservice`)

- Build once: `npx nx build better-auth-nest-js-microservice` (Webpack, produces `apps/.../dist`).
- Hot-style rebuild: `npx nx build better-auth-nest-js-microservice --configuration=development` and rerun on file changes via Nx cache/CLI.
- Serve (after build) in dev mode: `npx nx serve better-auth-nest-js-microservice` (uses build:development).
- Serve with production bundle: `npx nx serve better-auth-nest-js-microservice --configuration=production`.
- Webpack dev server preview: `npx nx preview better-auth-nest-js-microservice`.

### Frontend (`better-auth-next-js-frontend`)

- Dev server: `npx nx dev better-auth-next-js-frontend` (Next.js App Router with hot reload).
- Production build: `npx nx build better-auth-next-js-frontend` (outputs to `.next`).
- Start production bundle: `npx nx start better-auth-next-js-frontend` (serves the compiled output).
- Prefer server components for data fetching; leverage shared datagrid components from `packages/components` when rendering Better Auth data.
- Always confirm with the user before running Nx scaffolding (`npx nx g @nx/next:page ...`) per workspace policy.

### Utility Libraries (`better-auth-utilities`, `utilities`)

- Dev server (Vite): `npx nx dev better-auth-utilities` or `npx nx dev utilities`.
- Build library bundles: `npx nx build better-auth-utilities` / `npx nx build utilities` (outputs to `dist/`).
- Preview production bundle: `npx nx preview better-auth-utilities` (mirrors Vite preview).

### Workspace Utilities

- Run all project tests sequentially: `npx nx test-all-projects` (defined on the root project).
- Start an isolated Verdaccio registry for local package publishing tests: `npx nx local-registry`.
- Reset Nx cache if builds behave oddly: `npx nx reset`.

## Testing Instructions

- **Run everything**: `npx nx test-all-projects` or `npx nx run-many -t test --all --skip-nx-cache` when you want a fresh run.
- **Unit tests (NestJS)**: `npx nx test better-auth-nest-js-microservice`. Jest config is under `apps/.../jest.config.ts`; coverage output goes to `apps/.../test-output/jest/coverage`.
- **Unit tests (libraries)**: `npx nx test better-auth-utilities` and `npx nx test utilities`. These use Vitest; pass `-- --coverage` for V8 coverage reports in `test-output/vitest/coverage`.
- **Frontend tests (Next.js)**: `npx nx test better-auth-next-js-frontend` (Jest + React Testing Library).
- **Type checking**: `npx nx typecheck better-auth-nest-js-microservice` (or any project) runs `tsc --build --emitDeclarationOnly`.
- **Playwright E2E (frontend)**: `npx nx e2e better-auth-next-js-frontend-e2e` (supports `-- --headed` for interactive runs).
- **Microservice E2E**: `npx nx e2e better-auth-nest-js-microservice-e2e`. Nx ensures the app builds/serves before Jest E2E specs run.
- **Focused runs**:
  - Jest: append `-- --testNamePattern="name"` or `-- --runTestsByPath src/app/foo.spec.ts`.
  - Vitest: append `-- --run tests/lib/client.spec.ts` or `-- --watch` for interactive mode.
- Update snapshots via `npx nx test better-auth-nest-js-microservice -- --updateSnapshot`.

## Code Style & Quality

- Functional programming first: follow `.github/instructions/fp-paradigm.instructions.md`. Pure functions are `const` arrow exports tagged with `@pure`, composed with `pipe`, and avoid mutation, `if/else`, `null`, or exceptions. Side effects must return `Effect`.
- No `any`. Prefer `unknown`, refine with `effect/Schema`, `Option`, or `Either`.
- Documentation belongs inside JSDoc blocks. Do not add runnable examples outside those comments unless explicitly requested.
- File organization mirrors Effect-TS patterns: keep adapters, composites, and plugins isolated; share primitives through `packages/utilities`.
- Formatting: `npx nx format:write` for fixes, `npx nx format:check` in CI or before PRs.
- Linting is not yet configured; rely on TypeScript, tests, and Effect-TS typing discipline until an ESLint target is introduced.

## Build & Release

- Standard build per project: `npx nx build <project>` (Webpack for apps, Vite for libs). Nx builds dependencies first thanks to `dependsOn` graph.
- Prepare publishable microservice artifacts: `npx nx prune better-auth-nest-js-microservice` (runs `build`, prunes lockfile, copies workspace modules).
- Libraries ship from `dist/`; ensure `tsconfig.lib.json` and `vite.config.ts` stay aligned with Effect-TS expectations.
- Frontend artifacts live under `apps/better-auth-next-js-frontend/.next`; deploy workflows should upload both server and client bundles per Next.js 15 guidance.
- Workspace release flow: `npx nx release --dry-run` to preview, then run without `--dry-run` to cut versions. A pre-version hook builds all projects (`npx nx run-many -t build`).
- When testing package publishing locally, first run `npx nx local-registry`, then `npm publish --registry http://localhost:4873` from the project's `dist/` directory.

## Monorepo Practices

- Prefer `nx run-many` for coordinated tasks (`npx nx run-many -t build --projects better-auth-utilities,utilities`).
- Use `nx affected:test --base master --head HEAD` for selective checks in feature branches.
- Keep `tsconfig` references synchronized by running `npx nx sync` after structural changes (Nx also syncs automatically on build/typecheck).
- The Nx MCP server is your source of truth for project metadata; call `#mcp_nx_mcp_server_nx_project_details` when you need target definitions.

## Debugging & Troubleshooting

- Clear caches when behavior feels stale: `npx nx reset` plus optionally `npm cache clean --force`.
- Stuck builds often signal stale generated artifacts; remove `apps/*/dist` and `packages/*/dist`, then rebuild.
- When TypeScript references break, run `npx nx sync` to regenerate project references.

## Support Checklist for Agents

- Start by querying `#mcp_nx_mcp_server_nx_workspace` to confirm project graph state.
- Use `nx_project_details` for target options before crafting commands or automation.
- If a user reports CI failures, follow the Nx Cloud flow: CIPE details → fix task failure → rerun the task locally.
- When in doubt about Nx config, fetch the relevant docs via `#mcp_nx_mcp_server_nx_docs`.
