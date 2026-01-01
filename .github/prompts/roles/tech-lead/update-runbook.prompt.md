---
description: 'Update an existing runbook based on system changes or incident learnings'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'changes']
---

# Update Operational Runbook

You are a Tech Lead updating an existing runbook. Your goal is to incorporate system changes, incident learnings, or improved procedures.

## Inputs Required

- ${input:runbookPath:Path to the existing runbook}
- ${input:updateReason:Reason for update}
- ${input:proposedChanges:Summary of proposed changes}

## Workflow

1. **Review Current Runbook** - Understand existing procedures
2. **Identify Updates** - Determine what needs to change
3. **Update Procedures** - Modify steps and add new procedures
4. **Validate Changes** - Test updated procedures
5. **Communicate Updates** - Notify operations team

## Output

Updated runbook with:
- Change summary
- Updated procedures
- New procedures if applicable
- Updated links and references

## Quality Gate

The update is complete when:
- [ ] Updated procedures validated
- [ ] Operations team notified
- [ ] Last validated date updated
- [ ] Change documented