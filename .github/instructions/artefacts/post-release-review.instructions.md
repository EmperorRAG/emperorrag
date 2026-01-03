---
description: 'Template and guidelines for Post-Release Review'
applyTo: '**/post-release-review/**/*.md, **/*-post-release-review.md'
---

# Post-Release Review

A post-release review captures learnings from a release cycle to improve future releases, documenting what went well, what could be improved, and action items.

## When to Use

- After every production release
- Following incidents or issues
- At the end of release cycles
- When retrospective insights are needed

## Template

```markdown
# Post-Release Review: [Release Name/Version]

## Overview

- **Release Name/Version**: [Name]
- **Release Date**: [Date]
- **Release Plan Reference**: [Link]
- **Review Date**: [Date]
- **Facilitator**: [Name]
- **Participants**: [Names]

---

## Release Summary

### Scope

| Category | Planned | Delivered | Notes |
|----------|---------|-----------|-------|
| Features | [Count] | [Count] | |
| Bug Fixes | [Count] | [Count] | |
| Technical Debt | [Count] | [Count] | |

### Scope Changes

| Item | Change Type | Reason |
|------|-------------|--------|
| [Item] | Added/Removed/Changed | [Reason] |

### Timeline Comparison

| Milestone | Planned Date | Actual Date | Variance |
|-----------|-------------|-------------|----------|
| Code Complete | [Date] | [Date] | [+/- days] |
| QA Complete | [Date] | [Date] | [+/- days] |
| Release | [Date] | [Date] | [+/- days] |

---

## Metrics

### Deployment Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Deployment success rate | 100% | [%] | ✅/❌ |
| Rollback count | 0 | [Count] | ✅/❌ |
| Time to deploy | [Time] | [Time] | ✅/❌ |
| Deployment duration | [Time] | [Time] | ✅/❌ |

### Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Post-release defects (P1/P2) | 0 | [Count] | ✅/❌ |
| Customer-reported issues | 0 | [Count] | ✅/❌ |
| Test pass rate | 100% | [%] | ✅/❌ |
| Code coverage | [%] | [%] | ✅/❌ |

### Business Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| [Business KPI 1] | [Value] | [Value] | [+/-] |
| [Business KPI 2] | [Value] | [Value] | [+/-] |

---

## What Went Well ✅

### Process
- [Positive outcome about process]
- [Another positive]

### Technical
- [Technical win]
- [Another technical win]

### Collaboration
- [Collaboration success]
- [Another collaboration success]

---

## What Could Be Improved 🔄

### Process
- [Improvement area]
  - **Impact**: [How it affected the release]
  - **Suggestion**: [How to improve]

### Technical
- [Technical improvement area]
  - **Impact**: [How it affected the release]
  - **Suggestion**: [How to improve]

### Communication
- [Communication gap]
  - **Impact**: [How it affected the release]
  - **Suggestion**: [How to improve]

---

## Incidents

### [Incident Title]

| Aspect | Details |
|--------|---------|
| **Date/Time** | [When it occurred] |
| **Duration** | [How long] |
| **Impact** | [What was affected] |
| **Root Cause** | [Why it happened] |
| **Resolution** | [How it was fixed] |
| **Prevention** | [How to prevent in future] |

---

## Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| [Action 1] | [Name] | High | [Date] | ⬜ Not Started |
| [Action 2] | [Name] | Medium | [Date] | ⬜ Not Started |
| [Action 3] | [Name] | Low | [Date] | ⬜ Not Started |

---

## Recommendations for Future Releases

### Process Improvements
1. [Recommendation 1]
2. [Recommendation 2]

### Technical Improvements
1. [Recommendation 1]
2. [Recommendation 2]

### Tooling Improvements
1. [Recommendation 1]
2. [Recommendation 2]

---

## Kudos 🎉

- [Person/Team] for [contribution]
- [Person/Team] for [contribution]

---

## Related Documentation

- [Release Plan](link)
- [Release Notes](link)
- [Incident Reports](link)
```

## Quality Criteria

- [ ] Team retrospective conducted
- [ ] All metrics captured and compared to targets
- [ ] Both positives and improvements documented
- [ ] Action items assigned with owners and dates
- [ ] Incidents documented with root cause
- [ ] Report filed for future reference
- [ ] Follow-up scheduled for action items
