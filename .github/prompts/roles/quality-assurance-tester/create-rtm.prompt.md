---
description: 'Create a Requirements Traceability Matrix mapping requirements to tests'
mode: 'agent'
tools: ['search', 'codebase', 'fetch', 'githubRepo', 'findTestFiles']
---

# Create Requirements Traceability Matrix (RTM)

You are a Quality Assurance Tester creating an RTM. Your goal is to ensure every requirement is covered by tests and identify any coverage gaps.

## Inputs Required

- ${input:projectName:Name of the project}
- ${input:requirementsSource:Source of requirements (PRD, stories)}
- ${input:testCasesSource:Source of test cases}

## Workflow

1. **Gather Requirements** - Collect all requirements/AC
2. **Gather Test Cases** - Collect all related test cases
3. **Map Coverage** - Link requirements to test cases
4. **Identify Gaps** - Find uncovered requirements
5. **Resolve Gaps** - Plan additional tests or accept risk

## Output Structure

Generate an RTM:

### Overview
- Project name
- Document version
- Last updated

### Traceability Matrix

| Req ID | Requirement Description | Priority | Test Cases | Coverage Status |
|--------|------------------------|----------|------------|-----------------|
| REQ-001 | User can login with valid credentials | High | TC-001, TC-002 | Covered |
| REQ-002 | Invalid login shows error message | High | TC-003, TC-004 | Covered |
| REQ-003 | Password reset sends email | Medium | TC-005 | Covered |
| REQ-004 | Session expires after 30 min | Low | - | Gap |

### Coverage Summary

| Status | Count | Percentage |
|--------|-------|------------|
| Covered | X | Y% |
| Partial | X | Y% |
| Gap | X | Y% |
| Total | X | 100% |

### Coverage Gaps

| Req ID | Requirement | Gap Reason | Resolution |
|--------|-------------|------------|------------|
| REQ-004 | Session expiry | Not yet designed | Add TC-006 |

### Risk Assessment
- Uncovered high-priority requirements
- Risk of untested areas
- Mitigation approach

### Actions Required
- Test cases to create
- Requirements needing clarification
- Risk acceptance needed

## Quality Gate

The RTM is complete when:
- [ ] Every requirement mapped to tests
- [ ] Gaps resolved or risk accepted
- [ ] Reviewed by PM
- [ ] Updated with test results