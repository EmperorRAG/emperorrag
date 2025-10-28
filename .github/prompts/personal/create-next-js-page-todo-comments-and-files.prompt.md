---
description: 'Scaffold files, signatures, and TODOs from a Next.js plan'
mode: 'agent'
tools: ['edit', 'search', 'Nx Mcp Server/*', 'context7/*', 'fetch', 'githubRepo']
---

# Create Next.js Page TODO Scaffolding

## Mission

Translate a supplied implementation plan into concrete filesystem
scaffolding: create required files, add function or component signatures,
and insert TODO comments describing follow-up work.

## Scope & Preconditions

-   Use `${input:implementationPlanPath}` as the canonical plan source.
-   Confine edits strictly to `${input:projectRoot}` (the current working project directory); never modify files outside this tree.
-   Respect repository instructions (e.g. `.github/instructions/nextjs.instructions.md`, `.github/instructions/reactjs.instructions.md`, `.github/instructions/markdown.instructions.md`).
-   Do not implement business logic—only create scaffolding, signatures, and TODOs derived from the plan.
-   Maintain existing code style, naming, and functional programming conventions highlighted in instructions.

## Inputs

-   `${input:implementationPlanPath:Relative path to the plan markdown}`
-   `${input:projectRoot:Root directory of the current project}`
-   `${input:pagePath:Target Next.js page entry point}`
-   `${input:primaryStack:Key framework or stack details}`
-   `${input:sharedAssets:Comma-separated shared components or utils}`
-   `${input:testingApproach:Preferred testing strategy}`
-   `${input:constraints:Explicit limitations from stakeholders}`

## Workflow

1. Read `${input:implementationPlanPath}` and summarize each numbered section into actionable tasks.
2. Cross-reference relevant instruction files to confirm naming, architecture, and documentation standards.
3. Enumerate files/modules the plan calls for; include tests, stories, styles, or docs when mentioned.
4. For each file:
    - Create it when missing.
    - Add appropriate imports, exported function/component signatures, or placeholders that satisfy TypeScript/Next.js expectations.
    - Insert TODO comments that capture the plan’s specific work items.
5. When files already exist, append signatures or TODO blocks without duplicating content; preserve custom logic.
6. Add focused TODO comments for testing artifacts guided by `${input:testingApproach}`.
7. After edits, list affected files and any follow-up actions the plan implies but could not be automated (e.g. schema migrations).

## Output Expectations

-   Files created/updated within `${input:projectRoot}` with stubs and TODO comments aligned to the plan’s sections.
-   TypeScript/TSX signatures must compile under strict settings (no `any`; prefer `unknown` or typed placeholders).
-   TODO comments should be descriptive and reference the relevant plan section (e.g. `TODO(plan §3): Implement data fetching effect`).
-   No business logic implementations—only scaffolding and descriptive comments.

## Quality Assurance

-   Verify every TODO/comment traces back to a plan requirement.
-   Confirm imports, exports, and filenames follow Next.js and FP conventions from repository instructions.
-   Ensure no existing user-authored code is removed unless explicitly directed in the plan.
-   Summarize created files and outstanding TODOs in the final response.
