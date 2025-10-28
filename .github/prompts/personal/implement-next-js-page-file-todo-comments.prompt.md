---
description: 'Apply Next.js page implementation plan to resolve TODO comments'
mode: 'agent'
tools:
    - 'edit'
    - 'search'
    - 'runCommands'
    - 'runTasks'
    - 'Nx Mcp Server/*'
    - 'context7/*'
    - 'usages'
    - 'vscodeAPI'
    - 'think'
    - 'problems'
    - 'testFailure'
    - 'fetch'
    - 'githubRepo'
    - 'todos'
    - 'runTests'
    - 'openSimpleBrowser'
---

# Implement Next.js Page TODO Comments

## Mission

Resolve TODO comments within a Next.js page or supporting file so that the
implementation aligns with the approved plan while respecting repository
conventions and available backend integrations.

## Scope & Preconditions

-   Target file path: `${input:targetFile}` (must reside under `${input:projectRoot}`).
-   Use `${input:implementationPlanPath}` to understand required behaviors.
-   Only modify TODO sections tied to the plan; avoid unrelated refactors.
-   Honor repository instructions (Next.js, React, FP paradigm, markdown).
-   Invoke MCP tools (Nx project details, Context7 docs) when additional context is required.
-   Ensure changes stay within the current project directory `${input:projectRoot}`.

## Inputs

-   `${input:implementationPlanPath:Relative path to the plan markdown}`
-   `${input:projectRoot:Root directory of the current project}`
-   `${input:targetFile:File whose TODOs must be implemented}`
-   `${input:frontendProject:Workspace project name}`
-   `${input:backendProject:Workspace backend project}`
-   `${input:integrationName:Primary backend integration or plugin}`
-   `${input:sharedComponent:Key reusable component}`
-   `${input:testingApproach:Preferred testing workflow}`
-   `${input:constraints:Important functional or security constraints}`
-   `${input:devServerCommand:Command that starts the dev server}`
-   `${input:pageUrl:Absolute or relative URL for the working page}`

## Workflow

1. Read `${input:implementationPlanPath}` and identify plan sections relevant to `${input:targetFile}`.
2. Inspect `${input:targetFile}` for TODO markers and document the expected change for each, mapping them back to plan sections.
3. Gather supporting context:
    - Use `mcp_nx_mcp_server_nx_project_details` for project config.
    - Fetch integration docs via `mcp_context7_resolve-library-id` and `mcp_context7_get-library-docs` when backend details are unclear.
4. Ensure the dev server is running:
    - Execute `${input:devServerCommand}` using the terminal tool (for example, `runCommands`).
    - Keep the terminal session open and monitor the output for build/runtime errors that surface while you work.
5. Open the application in the simple browser:
    - Launch `${input:pageUrl}` with the `openSimpleBrowser` tool so issues appear alongside server logs.
    - Refresh after each significant change to verify fixes.
6. Implement each TODO:
    - Introduce necessary imports, data fetching, component usage, or business logic as dictated by the plan.
    - Maintain FP principles, TypeScript strictness, and Next.js conventions.
    - Remove the TODO comment once completed; replace with concise doc comments when clarification helps future maintainers.
7. Add or update tests (guided by `${input:testingApproach}`) when the TODO calls for verification of new behavior.
8. If any TODO cannot be completed due to missing information, leave a clarified TODO describing the blocker and reference the plan section.

## Output Expectations

-   Updated `${input:targetFile}` with TODOs resolved according to the plan.
-   Additional files (tests, utilities) only when required by the plan and scoped inside `${input:projectRoot}`.
-   Code that compiles under strict TypeScript checking and adheres to FP guidelines (no `any`, no uncontrolled side effects).
-   Inline documentation or JSDoc when the implementation is non-trivial.

## Quality Assurance

-   Confirm each change directly satisfies a plan requirement; cite the section when summarizing work.
-   Run or outline relevant tests per `${input:testingApproach}` to validate the behavior.
-   Verify the dev server console is free of new errors after changes and note any lingering warnings.
-   Ensure no new TODOs are introduced except documented blockers.
-   Provide a concise summary of modifications and residual risks in the final output.
