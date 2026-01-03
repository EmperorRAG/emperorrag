---
description: 'Release Stage - Create release plan, QA sign-off, release notes, and changelog'
agent: 'Release Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'search/changes',
    'web/fetch',
    'edit/editFiles',
    'execute/runInTerminal',
    'github/*',
    'nx-mcp-server/*',
    'context7/*',
  ]
---

# Release Stage

Prepare software for production deployment with quality sign-off, clear communication, and documented release artifacts.

## Prerequisites

The following Test artefacts must exist:
- Test Execution Report: `{projectPath}/sdlc/6-test/test-execution-report.md`
- Bug Reports: `{projectPath}/sdlc/6-test/bug-reports.md`

And these earlier artefacts:
- User Stories: `{projectPath}/sdlc/3-planning/user-stories.md`
- PRD: `{projectPath}/sdlc/2-definition/prd.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:releaseVersion:Release version number}
- ${input:releaseDate:Target release date}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Release Plan | Product Manager | [product-manager-release-plan-create](../roles/product-manager/release-plan/product-manager-release-plan-create.prompt.md) |
| 2 | QA Sign-off | QA Tester | [quality-assurance-tester-qa-signoff-create](../roles/quality-assurance-tester/qa-signoff/quality-assurance-tester-qa-signoff-create.prompt.md) |
| 3 | Release Notes | Product Manager | [product-manager-release-notes-create](../roles/product-manager/release-notes/product-manager-release-notes-create.prompt.md) |
| 4 | Changelog Entry | Backend Developer | [backend-software-developer-changelog-entry-create](../roles/backend-software-developer/changelog-entry/backend-software-developer-changelog-entry-create.prompt.md) |

## Workflow

### 1. Create Release Plan

Define release execution:
- Release scope and features
- Schedule and milestones
- Quality gates and criteria
- Rollout strategy
- Risk mitigation
- Communication plan

**Output**: `{projectPath}/sdlc/7-release/release-plan.md`

### 2. Create QA Sign-off

Document release readiness:
- Exit criteria status
- Open defects and risks
- Test coverage summary
- Sign-off decision
- Risk acceptance (if any)

**Output**: `{projectPath}/sdlc/7-release/qa-signoff.md`

### 3. Create Release Notes

Communicate changes:
- Release highlights
- New features
- Improvements
- Bug fixes
- Breaking changes
- Known issues

**Output**: `{projectPath}/sdlc/7-release/release-notes.md`

### 4. Create Changelog Entry

Update project changelog:
- Version and date
- Added features
- Changed behavior
- Deprecated items
- Removed items
- Fixed issues
- Security updates

**Output**: `{projectPath}/sdlc/7-release/changelog-entry.md`

## Quality Gate

Release is complete when:
- [ ] Release scope locked with risk and mitigations documented
- [ ] Rollout and communication plan defined
- [ ] QA exit criteria met or risks explicitly accepted by decision owners
- [ ] Release notes accurate, reviewed, and match shipped scope
- [ ] Changelog entry complete and ready to commit

## Output Directory

```
{projectPath}/sdlc/7-release/
├── release-plan.md
├── qa-signoff.md
├── release-notes.md
└── changelog-entry.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Operate Stage](./8-operate.prompt.md) for operational readiness.

---

Use the handoff buttons to create each artefact in sequence.
