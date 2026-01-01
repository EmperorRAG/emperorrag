---
description: 'Template and guidelines for Test Plan'
applyTo: '**/test-plan/**/*.md, **/test-plans/**/*.md, **/*-test-plan.md'
---

# Test Plan

A test plan defines the overall testing approach, scope, resources, and schedule for a feature or release.

## When to Use

- Planning testing for new features
- Coordinating testing for releases
- Documenting testing strategy for epics
- Establishing testing scope and priorities

## Template

```markdown
# Test Plan: [Feature/Release Name]

## Document Info
- **Version**: [1.0]
- **Author**: [Name]
- **Status**: [Draft | Approved | In Execution | Complete]
- **Date**: [YYYY-MM-DD]

---

## Executive Summary

[Brief overview of what is being tested and the overall testing approach]

---

## Scope

### In Scope
- [Feature/Component 1]
- [Feature/Component 2]
- [Integration point 1]

### Out of Scope
- [Explicitly excluded item 1]
- [Reason for exclusion]

---

## Test Objectives

- [ ] Verify [functional requirement 1]
- [ ] Validate [performance requirement]
- [ ] Confirm [security requirement]
- [ ] Ensure [compatibility requirement]

---

## Test Strategy

### Test Levels

| Level | Description | Responsibility | Tools |
|-------|-------------|----------------|-------|
| Unit | Component-level testing | Developers | Jest/Vitest |
| Integration | Service integration testing | Developers/QA | Jest/Supertest |
| System | End-to-end testing | QA | Playwright |
| Acceptance | User acceptance testing | QA/Product | Manual/Playwright |

### Test Types

| Type | Included | Priority | Notes |
|------|----------|----------|-------|
| Functional | Yes | P0 | Core functionality |
| Regression | Yes | P0 | Existing features |
| Performance | Yes | P1 | Load testing |
| Security | Yes | P1 | Auth/authz flows |
| Accessibility | Yes | P1 | WCAG 2.1 AA |
| Compatibility | Yes | P2 | Browser matrix |

---

## Test Environment

### Environment Details

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Unit/Integration testing |
| Staging | staging.example.com | System/UAT testing |
| Production | app.example.com | Smoke testing |

### Test Data Requirements

| Data Type | Source | Setup Method |
|-----------|--------|--------------|
| User accounts | Fixtures | Seed script |
| Test records | Generated | Factory |

---

## Entry Criteria

- [ ] Code complete and merged to test branch
- [ ] Unit tests passing (>80% coverage)
- [ ] Build successful in CI
- [ ] Test environment available
- [ ] Test data prepared

---

## Exit Criteria

- [ ] All P0 test cases executed
- [ ] All P0 test cases passed
- [ ] P1 test cases executed (>90% pass rate)
- [ ] No open P0/P1 bugs
- [ ] Performance targets met
- [ ] Test summary report completed

---

## Test Schedule

| Phase | Start Date | End Date | Deliverable |
|-------|------------|----------|-------------|
| Test Planning | [Date] | [Date] | Test Plan approved |
| Test Case Development | [Date] | [Date] | Test cases written |
| Test Execution | [Date] | [Date] | Test execution complete |
| Bug Fixing | [Date] | [Date] | Bugs resolved |
| Regression | [Date] | [Date] | Regression complete |
| Sign-off | [Date] | [Date] | QA sign-off |

---

## Resource Requirements

### Team

| Role | Name | Responsibility |
|------|------|----------------|
| QA Lead | [Name] | Test planning, coordination |
| QA Engineer | [Name] | Test execution |
| Developer | [Name] | Bug fixing support |

### Tools

- Test Management: [Tool name]
- Automation: [Playwright/Jest]
- Bug Tracking: [GitHub Issues]
- CI/CD: [GitHub Actions]

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Environment unavailable | Medium | High | Backup env ready |
| Insufficient test data | Low | Medium | Generate synthetic data |
| Resource constraints | Medium | Medium | Prioritize P0 tests |

---

## Deliverables

- [ ] Test Plan (this document)
- [ ] Test Cases
- [ ] Test Execution Report
- [ ] Bug Reports
- [ ] QA Sign-off

---

## References

- [Link to PRD]
- [Link to Technical Design]
- [Link to Acceptance Criteria]
```

## Quality Criteria

- [ ] Scope clearly defined
- [ ] Test levels and types specified
- [ ] Environment requirements documented
- [ ] Entry/exit criteria defined
- [ ] Schedule established
- [ ] Risks identified with mitigations
