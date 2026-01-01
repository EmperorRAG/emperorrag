---
description: 'Template and guidelines for QA Signoff'
applyTo: '**/qa-signoff/**/*.md, **/*-qa-signoff.md'
---

# QA Signoff

A QA signoff document formally certifies that testing is complete and the release meets quality standards.

## When to Use

- Certifying release readiness
- Documenting test completion
- Providing formal quality approval
- Creating audit trail for releases

## Template

```markdown
# QA Signoff: [Release/Feature Name]

## Release Information

| Field | Value |
|-------|-------|
| **Release Version** | [v1.2.0] |
| **Release Date** | [YYYY-MM-DD] |
| **Feature/Epic** | [Epic name/ID] |
| **Environment** | [Staging → Production] |
| **QA Lead** | [Name] |
| **Sign-off Date** | [YYYY-MM-DD] |

---

## Executive Summary

### Overall Status: ✅ APPROVED / ⚠️ APPROVED WITH CONDITIONS / ❌ NOT APPROVED

[Brief summary of testing results and recommendation]

---

## Scope of Testing

### Features Tested
- [x] [Feature 1]
- [x] [Feature 2]
- [x] [Feature 3]

### Test Types Completed
- [x] Functional Testing
- [x] Regression Testing
- [x] Integration Testing
- [x] Performance Testing
- [x] Security Testing
- [x] Accessibility Testing
- [ ] UAT (pending)

---

## Test Execution Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | [Number] |
| **Executed** | [Number] |
| **Passed** | [Number] |
| **Failed** | [Number] |
| **Blocked** | [Number] |
| **Pass Rate** | [X]% |

### By Priority

| Priority | Total | Passed | Failed | Pass Rate |
|----------|-------|--------|--------|-----------|
| P0 (Critical) | [N] | [N] | [N] | [X]% |
| P1 (High) | [N] | [N] | [N] | [X]% |
| P2 (Medium) | [N] | [N] | [N] | [X]% |
| P3 (Low) | [N] | [N] | [N] | [X]% |

---

## Defect Summary

### Open Defects

| ID | Title | Severity | Status | Impact Assessment |
|----|-------|----------|--------|-------------------|
| [BUG-001] | [Title] | Low | Deferred | [Acceptable for release] |

### Resolved Defects

| ID | Title | Severity | Fixed In |
|----|-------|----------|----------|
| [BUG-002] | [Title] | High | [Build] |
| [BUG-003] | [Title] | Medium | [Build] |

### Defect Metrics

| Severity | Found | Fixed | Open | Deferred |
|----------|-------|-------|------|----------|
| Critical | [N] | [N] | [N] | [N] |
| High | [N] | [N] | [N] | [N] |
| Medium | [N] | [N] | [N] | [N] |
| Low | [N] | [N] | [N] | [N] |

---

## Entry/Exit Criteria Verification

### Entry Criteria
- [x] Code freeze completed
- [x] Build deployed to staging
- [x] Test environment stable
- [x] Test data prepared

### Exit Criteria
- [x] All P0 test cases passed
- [x] All P1 test cases executed (>95% pass)
- [x] No open Critical/High defects
- [x] Performance targets met
- [x] Security scan passed
- [x] Regression suite passed

---

## Risk Assessment

### Known Issues Going to Production

| Issue | Risk Level | Mitigation | Accepted By |
|-------|------------|------------|-------------|
| [Known issue 1] | Low | [Workaround available] | [Name] |

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | Low | Medium | [Monitoring in place] |

---

## Environment Verification

| Environment | Status | Verified By | Date |
|-------------|--------|-------------|------|
| Staging | ✅ Passed | [Name] | [Date] |
| Pre-prod | ✅ Passed | [Name] | [Date] |

---

## Stakeholder Approvals

| Role | Name | Status | Date |
|------|------|--------|------|
| QA Lead | [Name] | ✅ Approved | [Date] |
| Tech Lead | [Name] | ✅ Approved | [Date] |
| Product Owner | [Name] | ⏳ Pending | - |

---

## Conditions for Approval (if applicable)

- [ ] [Condition 1 to be met before/after release]
- [ ] [Condition 2]

---

## Post-Release Monitoring

- [ ] Monitor error rates for 24 hours
- [ ] Verify key metrics in production
- [ ] Execute production smoke tests
- [ ] Review customer feedback channels

---

## Sign-off Statement

I certify that the testing described in this document has been completed according to the test plan, and the release meets the defined quality standards.

**QA Lead Signature**: ________________________

**Date**: ________________________

---

## Appendix

### Test Execution Reports
- [Link to detailed test results]

### Defect Reports
- [Link to defect tracking]

### Performance Test Results
- [Link to performance reports]
```

## Quality Criteria

- [ ] All exit criteria verified
- [ ] Defect summary complete
- [ ] Known issues documented with mitigations
- [ ] Stakeholder approvals obtained
- [ ] Risk assessment completed
- [ ] Post-release monitoring defined
