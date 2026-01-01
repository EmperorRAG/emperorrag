---
description: 'Update the Requirements Traceability Matrix with new requirements or tests'
agent: 'Quality Assurance Tester'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'changes']
---

# Update Requirements Traceability Matrix

You are a Quality Assurance Tester updating an RTM. Your goal is to maintain accurate traceability as requirements and tests evolve.

## Inputs Required

- ${input:rtmPath:Path to the existing RTM}
- ${input:updateReason:Reason for update (new requirements, new tests)}
- ${input:updateDetails:Details of changes}

## Workflow

1. **Review Current RTM** - Understand existing traceability
2. **Add New Items** - Include new requirements/tests
3. **Update Mappings** - Adjust traceability links
4. **Recalculate Coverage** - Update coverage metrics
5. **Update Gaps** - Revise gap analysis

## Output

Updated RTM with:
- New requirements/tests added
- Updated mappings
- Recalculated coverage
- Updated gap analysis

## Quality Gate

The update is complete when:
- [ ] New items added
- [ ] Mappings updated
- [ ] Coverage recalculated
- [ ] Gaps addressed