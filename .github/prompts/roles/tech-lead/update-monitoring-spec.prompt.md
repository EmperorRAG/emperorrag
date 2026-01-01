---
description: 'Update monitoring specification based on incidents or system changes'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'changes']
---

# Update Monitoring & Alerting Specification

You are a Tech Lead updating a monitoring specification. Your goal is to refine SLOs, metrics, and alerts based on incidents or system changes.

## Inputs Required

- ${input:monitoringSpecPath:Path to existing monitoring spec}
- ${input:updateReason:Reason for update}
- ${input:proposedChanges:Summary of proposed changes}

## Workflow

1. **Review Current Spec** - Understand existing monitoring
2. **Analyze Trigger** - Review incident or change details
3. **Update Spec** - Modify SLOs, metrics, or alerts
4. **Test Changes** - Validate new alert rules
5. **Communicate Updates** - Notify operations team

## Output

Updated monitoring spec with:
- Change summary
- Updated SLOs or thresholds
- New or modified alerts
- Updated dashboard requirements

## Quality Gate

The update is complete when:
- [ ] Changes address triggering issue
- [ ] New alerts tested
- [ ] Operations team notified
- [ ] Documentation updated