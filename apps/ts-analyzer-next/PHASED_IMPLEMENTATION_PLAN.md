# Phased Implementation Plan: ts-analyzer-next

This document outlines the step-by-step plan to implement the `ts-analyzer-next` application, breaking down the original `IMPLEMENTATION_PLAN.md` into manageable phases.

Each phase will have its own detailed instruction file created in the `apps/ts-analyzer-next` directory.

## Phase 1: Project Setup & Configuration

**File:** `apps/ts-analyzer-next/PHASE_1_SETUP.md`

**Goal:** Prepare the workspace, dependencies, and shared configurations.

**Key Tasks:**

1. **Scripts:** Add `dev` script to `package.json`. Nx handles the build dependency.
2. **Dependencies:** Install necessary Radix UI primitives and other runtime dependencies.
3. **Types:** Create `src/lib/types/index.ts` to define `AnalysisResult`, `TableResult`, and other shared interfaces.
4. **Styling:** Set up `src/styles/theme.module.css` (or global CSS) with CSS variables for theming, ensuring a consistent look across components.

---

## Phase 2: Backend Logic (API & CLI Wrapper)

**File:** `apps/ts-analyzer-next/PHASE_2_BACKEND.md`

**Goal:** Implement the server-side logic to interface with the `tsserver-analyzer` CLI.

**Key Tasks:**

1. **CLI Wrapper:** Create `src/lib/analyzerCli.ts`. This module will handle `child_process.spawn` to run the built analyzer, manage timeouts, and parse `stdout` as JSON.
2. **API Route:** Implement `app/api/analyze/route.ts`. This Next.js App Router endpoint will invoke the CLI wrapper and return standardized success/error responses to the client.
3. **Error Handling:** Ensure robust handling of CLI failures, non-JSON output, and process timeouts.

---

## Phase 3: UI Components (Radix & CSS Modules)

**File:** `apps/ts-analyzer-next/PHASE_3_COMPONENTS.md`

**Goal:** Build the reusable UI building blocks using Radix UI primitives and CSS Modules.

**Key Tasks:**

1. **Base Components:** Create simple components like `Button`, `Header`, `Spinner`, and `StatusBadge` with their respective `*.module.css` files.
2. **Complex Components:** Implement `RunAnalyzerForm` (input/controls), `ResultsTable` (data display), `JsonViewer` (raw output), and `ErrorBanner` (feedback).
3. **Styling:** Ensure all components consume the theme variables defined in Phase 1 and strictly follow the CSS Modules pattern.
4. **Nx Generation:** Use `nx g @nx/next:component` to scaffold components.

---

## Phase 4: Feature Implementation (Page & Hook)

**File:** `apps/ts-analyzer-next/PHASE_4_FEATURE.md`

**Goal:** Assemble the components and logic into a functional application.

**Key Tasks:**

1. **Hook:** Implement `useAnalyzer` hook to manage the API request state (`idle`, `loading`, `success`, `error`) and data.
2. **Page Layout:** Construct `app/page.tsx` to compose the UI: Header, Form, Status, Results, and Error displays.
3. **App Shell:** Update `app/layout.tsx` to provide the necessary HTML structure and global styles.
4. **Nx Generation:** Use `nx g @nx/next:page` to scaffold the main page.

---

## Phase 5: Testing & Refinement

**File:** `apps/ts-analyzer-next/PHASE_5_TESTING.md`

**Goal:** Verify the application works as expected and polish the user experience.

**Key Tasks:**

1. **Manual Verification:** Test the full flow: Build Analyzer -> Run App -> Trigger Analysis -> View Results.
2. **Edge Cases:** Verify behavior when the analyzer fails, returns invalid JSON, or times out.
3. **Refinement:** Tweak styles, improve error messages, and ensure the UI is responsive and accessible.
