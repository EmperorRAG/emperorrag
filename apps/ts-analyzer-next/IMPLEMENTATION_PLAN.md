# Updated MVP Implementation Plan (concise)

## Key constraints (applies to all sections)

* Analyzer must be built first: `nx build @emperorrag/tsserver-analyzer`.
* Next app will call the **built CLI** via Node child process and parse JSON from stdout.
* All UI lives in `apps/ts-analyzer-next` using App Router.
* UI components are built with **Radix UI primitives & Radix Themes** and styled with **CSS modules** (`*.module.css`) only.

---

## High-level architecture (App Router)

* `apps/ts-analyzer-next/app/` — Next App Router pages/components.
* `apps/ts-analyzer-next/app/api/analyze/route.ts` — POST route that spawns CLI and returns JSON.
* `apps/ts-analyzer-next/src/components/` — Radix-based client components (CSS modules).
* `apps/ts-analyzer-next/src/hooks/useAnalyzer.ts` — client hook to call `/api/analyze`.
* `apps/ts-analyzer-next/src/lib/types/index.ts` — shared types (`AnalysisResult`, `TableResult`).
* `package.json` scripts inside the app workspace to build the analyzer before running the app locally.

---

## CLI / build + invocation strategy (MVP pragmatic)

1. **Standardise build output directory (recommended)**
   The analyzer build is handled by Nx inferred tasks, which outputs to `packages/tsserver-analyzer/dist`.

   Example Nx build command for dev:

   ```bash
   nx build @emperorrag/tsserver-analyzer
   ```

2. **Create local npm scripts inside `apps/ts-analyzer-next/package.json` (or workspace root)**

   * `dev` — start Next dev (Nx handles build dependencies):

     ```bash
     nx dev ts-analyzer-next
     ```

   *Note: The build dependency on `@emperorrag/tsserver-analyzer` is handled by Nx task dependencies.*

3. **API route will spawn the built CLI** (server-side only):

   * Use `child_process.spawn` or `execFile` to run `node <built-entry> --json`.
   * Set a reasonable timeout and stream stdout. Parse stdout as JSON. If parse fails, return a clear error.
   * Example behavior:

     * If analyzer returns valid JSON on stdout, parse and return `{ success: true, result }`.
     * If analyzer prints other text, attempt to extract JSON blocks; otherwise return an error with the raw stdout for debugging.

4. **Security note (MVP)**

   * Only accept a limited set of run options from the client (or none). The analyzer auto-reads logs so options are minimal. For PoC, accept `{}` or minimal flags; do not allow arbitrary shell arguments.

---

## API route (app/router) — behavior summary

* Endpoint: `POST /api/analyze`
* Server-side flow:

  1. Optionally run `nx build @emperorrag/tsserver-analyzer` if you want auto-build-on-request (not recommended for production; prefer build step during dev/CI).
  2. Execute `node <dist path>/index.js --json` (or built entry) via `spawn`.
  3. Collect stdout; parse JSON.
  4. Return `200 { success: true, result: AnalysisResult }` or `500 { success: false, error, raw: stdout }`.
* Timeout and error handling: kill process after X seconds (configurable). Return helpful diagnostics in error responses for dev.

---

## Types (inside the app)

Put these at `apps/ts-analyzer-next/src/lib/types/index.ts`:

```ts
export interface ColumnSpec { key: string; label: string; sortable?: boolean; width?: string | number; }
export type TableRow = Record<string, any>;
export interface TableResult { columns: ColumnSpec[]; rows: TableRow[]; total?: number; }
export interface AnalysisResult {
  id?: string;
  summary?: Record<string, any>;
  tables?: Record<string, TableResult>;
  raw?: any;
  timestamp?: string;
}
```

(Use these in both API and client.)

---

## Components (all inside `apps/ts-analyzer-next/src/components`) — Radix + CSS modules

**Styling rule**: use `.module.css` files (CSS modules). Put any theme variables in a small `theme.module.css` that components import or read CSS variables from `:root` provided in `app/layout.tsx` or `globals.css` (but still plain CSS modules, not Tailwind).

MVP single-responsibility components:

* `Layout` — shell with header, main container. (server or client)
* `Header` — title and primary action/button. Use Radix `Toolbar` or `DropdownMenu` for future options. (client)
* `RunAnalyzerForm` — minimal UI: single “Run analyzer” button (options optional). (client)
* `Button` — wrapper around `<button>` styled with Radix tokens + CSS module. (client)
* `StatusBadge` & `Spinner` — show status. (client)
* `ResultsTable` — dumb renderer of `TableResult` (columns & rows). (client)
* `JsonViewer` — collapsible pretty print for `raw`. (client)
* `ErrorBanner` — show error message and optionally raw output. (client)
* `useAnalyzer` hook — `run()`, `status`, `result`, `error`. (client)

Design notes:

* Keep `ResultsTable` minimal: header row, rows, stringified cell values for non-primitive data.
* `JsonViewer` can use `JSON.stringify(obj, null, 2)` inside a `<pre>` with collapse/expand (Radix Collapsible).
* Use CSS modules to scope styles; use CSS variables for theme (Radix theme tokens mapped to variables).

