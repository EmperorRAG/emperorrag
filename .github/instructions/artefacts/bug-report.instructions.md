---
description: 'Template and guidelines for Bug Report'
applyTo: '**/bug-report/**/*.md, **/bug-reports/**/*.md, **/*-bug-report.md'
---

# Bug Report

A bug report documents a defect with clear reproduction steps, expected vs actual behavior, and severity classification.

## When to Use

- Documenting defects found during testing
- Reporting production issues
- Tracking regressions
- Creating actionable tickets for developers

## Template

```markdown
# Bug Report: [Brief Bug Title]

## Bug ID: BUG-[NUMBER]

## Summary
[One-sentence description of the bug]

---

## Classification

| Attribute | Value |
|-----------|-------|
| **Severity** | Critical / High / Medium / Low |
| **Priority** | P0 / P1 / P2 / P3 |
| **Type** | Functional / UI / Performance / Security / Data |
| **Status** | New / Confirmed / In Progress / Fixed / Verified / Closed |
| **Component** | [Component/Module name] |
| **Found In** | [Version/Build/Environment] |
| **Assigned To** | [Developer name] |

---

## Environment

| Attribute | Value |
|-----------|-------|
| **Environment** | Development / Staging / Production |
| **OS** | [Windows 11 / macOS 14 / Ubuntu 22.04] |
| **Browser** | [Chrome 120 / Firefox 121 / Safari 17] |
| **Device** | [Desktop / Mobile / Tablet] |
| **User Role** | [Admin / User / Guest] |

---

## Description

### Expected Behavior
[What should happen according to requirements/design]

### Actual Behavior
[What actually happens - be specific]

### Impact
[How this bug affects users/system/business]

---

## Steps to Reproduce

### Preconditions
- [User is logged in as [role]]
- [Specific data exists]
- [Feature flag enabled]

### Steps
1. Navigate to [URL/page]
2. [Specific action]
3. [Another action]
4. [Action that triggers the bug]

### Result
[Description of the bug manifestation]

---

## Evidence

### Screenshots
[Attach screenshots showing the issue]

### Error Messages
```
[Console error or error message displayed]
```

### Logs
```
[Relevant log entries]
```

### Video Recording
[Link to screen recording if applicable]

---

## Root Cause Analysis (if known)

[Description of what is causing the bug - to be filled by developer]

---

## Workaround

[Temporary workaround if available]

---

## Related Items

- **Related Story**: [Story ID]
- **Related Test Case**: [TC-XXX]
- **Related Bug**: [BUG-XXX]
- **Related PR**: [PR link]

---

## Fix Verification

### Verification Steps
1. [Step to verify fix]
2. [Additional verification]
3. Confirm expected behavior

### Verified By
- **Name**: [QA name]
- **Date**: [Date]
- **Environment**: [Where verified]

---

## History

| Date | Action | By |
|------|--------|----|
| [Date] | Created | [Name] |
| [Date] | Assigned | [Name] |
| [Date] | Fixed | [Name] |
| [Date] | Verified | [Name] |
```

## Severity Definitions

| Severity | Definition | Response Time |
|----------|------------|---------------|
| Critical | System unusable, data loss, security breach | Immediate |
| High | Major feature broken, no workaround | Within 24 hours |
| Medium | Feature impaired, workaround available | Within 1 week |
| Low | Minor issue, cosmetic | As scheduled |

## Quality Criteria

- [ ] Clear, descriptive title
- [ ] Reproducible steps provided
- [ ] Expected vs actual behavior stated
- [ ] Severity and priority assigned
- [ ] Environment details included
- [ ] Evidence attached (screenshots/logs)
