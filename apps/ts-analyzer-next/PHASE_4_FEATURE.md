# Phase 4: Feature Implementation (Page & Hook)

**Goal:** Assemble the components and logic into a functional application.

## 1. Implement `useAnalyzer` Hook

Create `apps/ts-analyzer-next/src/hooks/useAnalyzer.ts`.

**State:**

* `status`: 'idle' | 'loading' | 'success' | 'error'
* `result`: `AnalysisResult | null`
* `error`: `string | null`
* `rawError`: `string | null`

**Actions:**

* `runAnalysis()`: Calls `POST /api/analyze`. Updates state.

```typescript
export function useAnalyzer() {
  // ... state ...
  const runAnalysis = async () => {
    // ... fetch logic ...
  };
  return { status, result, error, rawError, runAnalysis };
}
```

## 2. Generate Page

Run the Nx command:

```bash
nx g @nx/next:page --path=apps/ts-analyzer-next/app/page.tsx --style=css
```

## 3. Implement `app/page.tsx`

Compose the UI using the components and hook.

```tsx
import { useAnalyzer } from '../src/hooks/useAnalyzer';
import { Header } from '../src/components/Header/Header';
import { RunAnalyzerForm } from '../src/components/RunAnalyzerForm/RunAnalyzerForm';
import { ResultsTable } from '../src/components/ResultsTable/ResultsTable';
// ... imports

export default function Page() {
  const { status, result, error, runAnalysis } = useAnalyzer();

  return (
    <main>
      <Header />
      <RunAnalyzerForm onRun={runAnalysis} isRunning={status === 'loading'} />

      {status === 'error' && <ErrorBanner message={error} />}

      {status === 'success' && result && (
        <>
           {/* Render tables from result.tables */}
           {/* Render JsonViewer for result.raw */}
        </>
      )}
    </main>
  );
}
```

## 4. Update `app/layout.tsx`

Ensure `Theme` provider (if using Radix Themes) or global CSS is applied.

```tsx
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import '../src/styles/theme.module.css'; // Your custom vars

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
```
