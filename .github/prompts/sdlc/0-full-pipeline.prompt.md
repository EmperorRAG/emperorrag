---
description: 'Complete SDLC Pipeline - Automates all 8 stages from Discovery through Operate'
agent: 'Discovery Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'search/usages',
    'search/changes',
    'web/fetch',
    'read/problems',
    'edit/editFiles',
    'execute/runInTerminal',
    'execute/runTests',
    'github/*',
    'nx-mcp-server/*',
    'context7/*',
    'effect-mcp/*',
    'cognitionai/deepwiki/*',
  ]
---

# Complete SDLC Pipeline

Automate the entire Software Development Lifecycle from Discovery through Operate, creating all required artefacts in the correct order with proper role assignments.

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:projectName:Name of the project or initiative}
- ${input:businessContext:Business context, strategic goals, and market opportunity}
- ${input:targetUsers:Primary target users or personas}
- ${input:problemStatement:The core problem being solved}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Pipeline Overview

This pipeline orchestrates **8 SDLC stages** with **30+ artefacts** created in sequence:

| Stage | Primary Owner | Key Artefacts |
|-------|---------------|---------------|
| 1. Discovery | Product Manager | Vision, Roadmap |
| 2. Definition | Product Manager + QA | PRD, Acceptance Criteria, Test Strategy |
| 3. Planning | Product Manager + QA | Epics, User Stories, RTM |
| 4. Design | Tech Lead + Backend Eng | TDD, Architecture, ADRs, Contracts, Data Model |
| 5. Build | Backend Dev + Tech Lead | Specs, Migrations, Tests, PRs, Code Review |
| 6. Test | QA Tester | Test Plan, Cases, Execution, Bug Reports |
| 7. Release | Product Manager + QA | Release Plan, Sign-off, Notes, Changelog |
| 8. Operate | Tech Lead + Backend Eng | Runbook, Monitoring, Post-Release Review |

## How to Use

1. **Run this prompt** with the required inputs (set `projectPath` for Nx projects)
2. **Follow handoff buttons** to create each artefact in sequence
3. **Review quality gates** between stages before proceeding
4. **Artefacts are saved** to `{projectPath}/sdlc/{stage}/` directories

## Stage Quality Gates

Each stage has a quality gate that must be satisfied before proceeding:

### Discovery ✓
- Stakeholders aligned on vision
- Measurable outcomes defined
- Roadmap reviewed and accepted

### Definition ✓
- Scope, non-goals, constraints approved
- User problem and success metrics defined
- Test strategy approach approved

### Planning ✓
- Epics sized and ordered with dependencies
- User stories estimable with acceptance criteria
- RTM maps requirements to tests

### Design ✓
- Technical design peer-reviewed
- Architecture diagrams current
- API/Integration contracts validated

### Build ✓
- Technical spec actionable
- Migrations safe with rollback
- Tests cover critical logic
- PR approved with CI green

### Test ✓
- Test cases mapped to acceptance criteria
- Test execution results summarized
- Open defects and risks documented

### Release ✓
- Release scope locked
- QA sign-off obtained
- Release notes accurate

### Operate ✓
- Runbook validated
- Monitoring alerts configured
- Post-release learnings captured

## Output Structure

```
{projectPath}/
└── sdlc/
    ├── 1-discovery/
    │   ├── product-vision.md
    │   └── product-roadmap.md
    ├── 2-definition/
    │   ├── prd.md
    │   ├── acceptance-criteria.md
    │   └── test-strategy.md
    ├── 3-planning/
    │   ├── epics.md
    │   ├── user-stories.md
    │   └── rtm.md
    ├── 4-design/
    │   ├── technical-design-doc.md
    │   ├── architecture-diagrams.md
    │   ├── adrs/
    │   ├── api-contract.md
    │   ├── integration-contract.md
    │   ├── data-model.md
    │   └── monitoring-spec.md
    ├── 5-build/
    │   ├── technical-spec.md
    │   ├── db-migration.md
    │   ├── unit-tests.md
    │   ├── integration-tests.md
    │   ├── pull-request.md
    │   └── code-review-checklist.md
    ├── 6-test/
    │   ├── test-plan.md
    │   ├── test-cases.md
    │   ├── rtm-updated.md
    │   ├── test-execution-report.md
    │   └── bug-reports.md
    ├── 7-release/
    │   ├── release-plan.md
    │   ├── qa-signoff.md
    │   ├── release-notes.md
    │   └── changelog-entry.md
    └── 8-operate/
        ├── runbook.md
        ├── monitoring-alerts.md
        └── post-release-review.md
```

## Begin Pipeline

Starting with **Discovery Stage**...

Create the output directory structure first, then begin with the Product Vision document.

Use the handoff buttons below to navigate through each artefact creation in sequence.
