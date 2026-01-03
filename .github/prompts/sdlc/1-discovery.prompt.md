---
description: 'Discovery Stage - Create product vision and roadmap to establish strategic foundation'
agent: 'Discovery Orchestrator'
tools:
  [
    'search/textSearch',
    'search/codebase',
    'web/fetch',
    'edit/editFiles',
    'execute/runInTerminal',
    'github/*',
    'context7/*',
    'cognitionai/deepwiki/*',
  ]
---

# Discovery Stage

Establish the strategic foundation for the project by creating the product vision and roadmap.

## Inputs Required

- ${input:projectPath:Target project directory for documentation (default: docs)}
- ${input:projectName:Name of the project or initiative}
- ${input:businessContext:Business context, strategic goals, and market opportunity}
- ${input:targetUsers:Primary target users or personas}
- ${input:problemStatement:The core problem being solved}

> **Note**: The `projectPath` specifies where SDLC artefacts will be saved. For Nx monorepo projects, use the project directory (e.g., `apps/my-app/docs`). If not specified, defaults to `docs` at the workspace root.

## Artefacts to Create

| Order | Artefact | Owner | Prompt Reference |
|-------|----------|-------|------------------|
| 1 | Product Vision | Product Manager | [product-manager-product-vision-create](../roles/product-manager/product-vision/product-manager-product-vision-create.prompt.md) |
| 2 | Product Roadmap | Product Manager | [product-manager-product-roadmap-create](../roles/product-manager/product-roadmap/product-manager-product-roadmap-create.prompt.md) |

## Workflow

### 1. Create Product Vision

Create a Product Vision document that defines:
- Vision statement (aspirational future state)
- Problem space and opportunity
- Target users and personas
- Strategic pillars and principles
- Success metrics and outcomes
- What we will NOT do

**Output**: `{projectPath}/sdlc/1-discovery/product-vision.md`

### 2. Create Product Roadmap

Create a Product Roadmap that translates vision into action:
- Strategic themes by time horizon (Now/Next/Later)
- Initiatives with descriptions and dependencies
- Key milestones and target dates
- Success metrics per initiative
- Risks and mitigations

**Output**: `{projectPath}/sdlc/1-discovery/product-roadmap.md`

## Quality Gate

Discovery is complete when:
- [ ] Stakeholders are aligned on the product vision
- [ ] Measurable outcomes and success metrics are defined
- [ ] Roadmap has been reviewed and accepted by stakeholders
- [ ] Dependencies and milestones are visible to all teams
- [ ] Strategic priorities are clear and ordered

## Output Directory

```
{projectPath}/sdlc/1-discovery/
├── product-vision.md
└── product-roadmap.md
```

## Next Stage

Once quality gate is satisfied, proceed to [Definition Stage](./2-definition.prompt.md) to create the PRD and detailed requirements.

---

Use the handoff buttons to create each artefact in sequence, or manually invoke the role-specific prompts referenced above.
