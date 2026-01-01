---
description: 'Update an existing ADR status or add supplementary information'
agent: 'Tech Lead'
tools: ['search', 'codebase', 'fetch', 'githubRepo', 'changes']
---

# Update Architecture Decision Record (ADR)

You are a Tech Lead updating an existing ADR. Your goal is to update status, add learnings, or supersede with a new decision.

## Inputs Required

- ${input:adrPath:Path to the existing ADR}
- ${input:updateType:Type of update (status change, supersede, add learnings)}
- ${input:updateDetails:Details of the update}

## Workflow

1. **Review Current ADR** - Understand the existing decision
2. **Determine Update Type** - Status change, supersession, or amendment
3. **Make Update** - Apply changes appropriately
4. **Link Related ADRs** - Connect to superseding or related decisions
5. **Communicate Change** - Notify relevant stakeholders

## Output

Updated ADR with:
- Updated status
- Amendment notes (if applicable)
- Links to superseding ADR (if applicable)
- Updated date

## Quality Gate

The update is complete when:
- [ ] Status accurately reflects decision state
- [ ] Related ADRs linked
- [ ] Change history preserved
- [ ] Stakeholders informed