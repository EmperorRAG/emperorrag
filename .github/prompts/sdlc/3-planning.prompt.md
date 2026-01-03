---
description: 'Planning Stage - Create epics, user stories, and requirements traceability'
agent: 'Planning Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'web/fetch',
    'edit/editFiles',
    'execute/runInTerminal',
    'github/*',
    'context7/*',
    'nx-mcp-server/*',
  ]
---

# Planning Stage

Break down high-level requirements into actionable work items and establish traceability for complete coverage.

## Prerequisites

The following Definition artefacts must exist:
- PRD: `{projectPath}/sdlc/2-definition/prd.md`
- Acceptance Criteria: `{projectPath}/sdlc/2-definition/acceptance-criteria.md`
- Test Strategy: `{projectPath}/sdlc/2-definition/test-strategy.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:sprintContext:Sprint or iteration context for planning}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Epic Definitions | Product Manager | [product-manager-epic-create](../roles/product-manager/epic/product-manager-epic-create.prompt.md) |
| 2 | User Stories | Product Manager | [product-manager-user-story-create](../roles/product-manager/user-story/product-manager-user-story-create.prompt.md) |
| 3 | RTM (Initial) | QA Tester | [quality-assurance-tester-rtm-create](../roles/quality-assurance-tester/rtm/quality-assurance-tester-rtm-create.prompt.md) |

## Workflow

### 1. Create Epic Definitions

Break the PRD into Epics that define:
- Epic title and description
- Business value and success criteria
- Dependencies and blockers
- Estimated size (T-shirt sizing)
- Priority and sequencing

**Output**: `{projectPath}/sdlc/3-planning/epics.md`

### 2. Create User Stories

Detail each Epic into User Stories that include:
- User story format (As a... I want... So that...)
- Detailed acceptance criteria
- Technical notes and considerations
- Story point estimates
- Definition of done

**Output**: `{projectPath}/sdlc/3-planning/user-stories.md`

### 3. Create RTM (Initial)

Create the initial Requirements Traceability Matrix:
- Map requirements to user stories
- Link acceptance criteria to planned tests
- Identify coverage gaps
- Track requirement status

**Output**: `{projectPath}/sdlc/3-planning/rtm.md`

## Quality Gate

Planning is complete when:
- [ ] Epics are sized, ordered, with success criteria and dependencies captured
- [ ] User stories have clear intent, acceptance criteria, and are estimable
- [ ] RTM maps every requirement to planned tests
- [ ] Coverage gaps are resolved or risk is accepted
- [ ] Backlog is prioritized and ready for technical design

## Output Directory

```
{projectPath}/sdlc/3-planning/
├── epics.md
├── user-stories.md
└── rtm.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Design Stage](./4-design.prompt.md) to create technical architecture and specifications.

---

Use the handoff buttons to create each artefact in sequence.
