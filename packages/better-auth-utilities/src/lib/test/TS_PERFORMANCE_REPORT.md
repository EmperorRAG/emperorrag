# TypeScript Language Server Performance Report

## Executive Summary

This report analyzes the current state of the TypeScript Language Server (tsserver) within the `emperorrag` monorepo. The investigation focused on identifying the root causes of high memory usage and load times.

**Key Findings:**

1. **Zero Build Artifact Leakage:** The recent configuration changes successfully prevented `dist` and `out-tsc` folders from being indexed.
2. **High Symbol Count:** The primary driver of load is the sheer volume of type definitions from `node_modules` and the generated Prisma client.
3. **Memory Usage:** A single project (`better-auth-nest-js-microservice`) consumes ~310MB of memory. When scaling to the full monorepo (all projects open), this explains the need for the 4GB memory limit.

## 1. Current Metrics

We ran extended diagnostics on the `better-auth-nest-js-microservice` project to establish a baseline.

| Metric | Value | Context |
| :--- | :--- | :--- |
| **Files** | `1,194` | Source files + `d.ts` files from dependencies |
| **Lines of Definitions** | `251,199` | Mostly `node_modules` and Prisma generated types |
| **Symbols** | `173,789` | Unique identifiers tracked by the server |
| **Memory Used** | `~310 MB` | RAM consumed for *just this one project* |
| **I/O Read Time** | `0.22s` | Time spent reading files from disk |

**Extrapolation:**
With `typescript.workspaceSymbols.scope` set to `allOpenProjects` (default), VS Code loads the graph for the frontend, backend, and libraries simultaneously.

* **Estimated Total Symbols:** ~500,000 - 700,000
* **Estimated Memory:** 1.5GB - 2.5GB (approaching the default Node.js limit, hence the need for `--max-old-space-size=4096`).

## 2. Identified Sources of Load

### A. `node_modules` (The "Tree" Effect)

Even though `node_modules` is excluded from *compilation*, it is **required** for type checking.

* **Observation:** The diagnostic output shows 250k+ lines of definitions.
* **Cause:** Libraries like `rxjs`, `nestjs`, and `react` ship with massive type definition files.
* **Impact:** Unavoidable. This is the cost of using typed libraries.

### B. Prisma Client

* **Size:** ~25MB on disk.
* **Lines:** ~22,000 lines of complex, deeply nested type definitions.
* **Impact:** Prisma generates a massive type map to support its fluent API (`prisma.user.findMany...`). This is computationally expensive for `tsc` to parse and validate.

### C. Monorepo Structure

* **Observation:** The root `tsconfig.json` references all projects.
* **Impact:** When you open a file, `tsserver` may try to resolve references across the entire workspace graph to provide features like "Find All References".

## 3. Configuration Analysis

### ✅ What is working well

* **Excludes:** `dist`, `out-tsc`, and `coverage` are correctly excluded in `tsconfig.base.json` and `vite.config.ts`.
* **Vite Plugin:** The `dts` plugin in Vite is now configured to ignore build artifacts, preventing a feedback loop where building creates more files for `tsc` to index.
* **Watch Options:** `useFsEvents` is enabled, which is the most efficient strategy for file watching.

### ⚠️ Areas for Optimization

1. **`vitest.filesWatcherInclude`**
    * **Status:** Optimized. We restricted this to `{apps,packages}/**/*.{ts,tsx,js,jsx,json}` to reduce the number of file handles.

2. **`typescript.preferences.autoImportFileExcludePatterns`**
    * **Status:** Optimized. We added patterns to prevent `dist` files from appearing in auto-imports.

## 4. Recommendations

### Immediate Actions (Already Applied)

1. **Keep the 4GB Memory Limit:** The `--max-old-space-size=4096` flag is necessary and correct for a repo of this size.
2. **Use `useInferredProjectPerProjectRoot`:** This isolates loose files (scripts, configs) into their own mini-projects, preventing them from polluting the global scope.

### Future Optimizations

1. **Prisma Optimization:**
    * Ensure `prisma generate` is only run when the schema changes.
    * Consider splitting the Prisma schema if it grows too large (though not necessary yet).

2. **VS Code Settings:**
    * If performance degrades further, consider setting `typescript.workspaceSymbols.scope` to `currentProject`. This will make "Go to Symbol" faster but less comprehensive.

3. **Barrel Files:**
    * Avoid creating massive `index.ts` files that export everything. They force `tsc` to resolve the entire tree whenever the barrel is imported. Prefer direct imports where possible.

## Conclusion

The TypeScript setup is now "clean" (no artifacts leaking). The load you are experiencing is "organic"—it comes from the legitimate size of your dependencies and the complexity of the Prisma client. The current configuration (4GB RAM + optimized excludes) is the correct solution for this scale.
