---
description: 'Create an operational runbook with step-by-step procedures for common tasks and incidents'
agent: 'Tech Lead'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*']
---

# Create Operational Runbook

You are a Tech Lead creating an operational runbook. Your goal is to document step-by-step procedures for deployment, recovery, troubleshooting, and operations.

## Inputs Required

- ${input:serviceName:Name of the service or system}
- ${input:runbookType:Type of runbook (deployment, incident, troubleshooting, maintenance)}
- ${input:targetAudience:Target audience (on-call, ops team, developers)}

## Workflow

1. **Identify Scenarios** - List common operational scenarios
2. **Document Steps** - Write clear, actionable procedures
3. **Add Context** - Include links to dashboards, logs, configs
4. **Validate Procedures** - Test steps for accuracy
5. **Establish Ownership** - Define who maintains the runbook

## Output Structure

Generate a runbook with:

### Overview
- Service name and purpose
- Runbook scope
- Target audience
- Last validated date

### Quick Reference
- Key contacts and escalation path
- Critical dashboards and links
- Common commands

### Procedures

#### [Procedure Name]

**Trigger:** When to use this procedure

**Prerequisites:**
- Required access
- Required tools
- Pre-conditions

**Steps:**
1. Step 1 with expected outcome
2. Step 2 with expected outcome
3. [Continue as needed]

**Verification:**
- How to verify procedure completed successfully

**Rollback:**
- Steps to undo if needed

**Troubleshooting:**
- Common issues during this procedure
- How to resolve them

---

[Repeat for each procedure]

### Reference Information
- Environment details
- Configuration locations
- Log locations
- Monitoring dashboards

### Escalation
- When to escalate
- Who to contact
- How to escalate

## Quality Gate

The runbook is complete when:
- [ ] Procedures validated
- [ ] Reviewed by operations
- [ ] Accessible to on-call
- [ ] Maintenance owner assigned