---

## Page / Screen layout (single-page MVP)

Implement everything on `/` (via `app/page.tsx`):

1. Top: `Header` with app name and single “Run analyzer” control.
2. Middle: `RunAnalyzerForm` or direct run button + `StatusBadge` + `Spinner`.
3. Bottom: Results area — for each key in `result.tables` render a `CollapsiblePanel` with `ResultsTable`. Also include `JsonViewer` for `result.raw`.
4. Error state: `ErrorBanner` above results.

Acceptance: run → running shown → results table(s) and JSON appear → errors gracefully shown.

---

## Implementation steps (ordered, pragmatic, with your constraints)

1. **Add/build scripts** for analyzer in workspace or app package.json (`analyzer:build`, `dev` as above).
2. **Create `src/lib/types/index.ts`**.
3. **Create an analyzer wrapper module in the app** `src/lib/analyzerCli.ts`:

   * This module encapsulates spawn logic, e.g. `runAnalyzerCli(): Promise<AnalysisResult>`.
   * It will call the built analyzer (node + path + `--json`) and handle stdout parsing/timeouts.
4. **Implement App Router API** at `app/api/analyze/route.ts` calling `runAnalyzerCli`.
5. **Install Radix packages** you need (primitives used) in the app `package.json`.
6. **Generate base components** using Nx (with Radix primitives and CSS modules):

   ```bash
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/Button/Button.tsx --style=css
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/Header/Header.tsx --style=css
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/RunAnalyzerForm/RunAnalyzerForm.tsx --style=css
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/ResultsTable/ResultsTable.tsx --style=css
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/JsonViewer/JsonViewer.tsx --style=css
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/ErrorBanner/ErrorBanner.tsx --style=css
   nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/Spinner/Spinner.tsx --style=css
   ```

   * `Button/ Button.module.css`
   * `Header/ Header.module.css`
   * `RunAnalyzerForm/ RunAnalyzerForm.module.css`
   * `ResultsTable/ ResultsTable.module.css`
   * `JsonViewer/ JsonViewer.module.css`
   * `ErrorBanner/ ErrorBanner.module.css`
7. **Implement `useAnalyzer` hook** that POSTs to `/api/analyze`.
8. **Generate and wire `app/page.tsx`**:

   ```bash
   nx g @nx/next:page --path=apps/ts-analyzer-next/app/page.tsx --style=css
   ```

   Compose components, calling `useAnalyzer`.
9. **Dev workflow**: document dev command that runs `analyzer:build` then `nx dev ts-analyzer-next`.
10. **Manual testing**: verify `nx build tsserver-analyzer` produces expected dist file, `node dist/.../index.js --json` outputs JSON, and app `/api/analyze` returns parsed result.

---

## Error-handling & UX details (MVP)

* If CLI stdout cannot be parsed as JSON, return a 500 with `rawStdout` for debugging. Show `ErrorBanner` with a copyable raw output in the UI.
* Use `Spinner` and `StatusBadge` for long-running runs.
* Limit concurrency: reject new runs while one is in progress (simple UI disable).

---

## CSS modules & theming approach

* Provide `src/styles/theme.module.css`:

  * Expose CSS variables for primary/secondary colors, border radii, spacing tokens used by components.
* Each component imports its `.module.css` and uses variables. Example:

  ```css
  /* Button.module.css */
  .btn {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
  }
  ```

* Keep styles minimal and focused.

---

## Deliverables checklist (updated)

* [ ] `nx build` script for `@emperorrag/tsserver-analyzer` (outputs to `packages/tsserver-analyzer/dist`).
* [ ] App-level npm scripts: `dev` (start app).
* [ ] `app/api/analyze/route.ts` that spawns CLI and parses JSON.
* [ ] `src/lib/analyzerCli.ts` wrapper encapsulating spawn/parse/timeouts.
* [ ] `src/lib/types/index.ts`.
* [ ] Radix primitives installed and configured.
* [ ] Components in `src/components/*` built with Radix primitives and CSS modules:

  * `Button`, `Header`, `RunAnalyzerForm`, `ResultsTable`, `JsonViewer`, `ErrorBanner`, `Spinner`.
* [ ] `src/hooks/useAnalyzer.ts` hook calling API.
* [ ] `app/page.tsx` composing the UI.
* [ ] README short instructions: build analyzer, run app, expected output.

---

If you want, I can now produce the **starter file scaffolding** for the app side only (no analyzer source)—including:

* `app/api/analyze/route.ts` (spawn-based implementation that expects a built analyzer at `packages/tsserver-analyzer/dist/index.js` and `--json` output),
* `src/lib/analyzerCli.ts` (spawn wrapper),
* `src/lib/types/index.ts`,
* `src/hooks/useAnalyzer.ts`,
* minimal client components: `RunAnalyzerForm`, `ResultsTable`, `JsonViewer`, and `Button` using CSS module placeholders.

Say “generate starter files” and I’ll create those files ready to drop into `apps/ts-analyzer-next`.
