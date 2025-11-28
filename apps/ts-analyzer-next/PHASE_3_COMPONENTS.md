# Phase 3: UI Components (Radix & CSS Modules)

**Goal:** Build the reusable UI building blocks using Radix UI primitives and CSS Modules.

## 1. Generate Components

Run the following Nx commands to scaffold the components:

```bash
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/Button/Button.tsx --style=css
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/Header/Header.tsx --style=css
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/RunAnalyzerForm/RunAnalyzerForm.tsx --style=css
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/ResultsTable/ResultsTable.tsx --style=css
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/JsonViewer/JsonViewer.tsx --style=css
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/ErrorBanner/ErrorBanner.tsx --style=css
npx nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/Spinner/Spinner.tsx --style=css
```

## 2. Implement Components

For each component, implement the logic and styling. Ensure you create an `index.ts` barrel file for each component folder (e.g., `export * from './Button';`).

### `Button`

* **Directive:** `'use client'`
* **Props:** `onClick`, `disabled`, `children`, `variant` (primary/secondary).
* **Style:** Use `Button.module.css`. Use CSS variables.

### `Header`

* **Content:** App title ("TS Analyzer"), optional actions.
* **Style:** `Header.module.css`. Flexbox layout.

### `RunAnalyzerForm`

* **Directive:** `'use client'`
* **Content:** A single "Run Analyzer" button.
* **Props:** `onRun: () => void`, `isRunning: boolean`.
* **Style:** `RunAnalyzerForm.module.css`.

### `ResultsTable`

* **Directive:** `'use client'` (if sorting/filtering is added later, otherwise optional but good practice for UI components receiving data)
* **Props:** `data: TableResult`.
* **Content:** Render a standard HTML table or Radix primitive if applicable.
* **Style:** `ResultsTable.module.css`. Handle scrolling if wide.

### `JsonViewer`

* **Directive:** `'use client'`
* **Props:** `data: any`.
* **Content:** `<pre><code>{JSON.stringify(data, null, 2)}</code></pre>`.
* **Feature:** Use `@radix-ui/react-collapsible` to toggle visibility.
* **Style:** `JsonViewer.module.css`.

### `ErrorBanner`

* **Directive:** `'use client'`
* **Props:** `message: string`, `rawOutput?: string`.
* **Content:** Error message in red. Collapsible raw output.
* **Style:** `ErrorBanner.module.css`.

### `Spinner`

* **Content:** CSS-based loading spinner.
* **Style:** `Spinner.module.css`.
