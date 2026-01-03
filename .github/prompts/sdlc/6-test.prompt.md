---
description: 'Test Stage - Create test plans, test cases, execution reports, and defect tracking'
agent: 'Test Orchestrator'
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
    'findTestFiles',
    'problems',
  ]
---

# Test Stage

Validate that implementation meets requirements through systematic test planning, execution, and defect management.

## Prerequisites

The following Build artefacts must exist:
- Technical Spec: `{projectPath}/sdlc/5-build/technical-spec.md`
- Unit Tests: `{projectPath}/sdlc/5-build/unit-tests.md`
- Integration Tests: `{projectPath}/sdlc/5-build/integration-tests.md`

And these earlier artefacts:
- User Stories: `{projectPath}/sdlc/3-planning/user-stories.md`
- RTM: `{projectPath}/sdlc/3-planning/rtm.md`
- Test Strategy: `{projectPath}/sdlc/2-definition/test-strategy.md`
- Acceptance Criteria: `{projectPath}/sdlc/2-definition/acceptance-criteria.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:testCycleContext:Test cycle name and objectives}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Test Plan | QA Tester | [quality-assurance-tester-test-plan-create](../roles/quality-assurance-tester/test-plan/quality-assurance-tester-test-plan-create.prompt.md) |
| 2 | Test Cases | QA Tester | [quality-assurance-tester-test-cases-create](../roles/quality-assurance-tester/test-cases/quality-assurance-tester-test-cases-create.prompt.md) |
| 3 | RTM (Updated) | QA Tester | [quality-assurance-tester-rtm-update](../roles/quality-assurance-tester/rtm/quality-assurance-tester-rtm-update.prompt.md) |
| 4 | Test Execution Report | QA Tester | [quality-assurance-tester-test-execution-report-create](../roles/quality-assurance-tester/test-execution-report/quality-assurance-tester-test-execution-report-create.prompt.md) |
| 5 | Bug Reports | QA Tester | [quality-assurance-tester-bug-report-create](../roles/quality-assurance-tester/bug-report/quality-assurance-tester-bug-report-create.prompt.md) |

## Workflow

### 1. Create Test Plan

Define the testing approach:
- Test objectives and scope
- Test types and coverage
- Entry/exit criteria
- Environment requirements
- Schedule and resources

**Output**: `{projectPath}/sdlc/6-test/test-plan.md`

### 2. Create Test Cases

Detail reproducible test cases:
- Test case ID and title
- Preconditions and test data
- Step-by-step procedures
- Expected results
- Priority and category

**Output**: `{projectPath}/sdlc/6-test/test-cases.md`

### 3. Update RTM

Update traceability matrix:
- Map test cases to requirements
- Track coverage status
- Identify gaps
- Document risk acceptance

**Output**: `{projectPath}/sdlc/6-test/rtm-updated.md`

### 4. Create Test Execution Report

Summarize test results:
- Execution summary by type/feature
- Pass/fail rates and trends
- Defect summary by severity
- Coverage analysis
- Quality assessment and recommendation

**Output**: `{projectPath}/sdlc/6-test/test-execution-report.md`

### 5. Create Bug Reports

Document defects found:
- Bug ID and title
- Reproduction steps
- Expected vs actual behavior
- Severity and priority
- Screenshots/logs

**Output**: `{projectPath}/sdlc/6-test/bug-reports.md`

## Quality Gate

Test is complete when:
- [ ] Test cases mapped to acceptance criteria with reproducible steps
- [ ] Entry/exit criteria defined and met
- [ ] Test execution results summarized with pass/fail rates
- [ ] Open defects and risks clearly documented with severity/priority
- [ ] RTM shows complete requirement coverage (gaps resolved or risk accepted)

## Output Directory

```
{projectPath}/sdlc/6-test/
├── test-plan.md
├── test-cases.md
├── rtm-updated.md
├── test-execution-report.md
└── bug-reports.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Release Stage](./7-release.prompt.md) for release planning and sign-off.

---

Use the handoff buttons to create each artefact in sequence.
