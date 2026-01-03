---
description: 'Design Stage - Create technical design, architecture, contracts, and specifications'
agent: 'Design Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'search/usages',
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

# Design Stage

Create the technical blueprint for implementation, defining system architecture, component design, API contracts, and operational specifications.

## Prerequisites

The following Planning artefacts must exist:
- PRD: `{projectPath}/sdlc/2-definition/prd.md`
- User Stories: `{projectPath}/sdlc/3-planning/user-stories.md`
- Epics: `{projectPath}/sdlc/3-planning/epics.md`

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:technicalContext:Existing technical context and constraints}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Technical Design Doc | Tech Lead | [tech-lead-technical-design-doc-create](../roles/tech-lead/technical-design-doc/tech-lead-technical-design-doc-create.prompt.md) |
| 2 | Architecture Diagrams | Tech Lead | [tech-lead-architecture-diagrams-create](../roles/tech-lead/architecture-diagrams/tech-lead-architecture-diagrams-create.prompt.md) |
| 3 | ADRs | Tech Lead | [tech-lead-adr-create](../roles/tech-lead/adr/tech-lead-adr-create.prompt.md) |
| 4 | API Contract | Backend Engineer | [backend-software-engineer-api-contract-create](../roles/backend-software-engineer/api-contract/backend-software-engineer-api-contract-create.prompt.md) |
| 5 | Integration Contract | Backend Engineer | [backend-software-engineer-integration-contract-create](../roles/backend-software-engineer/integration-contract/backend-software-engineer-integration-contract-create.prompt.md) |
| 6 | Data Model | Backend Engineer | [backend-software-engineer-data-model-create](../roles/backend-software-engineer/data-model/backend-software-engineer-data-model-create.prompt.md) |
| 7 | Monitoring Spec | Backend Engineer | [backend-software-engineer-monitoring-spec-create](../roles/backend-software-engineer/monitoring-spec/backend-software-engineer-monitoring-spec-create.prompt.md) |

## Workflow

### 1. Create Technical Design Document

Create a comprehensive TDD that defines:
- System context and goals
- High-level architecture
- Component design and interactions
- Data flow and state management
- Technical decisions and trade-offs
- Security and performance considerations
- Rollout and testing approach

**Output**: `{projectPath}/sdlc/4-design/technical-design-doc.md`

### 2. Create Architecture Diagrams

Create C4 model diagrams:
- Context Diagram (Level 1)
- Container Diagram (Level 2)
- Component Diagram (Level 3)
- Legend and design notes

**Output**: `{projectPath}/sdlc/4-design/architecture-diagrams.md`

### 3. Create ADRs

Document key architectural decisions:
- Decision title and context
- Options considered
- Decision and rationale
- Consequences and trade-offs

**Output**: `{projectPath}/sdlc/4-design/adrs/`

### 4. Create API Contract

Define the API specification:
- OpenAPI/Swagger format
- Endpoint specifications
- Request/response schemas
- Error handling
- Examples and validation

**Output**: `{projectPath}/sdlc/4-design/api-contract.md`

### 5. Create Integration Contract

Document external service integrations:
- Service dependencies
- Authentication methods
- Data mappings
- Error handling and retries
- Testing approach

**Output**: `{projectPath}/sdlc/4-design/integration-contract.md`

### 6. Create Data Model

Design the database schema:
- Entity relationship diagram
- Table/collection definitions
- Constraints and indexes
- Migration strategy

**Output**: `{projectPath}/sdlc/4-design/data-model.md`

### 7. Create Monitoring Spec

Define observability requirements:
- SLIs and SLOs
- Metrics and dashboards
- Alerting rules
- Logging standards

**Output**: `{projectPath}/sdlc/4-design/monitoring-spec.md`

## Quality Gate

Design is complete when:
- [ ] Technical design peer-reviewed and addresses NFRs
- [ ] Architecture diagrams current and consistent with design
- [ ] Key decisions recorded in ADRs with rationale
- [ ] API contract validates with examples included
- [ ] Integration contracts identify consumer impacts
- [ ] Data model reviewed for integrity and performance
- [ ] Monitoring SLOs and alerts defined with ownership

## Output Directory

```
{projectPath}/sdlc/4-design/
├── technical-design-doc.md
├── architecture-diagrams.md
├── adrs/
│   └── adr-001-*.md
├── api-contract.md
├── integration-contract.md
├── data-model.md
└── monitoring-spec.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Build Stage](./5-build.prompt.md) to implement the design.

---

Use the handoff buttons to create each artefact in sequence.
