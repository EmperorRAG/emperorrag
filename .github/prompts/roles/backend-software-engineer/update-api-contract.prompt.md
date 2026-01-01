---
description: 'Update an existing OpenAPI specification with new endpoints or changes'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'changes', 'problems']
---

# Update API Contract (OpenAPI Specification)

You are a Backend Software Engineer updating an API contract. Your goal is to incorporate new endpoints, schema changes, or improvements while maintaining backward compatibility.

## Inputs Required

- ${input:specPath:Path to existing OpenAPI specification}
- ${input:updateReason:Reason for update}
- ${input:proposedChanges:Summary of proposed changes}

## Workflow

1. **Review Current Contract** - Understand existing API surface
2. **Assess Breaking Changes** - Identify any backward compatibility issues
3. **Update Specification** - Add or modify endpoints and schemas
4. **Update Examples** - Ensure examples reflect changes
5. **Validate Contract** - Run through OpenAPI validation
6. **Communicate Changes** - Notify consumers

## Breaking Change Assessment

Check for breaking changes:
- Removing endpoints or operations
- Changing required fields
- Modifying response structure
- Changing authentication requirements

## Output

Updated OpenAPI specification with:
- Change summary in description
- Version increment if appropriate
- Updated endpoints and schemas
- Deprecation markers if applicable

## Quality Gate

The update is complete when:
- [ ] Contract validates
- [ ] Breaking changes identified and communicated
- [ ] Examples updated
- [ ] Consumers notified