---
description: 'Template and guidelines for Requirements Traceability Matrix (RTM)'
applyTo: '**/rtm/**/*.md, **/*-rtm.md'
---

# Requirements Traceability Matrix (RTM)

A Requirements Traceability Matrix links requirements to their implementation, test cases, and verification status, ensuring complete coverage.

## When to Use

- Tracking requirement coverage
- Ensuring all requirements are tested
- Audit and compliance documentation
- Impact analysis for changes

## Template

```markdown
# Requirements Traceability Matrix: [Project/Feature Name]

## Overview

- **Project**: [Project Name]
- **Version**: [Version]
- **Owner**: [Name]
- **Last Updated**: [Date]

---

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Verified | [#] | [%] |
| 🟡 Partially Verified | [#] | [%] |
| 🔴 Not Verified | [#] | [%] |
| ⬜ Not Applicable | [#] | [%] |
| **Total** | [#] | 100% |

---

## Traceability Matrix

### Functional Requirements

| Req ID | Requirement | Priority | Design Ref | Implementation | Test Case(s) | Test Status | Verification |
|--------|-------------|----------|------------|----------------|--------------|-------------|--------------|
| FR-001 | [Requirement description] | Must | [TDD-001](link) | [Module/PR](link) | TC-001, TC-002 | ✅ Pass | ✅ Verified |
| FR-002 | [Requirement description] | Must | [TDD-002](link) | [Module/PR](link) | TC-003 | ✅ Pass | ✅ Verified |
| FR-003 | [Requirement description] | Should | [TDD-003](link) | [Module/PR](link) | TC-004, TC-005 | 🟡 Partial | 🟡 Partial |
| FR-004 | [Requirement description] | Could | - | [Module/PR](link) | TC-006 | 🔴 Fail | 🔴 Not Verified |

### Non-Functional Requirements

| Req ID | Requirement | Category | Design Ref | Implementation | Test Case(s) | Test Status | Verification |
|--------|-------------|----------|------------|----------------|--------------|-------------|--------------|
| NFR-001 | [Performance requirement] | Performance | [TDD-001](link) | [Implementation](link) | PT-001 | ✅ Pass | ✅ Verified |
| NFR-002 | [Security requirement] | Security | [TDD-002](link) | [Implementation](link) | ST-001 | ✅ Pass | ✅ Verified |
| NFR-003 | [Scalability requirement] | Scalability | [TDD-003](link) | [Implementation](link) | LT-001 | 🟡 Partial | 🟡 Partial |

---

## Detailed Requirement Tracking

### FR-001: [Requirement Name]

| Attribute | Value |
|-----------|-------|
| **Description** | [Full requirement description] |
| **Source** | [PRD/User Story/Epic reference] |
| **Priority** | Must Have |
| **Status** | ✅ Verified |

#### Linked Artifacts

| Type | Reference | Status |
|------|-----------|--------|
| Design Document | [TDD-001](link) | ✅ Complete |
| Implementation | [PR #123](link), [Module](link) | ✅ Complete |
| Test Cases | [TC-001](link), [TC-002](link) | ✅ Pass |
| Documentation | [User Guide](link) | ✅ Complete |

#### Verification Notes
[Any notes about verification, exceptions, or edge cases]

---

### FR-002: [Requirement Name]

[Repeat structure for each requirement that needs detailed tracking]

---

## Coverage Analysis

### By Priority

| Priority | Total | Verified | Percentage |
|----------|-------|----------|------------|
| Must Have | [#] | [#] | [%] |
| Should Have | [#] | [#] | [%] |
| Could Have | [#] | [#] | [%] |
| Won't Have | [#] | N/A | N/A |

### By Category

| Category | Total | Verified | Percentage |
|----------|-------|----------|------------|
| Functional | [#] | [#] | [%] |
| Performance | [#] | [#] | [%] |
| Security | [#] | [#] | [%] |
| Usability | [#] | [#] | [%] |

### Gaps Identified

| Req ID | Issue | Remediation | Owner | Due Date |
|--------|-------|-------------|-------|----------|
| FR-004 | Test failing | [Action needed] | [Name] | [Date] |
| NFR-003 | Partial coverage | [Action needed] | [Name] | [Date] |

---

## Change History

| Date | Req ID | Change | Reason | By |
|------|--------|--------|--------|-----|
| [Date] | FR-001 | Added | Initial creation | [Name] |
| [Date] | FR-002 | Modified | Clarification from stakeholder | [Name] |
| [Date] | FR-005 | Removed | Out of scope | [Name] |

---

## Definitions

| Status | Definition |
|--------|------------|
| ✅ Verified | Requirement fully implemented and all tests passing |
| 🟡 Partial | Requirement partially implemented or some tests failing |
| 🔴 Not Verified | Requirement not implemented or tests not passing |
| ⬜ N/A | Requirement not applicable to this release |

---

## Related Documentation

- [Product Requirements Document](link)
- [Technical Design Document](link)
- [Test Plan](link)
- [Test Cases](link)
```

## Quality Criteria

- [ ] All requirements traced from source to verification
- [ ] Every requirement has at least one test case
- [ ] Coverage percentages calculated and reviewed
- [ ] Gaps identified with remediation plans
- [ ] Updated after each significant change
- [ ] Reviewed with QA and stakeholders
