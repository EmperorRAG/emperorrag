# Phase 2: Backend Logic (API & CLI Wrapper)

**Goal:** Implement the server-side logic to interface with the `tsserver-analyzer` CLI.

## 1. Create CLI Wrapper

Create `apps/ts-analyzer-next/src/lib/analyzerCli.ts`.

**Requirements:**

* Function `runAnalyzerCli(): Promise<AnalysisResult>`
* Use `child_process.spawn` to execute `node packages/tsserver-analyzer/dist/index.js --json`.
* **Important:** Ensure the path to the analyzer is correct relative to the CWD of the Next.js server.
* Capture `stdout` and `stderr`.
* Parse `stdout` as JSON.
* Handle timeouts (e.g., kill process after 30s).
* Return `AnalysisResult` on success.
* Throw error with raw output on failure/parse error.

```typescript
import { spawn } from 'child_process';
import path from 'path';
import { AnalysisResult } from './types';

export async function runAnalyzerCli(): Promise<AnalysisResult> {
  // Implementation details...
  // 1. Resolve path to analyzer dist
  // 2. Spawn process
  // 3. Collect data
  // 4. Parse and return
}
```

## 2. Implement API Route

Create `apps/ts-analyzer-next/app/api/analyze/route.ts`.

**Requirements:**

* Handle `POST` requests.
* Call `runAnalyzerCli()`.
* Return `200 OK` with JSON body `{ success: true, result: ... }`.
* Return `500 Internal Server Error` with JSON body `{ success: false, error: ..., raw: ... }` on failure.

```typescript
import { NextResponse } from 'next/server';
import { runAnalyzerCli } from '../../../src/lib/analyzerCli';

export async function POST() {
  try {
    const result = await runAnalyzerCli();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, raw: error.raw },
      { status: 500 }
    );
  }
}
```
