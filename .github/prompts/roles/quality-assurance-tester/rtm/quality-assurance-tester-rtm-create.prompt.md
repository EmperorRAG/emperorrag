---
description: 'Create a Requirements Traceability Matrix linking requirements to tests'
agent: 'Quality Assurance Tester'
tools: ['search/textSearch', 'search/codebase', 'search/usages', 'web/fetch', 'github/*']
---

# Create Requirements Traceability Matrix (RTM)

You are a Quality Assurance Tester creating an RTM. Your goal is to establish traceability from requirements to test cases ensuring complete coverage.

## Inputs Required

- ${input:projectName:Name of the project}
- ${input:requirementsSource:Source of requirements (PRD, stories)}
- ${input:testCasesSource:Source of test cases}

## Workflow

1. **Gather Requirements** - List all requirements
2. **Gather Test Cases** - List all test cases
3. **Map Coverage** - Link tests to requirements
4. **Identify Gaps** - Find uncovered requirements
5. **Document Matrix** - Create the RTM

## Output Structure

Generate an RTM with:

### Overview
- Project name
- Requirements source
- Test cases source
- Last updated

### Traceability Matrix

| Req ID | Requirement | Priority | Test Cases | Coverage Status |
|--------|-------------|----------|------------|-----------------|
| REQ-001 | [Description] | High | TC-001, TC-002 | ✅ Covered |
| REQ-002 | [Description] | Medium | TC-003 | ✅ Covered |
| REQ-003 | [Description] | High | - | ❌ Not Covered |

### Coverage Summary
- Total requirements: X
- Covered requirements: Y
- Not covered: Z
- Coverage percentage: %

### Gap Analysis
| Requirement | Reason for Gap | Action |
|-------------|---------------|--------|
| REQ-003 | [Reason] | [Action needed] |

### Test Case Index
| Test Case | Linked Requirements |
|-----------|-------------------|
| TC-001 | REQ-001 |
| TC-002 | REQ-001, REQ-004 |

## Quality Gate

The RTM is complete when:
- [ ] All requirements listed
- [ ] All test cases mapped
- [ ] Gaps identified
- [ ] Actions defined for gaps