# Phase 1: Project Setup & Configuration

**Goal:** Prepare the workspace, dependencies, and shared configurations for `ts-analyzer-next`.

## 1. Create Shared Types

Create `apps/ts-analyzer-next/src/lib/types/index.ts`:

```typescript
export interface ColumnSpec {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
}

export type TableRow = Record<string, any>;

export interface TableResult {
  columns: ColumnSpec[];
  rows: TableRow[];
  total?: number;
}

export interface AnalysisResult {
  id?: string;
  summary?: Record<string, any>;
  tables?: Record<string, TableResult>;
  raw?: any;
  timestamp?: string;
}
```

## 2. Define Theme Variables

Populate `apps/ts-analyzer-next/src/styles/theme.module.css` with these specific values:

```css
/* apps/ts-analyzer-next/src/styles/theme.module.css */
:root {
  --color-primary: #0070f3;
  --color-on-primary: #ffffff;
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-text: #333333;
  --color-error: #e00;

  --radius-sm: 4px;
  --radius-md: 8px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
}
```
