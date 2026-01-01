---
description: 'Template and guidelines for Test Execution Report'
applyTo: '**/test-execution-report/**/*.md, **/*-test-execution-report.md'
---

# Test Execution Report

A test execution report summarizes the results of test execution, including pass/fail rates, defects found, coverage achieved, and quality assessment.

## When to Use

- Summarizing test cycle results
- Providing stakeholder visibility into quality
- Go/no-go decision support
- Release readiness assessment

## Template

```markdown
# Test Execution Report: [Release/Sprint Name]

## Overview

- **Project**: [Project Name]
- **Release/Version**: [Version]
- **Test Cycle**: [Cycle Name/Number]
- **Execution Period**: [Start Date] - [End Date]
- **Test Lead**: [Name]
- **Report Date**: [Date]

---

## Executive Summary

### Overall Status: [🟢 Pass / 🟡 Conditional Pass / 🔴 Fail]

[One paragraph summary of overall quality status and release readiness]

### Key Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Test Pass Rate | [%] | ≥95% | ✅/❌ |
| Critical Defects Open | [#] | 0 | ✅/❌ |
| High Defects Open | [#] | ≤2 | ✅/❌ |
| Code Coverage | [%] | ≥80% | ✅/❌ |
| Requirements Coverage | [%] | 100% | ✅/❌ |

---

## Test Execution Summary

### By Test Type

| Test Type | Total | Passed | Failed | Blocked | Skipped | Pass Rate |
|-----------|-------|--------|--------|---------|---------|-----------|
| Unit Tests | [#] | [#] | [#] | [#] | [#] | [%] |
| Integration Tests | [#] | [#] | [#] | [#] | [#] | [%] |
| E2E Tests | [#] | [#] | [#] | [#] | [#] | [%] |
| Regression Tests | [#] | [#] | [#] | [#] | [#] | [%] |
| Performance Tests | [#] | [#] | [#] | [#] | [#] | [%] |
| Security Tests | [#] | [#] | [#] | [#] | [#] | [%] |
| **Total** | [#] | [#] | [#] | [#] | [#] | [%] |

### By Feature/Module

| Feature/Module | Total | Passed | Failed | Pass Rate | Status |
|----------------|-------|--------|--------|-----------|--------|
| [Feature 1] | [#] | [#] | [#] | [%] | ✅/❌ |
| [Feature 2] | [#] | [#] | [#] | [%] | ✅/❌ |
| [Feature 3] | [#] | [#] | [#] | [%] | ✅/❌ |

### By Priority

| Priority | Total | Passed | Failed | Pass Rate |
|----------|-------|--------|--------|-----------|
| Critical | [#] | [#] | [#] | [%] |
| High | [#] | [#] | [#] | [%] |
| Medium | [#] | [#] | [#] | [%] |
| Low | [#] | [#] | [#] | [%] |

---

## Defect Summary

### Overview

| Severity | Open | Fixed | Deferred | Total Found |
|----------|------|-------|----------|-------------|
| Critical | [#] | [#] | [#] | [#] |
| High | [#] | [#] | [#] | [#] |
| Medium | [#] | [#] | [#] | [#] |
| Low | [#] | [#] | [#] | [#] |
| **Total** | [#] | [#] | [#] | [#] |

### Open Critical/High Defects

| ID | Title | Severity | Feature | Status | Owner | ETA |
|----|-------|----------|---------|--------|-------|-----|
| [ID] | [Title] | Critical | [Feature] | In Progress | [Name] | [Date] |
| [ID] | [Title] | High | [Feature] | Open | [Name] | [Date] |

### Deferred Defects

| ID | Title | Severity | Reason | Target Release |
|----|-------|----------|--------|----------------|
| [ID] | [Title] | Medium | [Reason] | [Version] |

### Defect Trends

```
Week 1: ████████████ 12 found, 8 fixed
Week 2: ██████████ 10 found, 14 fixed
Week 3: ████ 4 found, 10 fixed
Week 4: ██ 2 found, 4 fixed
```

---

## Coverage Analysis

### Requirements Coverage

| Category | Total Reqs | Covered | Not Covered | Coverage |
|----------|------------|---------|-------------|----------|
| Functional | [#] | [#] | [#] | [%] |
| Non-Functional | [#] | [#] | [#] | [%] |
| **Total** | [#] | [#] | [#] | [%] |

### Code Coverage

| Module | Line Coverage | Branch Coverage | Function Coverage |
|--------|--------------|-----------------|-------------------|
| [Module 1] | [%] | [%] | [%] |
| [Module 2] | [%] | [%] | [%] |
| [Module 3] | [%] | [%] | [%] |
| **Overall** | [%] | [%] | [%] |

### Untested Areas

| Area | Reason | Risk | Mitigation |
|------|--------|------|------------|
| [Area 1] | [Reason] | High/Med/Low | [Mitigation] |
| [Area 2] | [Reason] | High/Med/Low | [Mitigation] |

---

## Performance Test Results

| Scenario | Target | Actual | Status |
|----------|--------|--------|--------|
| Response time (p50) | < 100ms | [#]ms | ✅/❌ |
| Response time (p99) | < 500ms | [#]ms | ✅/❌ |
| Throughput | > 1000 rps | [#] rps | ✅/❌ |
| Error rate under load | < 0.1% | [%] | ✅/❌ |
| Memory usage | < 512MB | [#]MB | ✅/❌ |

---

## Quality Assessment

### Quality Gates

| Gate | Criteria | Result | Status |
|------|----------|--------|--------|
| Functional | Pass rate ≥ 95% | [%] | ✅/❌ |
| Regression | No new failures | [#] new failures | ✅/❌ |
| Performance | Meets SLOs | [Result] | ✅/❌ |
| Security | No critical findings | [#] findings | ✅/❌ |
| Coverage | ≥ 80% code coverage | [%] | ✅/❌ |

### Risk Assessment

| Risk Area | Risk Level | Details |
|-----------|------------|---------|
| [Area 1] | High/Med/Low | [Details] |
| [Area 2] | High/Med/Low | [Details] |

---

## Test Environment

### Configuration

| Aspect | Details |
|--------|---------|
| Environment | [Staging/QA/Pre-prod] |
| Database | [Type and version] |
| Test Data | [Description] |
| Browser/Clients | [Browsers tested] |

### Known Environment Issues

| Issue | Impact | Resolution |
|-------|--------|------------|
| [Issue] | [Impact] | [Resolution] |

---

## Recommendations

### Release Readiness: [Ready / Conditional / Not Ready]

**Rationale**: [Explanation of recommendation]

### Conditions (if conditional)

1. [Condition 1 - e.g., "Fix defect #123 before release"]
2. [Condition 2]

### Risk Acceptance Required

| Risk | Impact | Accepting Party |
|------|--------|-----------------|
| [Risk] | [Impact] | [Name/Role] |

---

## Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| [Action 1] | [Name] | High | [Date] | ⬜ |
| [Action 2] | [Name] | Medium | [Date] | ⬜ |

---

## Appendix

### Failed Test Details

| Test ID | Test Name | Failure Reason | Defect Link |
|---------|-----------|----------------|-------------|
| [ID] | [Name] | [Reason] | [Link] |

### Test Execution Timeline

| Date | Tests Run | Pass | Fail | Notes |
|------|-----------|------|------|-------|
| [Date] | [#] | [#] | [#] | [Notes] |

---

## Related Documentation

- [Test Plan](link)
- [Test Cases](link)
- [Defect Tracker](link)
- [Release Plan](link)
```

## Quality Criteria

- [ ] All test types summarized with pass/fail counts
- [ ] Defect status complete and accurate
- [ ] Coverage metrics reported
- [ ] Quality gates clearly evaluated
- [ ] Clear release readiness recommendation
- [ ] Reviewed by QA lead and stakeholders
