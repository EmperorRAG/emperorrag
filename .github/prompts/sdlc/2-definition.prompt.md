---
description: 'Definition Stage - Create PRD, acceptance criteria, and test strategy'
agent: 'Definition Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'web/fetch',
    'edit/editFiles',
    'execute/runInTerminal',
    'github/*',
    'context7/*',
  ]
---

# Definition Stage

Transform the strategic vision into concrete requirements, defining what must be built and how quality will be validated.

## Prerequisites

The following Discovery artefacts must exist:
- Product Vision: `{projectPath}/sdlc/1-discovery/product-vision.md`
- Product Roadmap: `{projectPath}/sdlc/1-discovery/product-roadmap.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:featureName:Name of the feature or initiative from roadmap}
- ${input:scopeContext:Specific scope and boundaries for this definition}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | PRD | Product Manager | [product-manager-prd-create](../roles/product-manager/prd/product-manager-prd-create.prompt.md) |
| 2 | Acceptance Criteria | Product Manager | [product-manager-acceptance-criteria-create](../roles/product-manager/acceptance-criteria/product-manager-acceptance-criteria-create.prompt.md) |
| 3 | Test Strategy | QA Tester | [quality-assurance-tester-test-strategy-create](../roles/quality-assurance-tester/test-strategy/quality-assurance-tester-test-strategy-create.prompt.md) |

## Workflow

### 1. Create PRD

Create a Product Requirements Document that defines:
- Problem statement and business case
- Goals and success metrics
- Functional and non-functional requirements
- Scope (in/out) and constraints
- User context and use cases
- Open questions and dependencies

**Output**: `{projectPath}/sdlc/2-definition/prd.md`

### 2. Create Acceptance Criteria

Create high-level Acceptance Criteria that establish:
- Testable criteria for each requirement
- Edge cases and error scenarios
- Data validation rules
- Performance expectations
- Security requirements

**Output**: `{projectPath}/sdlc/2-definition/acceptance-criteria.md`

### 3. Create Test Strategy

Create a Test Strategy document that defines:
- Scope and risk-based approach
- Test types and coverage targets
- Test environments and tools
- Entry/exit criteria
- Roles and responsibilities

**Output**: `{projectPath}/sdlc/2-definition/test-strategy.md`

## Quality Gate

Definition is complete when:
- [ ] Scope, non-goals, and constraints approved by stakeholders
- [ ] User problem and success metrics clearly defined
- [ ] Acceptance criteria outline established and testable
- [ ] Test strategy scope and approach approved
- [ ] Technical feasibility reviewed with engineering

## Output Directory

```
{projectPath}/sdlc/2-definition/
├── prd.md
├── acceptance-criteria.md
└── test-strategy.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Planning Stage](./3-planning.prompt.md) to create epics, user stories, and RTM.

---

Use the handoff buttons to create each artefact in sequence.
