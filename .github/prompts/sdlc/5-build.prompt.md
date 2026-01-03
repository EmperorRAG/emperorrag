---
description: 'Build Stage - Create technical specs, migrations, tests, and implementation'
agent: 'Build Orchestrator'
tools:
  [
    'search',
    'fetch',
    'githubRepo',
    'codebase',
    'usages',
    'editFiles',
    'createFile',
    'runTerminal',
    'runTests',
    'problems',
  ]
---

# Build Stage

Transform technical designs into working code, including database migrations, implementation, tests, and code review processes.

## Prerequisites

The following Design artefacts must exist:
- Technical Design Doc: `{projectPath}/sdlc/4-design/technical-design-doc.md`
- API Contract: `{projectPath}/sdlc/4-design/api-contract.md`
- Data Model: `{projectPath}/sdlc/4-design/data-model.md`
- Integration Contract: `{projectPath}/sdlc/4-design/integration-contract.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:implementationScope:Specific scope for this build iteration}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Technical Spec | Tech Lead | [tech-lead-technical-spec-create](../roles/tech-lead/technical-spec/tech-lead-technical-spec-create.prompt.md) |
| 2 | DB Migration | Backend Developer | [backend-software-developer-db-migration-create](../roles/backend-software-developer/db-migration/backend-software-developer-db-migration-create.prompt.md) |
| 3 | Unit Tests | Backend Developer | [backend-software-developer-unit-tests-create](../roles/backend-software-developer/unit-tests/backend-software-developer-unit-tests-create.prompt.md) |
| 4 | Integration Tests | Backend Developer | [backend-software-developer-integration-tests-create](../roles/backend-software-developer/integration-tests/backend-software-developer-integration-tests-create.prompt.md) |
| 5 | Pull Request | Backend Developer | [backend-software-developer-pull-request-create](../roles/backend-software-developer/pull-request/backend-software-developer-pull-request-create.prompt.md) |
| 6 | Code Review Checklist | Tech Lead | [tech-lead-code-review-checklist-create](../roles/tech-lead/code-review-checklist/tech-lead-code-review-checklist-create.prompt.md) |

## Workflow

### 1. Create Technical Spec

Create module-level specifications:
- Detailed implementation approach
- Interface definitions
- Dependencies and constraints
- Error handling patterns
- Configuration requirements

**Output**: `{projectPath}/sdlc/5-build/technical-spec.md`

### 2. Create DB Migration

Plan and document database changes:
- Migration scripts
- Rollback procedures
- Data migration strategy
- Staging verification plan

**Output**: `{projectPath}/sdlc/5-build/db-migration.md`

### 3. Create Unit Tests

Document unit testing approach:
- Test coverage targets
- Critical paths to test
- Mocking strategy
- Test data requirements

**Output**: `{projectPath}/sdlc/5-build/unit-tests.md`

### 4. Create Integration Tests

Document integration testing:
- API endpoint tests
- Contract validation tests
- External service mocks
- Test environment setup

**Output**: `{projectPath}/sdlc/5-build/integration-tests.md`

### 5. Create Pull Request

Prepare PR documentation:
- Change description
- Testing performed
- Screenshots/demos
- Deployment notes
- Rollback plan

**Output**: `{projectPath}/sdlc/5-build/pull-request.md`

### 6. Create Code Review Checklist

Establish review criteria:
- Correctness checks
- Performance considerations
- Security review points
- Documentation requirements
- Testing validation

**Output**: `{projectPath}/sdlc/5-build/code-review-checklist.md`

## Quality Gate

Build is complete when:
- [ ] Technical spec is actionable with explicit interfaces
- [ ] Migrations are idempotent, safe, with rollback plan
- [ ] Unit tests cover critical logic with target coverage
- [ ] Integration tests cover service boundaries and contracts
- [ ] PR has review approvals and CI is green
- [ ] Code review checklist adopted and followed

## Output Directory

```
{projectPath}/sdlc/5-build/
├── technical-spec.md
├── db-migration.md
├── unit-tests.md
├── integration-tests.md
├── pull-request.md
└── code-review-checklist.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Test Stage](./6-test.prompt.md) for comprehensive QA validation.

---

Use the handoff buttons to create each artefact in sequence.
