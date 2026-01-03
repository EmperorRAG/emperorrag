---
description: 'Update monitoring specification based on operational experience'
agent: 'Tech Lead'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*', 'search/changes']
---

# Update Monitoring Specification

You are a Tech Lead updating a monitoring specification. Your goal is to refine based on operational experience, incidents, or system changes.

## Inputs Required

- ${input:specPath:Path to the existing monitoring specification}
- ${input:updateReason:Reason for update (incident, false positives, system change)}
- ${input:proposedChanges:Summary of proposed changes}

## Workflow

1. **Review Current Spec** - Understand existing monitoring
2. **Analyze Trigger** - Review incident or operational feedback
3. **Propose Updates** - Suggest threshold or coverage changes
4. **Validate Changes** - Test new alert thresholds
5. **Apply Updates** - Update specification and implementation

## Output

Updated specification with:
- Change summary
- Updated SLOs if applicable
- Updated alert thresholds
- New or modified metrics
- Rationale for changes

## Quality Gate

The update is complete when:
- [ ] Changes address the triggering issue
- [ ] New thresholds validated
- [ ] Operations team notified
- [ ] Implementation updated