# Phase 5: Testing & Refinement

**Goal:** Verify the application works as expected and polish the user experience.

## 1. Manual Verification Steps

1. **Build Analyzer:**

    ```bash
    npm run analyzer:build
    ```

    Verify `packages/tsserver-analyzer/dist/index.js` exists.

2. **Start Dev Server:**

    ```bash
    npm run dev
    ```

3. **Run Analysis:**
    * Open `http://localhost:4200` (or configured port).
    * Click "Run Analyzer".
    * Verify spinner appears.
    * Verify results appear after completion.

## 2. Edge Case Testing

1. **Analyzer Failure:**
    * Temporarily break the analyzer (e.g., make it exit with 1).
    * Run analysis.
    * Verify `ErrorBanner` appears with error details.

2. **Invalid JSON:**
    * Make the analyzer output non-JSON text.
    * Run analysis.
    * Verify app handles parsing error gracefully and shows raw output.

3. **Timeout:**
    * Add a delay to the analyzer.
    * Verify the API route times out and returns an error.

## 3. Refinement

* Check responsiveness on smaller screens.
* Ensure accessibility (tab navigation, aria labels).
* Polish CSS variables in `theme.module.css`.
