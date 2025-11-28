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

## 2. Generate Feature Component

Create a Client Component to hold the feature logic, keeping the page as a Server Component.

```bash
nx g @nx/next:component --path=apps/ts-analyzer-next/src/components/AnalyzerFeature/AnalyzerFeature.tsx --style=css
```

## 3. Implement `AnalyzerFeature`

Implement the UI logic in `apps/ts-analyzer-next/src/components/AnalyzerFeature/AnalyzerFeature.tsx`.

```tsx
'use client';

import { useAnalyzer } from '../../hooks/useAnalyzer';
import { Header } from '../Header';
import { RunAnalyzerForm } from '../RunAnalyzerForm';
import { ResultsTable } from '../ResultsTable';
import { ErrorBanner } from '../ErrorBanner';
// ... imports

export function AnalyzerFeature() {
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

## 4. Generate Page

Run the Nx command:

```bash
nx g @nx/next:page --path=apps/ts-analyzer-next/src/app/page.tsx --style=css
```

## 5. Implement `src/app/page.tsx`

Render the feature component.

```tsx
import { AnalyzerFeature } from '../components/AnalyzerFeature/AnalyzerFeature';

export default function Page() {
  return <AnalyzerFeature />;
}
```

## 6. Implement `src/app/layout.tsx`

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
