---
description: 'Operate Stage - Create runbook, monitoring configuration, and post-release review'
agent: 'Operate Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'web/fetch',
    'read/problems',
    'edit/editFiles',
    'execute/runInTerminal',
    'github/*',
    'nx-mcp-server/*',
    'context7/*',
    'cognitionai/deepwiki/*',
  ]
---

# Operate Stage

Ensure the deployed system is observable, maintainable, and capture learnings for continuous improvement.

## Prerequisites

The following Release artefacts must exist:
- Release Plan: `{projectPath}/sdlc/7-release/release-plan.md`
- Release Notes: `{projectPath}/sdlc/7-release/release-notes.md`

And these Design artefacts:
- Technical Design Doc: `{projectPath}/sdlc/4-design/technical-design-doc.md`
- Monitoring Spec: `{projectPath}/sdlc/4-design/monitoring-spec.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:operationalContext:Operational context and deployment status}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Runbook | Tech Lead | [tech-lead-runbook-create](../roles/tech-lead/runbook/tech-lead-runbook-create.prompt.md) |
| 2 | Monitoring Alerts | Backend Engineer | [backend-software-engineer-monitoring-spec-update](../roles/backend-software-engineer/monitoring-spec/backend-software-engineer-monitoring-spec-update.prompt.md) |
| 3 | Post-Release Review | Tech Lead | [tech-lead-post-release-review-create](../roles/tech-lead/post-release-review/tech-lead-post-release-review-create.prompt.md) |

## Workflow

### 1. Create Runbook

Document operational procedures:
- Service overview and architecture
- Health checks and verification
- Common operations (restart, scale, logs)
- Troubleshooting guides
- Alert-specific runbooks
- Escalation paths
- Disaster recovery

**Output**: `{projectPath}/sdlc/8-operate/runbook.md`

### 2. Configure Monitoring Alerts

Set up observability:
- Metrics and thresholds
- Alert rules and routing
- Dashboard configuration
- Log aggregation
- Ownership assignment

**Output**: `{projectPath}/sdlc/8-operate/monitoring-alerts.md`

### 3. Create Post-Release Review

Capture learnings:
- Release summary and metrics
- What went well
- What could be improved
- Incidents and root causes
- Action items with owners
- Recommendations

**Output**: `{projectPath}/sdlc/8-operate/post-release-review.md`

## Quality Gate

Operate is complete when:
- [ ] Runbook steps validated and on-call can follow them
- [ ] Links to dashboards and logs included
- [ ] Monitoring metrics and thresholds defined with ownership
- [ ] Alerts tested and working
- [ ] Post-release review captures root causes and actions
- [ ] Follow-ups owned and scheduled

## Output Directory

```
{projectPath}/sdlc/8-operate/
├── runbook.md
├── monitoring-alerts.md
└── post-release-review.md
```

## SDLC Complete 🎉

This is the final stage of the SDLC pipeline. Upon completion:

1. **Full artefact set created** across all 8 stages
2. **Traceability established** from vision through operation
3. **Quality gates satisfied** at each stage
4. **System in production** with proper operational support

### Complete Artefact Summary

| Stage | Artefacts Created |
|-------|-------------------|
| Discovery | Product Vision, Product Roadmap |
| Definition | PRD, Acceptance Criteria, Test Strategy |
| Planning | Epics, User Stories, RTM |
| Design | TDD, Architecture, ADRs, API/Integration Contracts, Data Model, Monitoring Spec |
| Build | Tech Spec, DB Migration, Unit/Integration Tests, PR, Code Review |
| Test | Test Plan, Test Cases, RTM Update, Execution Report, Bug Reports |
| Release | Release Plan, QA Sign-off, Release Notes, Changelog |
| Operate | Runbook, Monitoring Alerts, Post-Release Review |

---

Use the handoff buttons to create each artefact in sequence.
