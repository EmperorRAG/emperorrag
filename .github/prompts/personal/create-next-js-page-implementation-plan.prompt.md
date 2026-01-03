---
description: 'Generate a reusable implementation plan for a Next.js page'
mode: 'agent'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'web/fetch',
    'edit/editFiles',
    'github/*',
    'nx-mcp-server/*',
    'context7/*',
  ]
---

# Create Next.js Page Implementation Plan

## Mission

Draft a proof-of-concept implementation plan for a Next.js page that
surfaces required backend capabilities while honoring repository
guidelines and relevant platform integrations.

## Scope & Preconditions

-   Work within `${input:frontendProject}` and assume the page lives at `${input:pagePath}`.
-   Only expose functionality supported by `${input:integrationName}`.
-   Reference repository instructions (for example, `.github/instructions/nextjs.instructions.md` and `.github/instructions/reactjs.instructions.md`).
-   Use existing shared components (for example, `${input:sharedComponent}`) where applicable.
-   Confirm backend support resides in `${input:backendProject}`.

## Inputs

-   `${input:pageGoal:Describe the business goal for the page}`
-   `${input:pagePath:apps/.../page.tsx}`
-   `${input:frontendProject:Workspace project name}`
-   `${input:backendProject:Workspace project name}`
-   `${input:integrationName:Primary backend integration or plugin}`
-   `${input:sharedComponent:Key reusable component}`
-   `${input:targetAudience:Primary user role}`
-   `${input:constraints:Notable limitations or requirements}`

## Workflow

1. Inspect Nx metadata for `${input:frontendProject}` and `${input:backendProject}` using the `mcp_nx_mcp_server_nx_project_details` tool.
2. Review Next.js and React instructions in `.github/instructions/` to extract relevant standards.
3. Resolve `${input:integrationName}` documentation through the `mcp_context7_resolve-library-id` tool, then pull targeted endpoint or feature guidance using `mcp_context7_get-library-docs`.
4. Summarize backend API responsibilities and list required endpoints or actions that align with the proof-of-concept.
5. Outline shared contracts, data flows, and component responsibilities including `${input:sharedComponent}` usage.
6. Detail testing, operational, and documentation tasks that must be completed before sign-off.
7. Organize findings into numbered sections mirroring the example format (backend, shared contracts, data layer, UI, workflows, access control, testing, readiness).

## Output Expectations

-   Markdown plan placed under `${input:pagePath%/*}/implementation-plan.md` with YAML front matter (fill best-effort defaults when unspecified).
-   Include an H1 title and numbered sections similar to the provided template, adapting content to `${input:pageGoal}` and `${input:constraints}`.
-   Highlight required tools, endpoints, and shared assets referenced in the workflow.
-   Keep line length within repository markdown guidance and avoid adding runnable code examples outside JSDoc blocks.

## Quality Assurance

-   Confirm all required inputs are supplied; request missing values and stop if unavailable.
-   Verify the generated plan only relies on capabilities documented for `${input:integrationName}`.
-   Ensure instructions and tools cited are actually consulted (or note why they were unnecessary).
-   Cross-check that each section of the plan aligns with Next.js instructions and project conventions.
