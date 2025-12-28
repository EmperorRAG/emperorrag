---
description: 'Focused instructions for AI coding agents collaborating on the Emperorrag Nx monorepo'
applyTo: '.github/copilot-instructions.md'
---

# Copilot Instructions

Guidance for AI collaborators working inside the Emperorrag Nx monorepo.

## General Instructions

- Operate from the Nx root unless a project-level `AGENTS.md` redirects you elsewhere; start with `AGENTS.md` and `llms.md` for navigation.
- Keep documentation in TSDoc blocks or Markdown with front matter.
- Prefer existing helpers over reimplementation—shared logic belongs in `packages/better-auth-utilities` or `packages/utilities`.

## Project standards (TypeScript)

- Use TypeScript idioms. Do not introduce JavaScript files or `require()` unless explicitly requested.
- Prefer type-safety and explicitness over cleverness.
- Avoid `any`. Avoid double-casts like `as unknown as T` except as a last resort with a comment explaining why.
- Preserve runtime behavior during refactors unless the change request explicitly alters behavior.
- Follow existing patterns in the codebase (imports, folder structure, naming, error handling).

## Refactor rules

- When refactoring, update all call sites (search the workspace for symbol usage).
- Keep changes minimal and mechanical unless asked for redesign.
- Preserve runtime behavior unless the task explicitly changes it.

## Troubleshooting & Utilities

- Use `nx graph` for dependency visualization and `nx reset` when cache artifacts misbehave.

## Guardrails

- Do not edit generated files (e.g., `dist/`, `build/`, `coverage/`, `*.generated.ts`) or lockfiles unless explicitly requested.
- Do not change config files (tsconfig, eslint, prettier) unless asked.