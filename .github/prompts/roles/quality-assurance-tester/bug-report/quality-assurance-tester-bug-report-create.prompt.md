---
description: 'Create a bug report documenting a defect found during testing'
agent: 'Quality Assurance Tester'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo', 'problems']
---

# Create Bug Report

You are a Quality Assurance Tester creating a bug report. Your goal is to document a defect with sufficient detail for developers to reproduce and fix it.

## Inputs Required

- ${input:bugTitle:Brief title describing the bug}
- ${input:featureArea:Feature area where bug was found}
- ${input:testCaseReference:Reference to related test case (if applicable)}

## Workflow

1. **Verify Bug** - Confirm the issue is reproducible
2. **Gather Evidence** - Collect screenshots, logs, etc.
3. **Document Steps** - Write clear reproduction steps
4. **Assess Impact** - Determine severity and priority
5. **Submit Report** - Create the bug report

## Output Structure

Generate a bug report with:

### Bug ID: [Auto-generated]

### Title
[Clear, concise description of the bug]

### Severity
- Critical: System crash, data loss, security issue
- High: Major feature broken, no workaround
- Medium: Feature impacted, workaround exists
- Low: Minor issue, cosmetic

### Priority
- P1: Fix immediately
- P2: Fix in current sprint
- P3: Fix in backlog
- P4: Nice to have

### Environment
- Environment: [Dev/Staging/Prod]
- Browser/Client: [If applicable]
- Version: [Application version]
- OS: [Operating system]

### Description
[Detailed description of the bug]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Result
[What should happen]

### Actual Result
[What actually happens]

### Evidence
- Screenshots: [Attached]
- Logs: [Attached]
- Video: [Link if applicable]

### Related Items
- Test Case: [Reference]
- User Story: [Reference]
- Related Bugs: [Links]

### Additional Notes
[Any other relevant information]

## Quality Gate

The bug report is complete when:
- [ ] Bug is reproducible
- [ ] Steps are clear
- [ ] Evidence attached
- [ ] Severity/priority assessed