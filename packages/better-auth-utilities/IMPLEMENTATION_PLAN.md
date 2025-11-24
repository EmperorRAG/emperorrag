# Implementation Plan: Optimize Better Auth Utilities Exports

## Goal

Optimize the `better-auth-utilities` package to expose granular entry points for all source files. This aims to improve TypeScript compiler and Language Server performance in the Nx monorepo by reducing project recalculation overhead.

## Strategy

Restructure the package exports to allow importing individual files directly (e.g., `@emperorrag/better-auth-utilities/core/email/server/change-password/changePassword.schema`) instead of relying on large barrel files.

## Execution Steps

### 1. Update `vite.config.ts`

Modify the Vite configuration to dynamically generate entry points from the source directory.

- **Dynamic Entry Scanning**:
  - Implement a function to recursively scan `src/lib` for `.ts` files.
  - **Strict Exclusions**:
    - `**/*.spec.ts`
    - `**/*.test.ts`
    - `**/test/**`
    - `setup-test-env.ts`
- **Build Configuration**:
  - Set `build.lib.entry` to the dynamically generated map of files.
  - Configure `build.lib.fileName` to ensure the output in `dist/lib` mirrors the source structure in `src/lib`.

### 2. Update `package.json`

Refactor the `exports` field to use Node.js Subpath Patterns, enabling wildcard imports while maintaining Nx compatibility.

- **Exports Configuration**:

  ```json
  "exports": {
    ".": {
      "@emperorrag/source": "./src/index.ts",
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./*": {
      "@emperorrag/source": "./src/lib/*.ts",
      "types": "./dist/lib/*.d.ts",
      "import": "./dist/lib/*.js",
      "default": "./dist/lib/*.js"
    }
  }
  ```

- **Key Constraint**: The `@emperorrag/source` condition must be preserved to ensure Nx can correctly map imports to source files during local development.

## Verification

- Ensure `dist/lib` does not contain any test files (`.spec.js`, `.test.js`) after building.
- Verify that imports can be resolved both via the root (`@emperorrag/better-auth-utilities`) and deep paths (`@emperorrag/better-auth-utilities/path/to/file`).
