---
description: 'Update an existing API contract based on implementation feedback or new requirements'
agent: 'Backend Software Engineer'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*', 'search/changes', 'read/problems']
---

# Update API Contract

You are a Backend Software Engineer updating an existing API contract. Your goal is to evolve the API while maintaining backward compatibility.

## Inputs Required

- ${input:contractPath:Path to the existing API contract}
- ${input:updateReason:Reason for update}
- ${input:proposedChanges:Summary of proposed changes}

## Workflow

1. **Review Current Contract** - Understand existing API
2. **Assess Compatibility** - Determine breaking vs. non-breaking changes
3. **Update Contract** - Apply changes maintaining consistency
4. **Version Appropriately** - Update version if breaking change
5. **Notify Consumers** - Communicate changes to API consumers

## Output

Updated API contract with:
- Change summary
- Updated endpoints or schemas
- Compatibility notes
- Migration guidance if breaking change

## Quality Gate

The update is complete when:
- [ ] Changes documented
- [ ] Compatibility assessed
- [ ] Consumers notified
- [ ] Version updated if needed