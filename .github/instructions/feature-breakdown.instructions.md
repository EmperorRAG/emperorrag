# Logical breakdown — categories you usually implement for a TypeScript feature

Here’s a compact, practical taxonomy you can use as a checklist when implementing a feature. I group items by purpose (types, runtime, tests, infra, docs) and then give file-name mappings and a recommended order.

---

## 1) Core contract & shape

- **Types / Interfaces / Enums** — domain models, DTOs, union types, and public API shapes.
- **Validation schemas** — runtime validators (Zod / io-ts / yup) that mirror types.

## 2) Business logic & runtime

- **Pure functions / Domain logic** — the heart of the feature; deterministic, side-effect free where possible.
- **Services / Managers** — orchestrate domain logic, talk to adapters/repositories.
- **Controllers / Handlers / Routes** — HTTP / message handling glue for apps that expose APIs.
- **UI components / hooks** — React/Vue components and custom hooks for front-end features.

## 3) External integrations & adapters

- **API clients / network adapters** — fetchers, typed clients, pagination helpers.
- **Repository / persistence adapters** — DB models, ORMs, query builders.
- **Third-party wrappers** — stripped-down adapters for external services (email, payments).

## 4) Utilities & infra helpers

- **Utility functions / helpers** — small, reusable helpers (date formatting, ext-safe access).
- **Constants / config / feature flags** — environment-driven settings and flags.
- **Error classes / result types** — typed errors, `Result`/`Either` wrappers, status codes.
- **Logging / telemetry hooks** — instrumentation and metrics calls.

## 5) Testing & test data

- **Unit tests** — focused tests for pure functions and small units.
- **Integration tests** — database / network / service integration behavior.
- **Contract tests / API schema tests** — ensure client/server contract consistency.
- **E2E tests** — full user flow tests (Cypress / Playwright).
- **Fixtures / mocks / factories** — canonical test data and mock implementations.

## 6) Build / CI / quality

- **Type declarations / public types** — exported `index.d.ts` or barrel exports.
- **Linting / formatting rules** — feature-specific overrides if needed.
- **Build/scrips / Nx generators** — any automation scripts or monorepo generators.
- **CI job config** — tests, typecheck, build steps for the feature.

## 7) Docs & examples

- **README or SUMMARY.md entry** — purpose, public API, usage examples.
- **Storybook stories / demo pages** — front-end component demos and states.
- **Migration notes / changelog entry** — if feature changes DB schema or contracts.

---

# Typical file naming & where to put things

(Use the names you already mentioned — I map them to roles.)

- `foo.types.ts` — domain types, interfaces, enums, DTOs.
- `foo.schema.ts` or `foo.validator.ts` — runtime validation schemas (zod/io-ts).
- `foo.ts` — primary implementation / exported function(s) (or `index.ts` for barrel).
- `foo.service.ts` / `foo.manager.ts` — orchestration/business logic.
- `foo.controller.ts` / `foo.handler.ts` — http/message entry points.
- `foo.api.ts` / `foo.client.ts` — client-side API wrapper.
- `foo.hooks.ts` — UI hooks (React).
- `foo.utils.ts` — helper utilities closely related to this feature.
- `foo.constants.ts` — string literals, default values.
- `foo.fixtures.ts` / `foo.fixtures.json` — canonical test fixtures.
- `foo.mocks.ts` — mock implementations for tests.
- `foo.spec.ts` / `foo.test.ts` — unit/integration tests.
- `foo.integration-spec.ts` — explicit integration tests (separate from unit).
- `foo.story.tsx` — Storybook story for components.
- `README.md` or `README.feature.md` — quick usage and decisions.

---

# Suggested implementation order (practical workflow)

1. **Define the contract**: types/interfaces and validation schema.
2. **Write tests or test skeletons**: unit tests and fixture definitions (TDD-friendly).
3. **Implement pure domain functions** (small, testable units).
4. **Add services/adapters** to call external systems (mocked in tests).
5. **Wire controllers / UI components / hooks** to those services.
6. **Integration tests**: run against a test DB or mocked external services.
7. **Docs / README / Storybook / examples.**
8. **CI, lint, and release artifacts.**

This order helps minimize rework because contracts and tests drive implementation.

---

# Testing matrix (what to cover where)

- **Unit**: pure functions, edge cases, boundary behavior. Use fixtures.
- **Integration**: service + real DB or in-memory DB, external API simulator.
- **Contract**: schema validation, JSON shapes between client/server.
- **E2E**: user journeys, security flows, authorization checks.
- **Performance / Load**: only for heavy features (cache strategy, pagination).

---

# Minimal skeleton example (what I’d create for a small feature)

```plaintext
/features/foo/
  ├─ foo.types.ts          // types, DTOs, enums
  ├─ foo.schema.ts         // zod validators
  ├─ foo.utils.ts          // helper functions
  ├─ foo.service.ts        // business logic
  ├─ foo.controller.ts     // route handler / API
  ├─ foo.api.ts            // client API wrapper
  ├─ foo.fixtures.ts       // test fixtures
  ├─ foo.mocks.ts          // jest/msw mocks
  ├─ foo.spec.ts           // unit tests
  └─ README.md             // usage + examples
```

---

## Quick advice / heuristics

- **Keep pure logic separate from side effects** (makes testing trivial).
- **Name files by responsibility**, not by type alone (e.g., `payment.service.ts` vs `payment.ts`).
- **One source of truth for types** (export types from a single `*.types.ts` used by client & server when possible).
- **Fixtures + factories > ad-hoc inline data** in tests — they grow with the feature.
- **Schema validation prevents many contract bugs**; keep validators next to types and keep them in sync.
