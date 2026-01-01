---
description: 'Template and guidelines for Test Cases'
applyTo: '**/test-cases/**/*.md, **/*-test-cases.md, **/*-test-case.md'
---

# Test Cases

Test cases define specific scenarios to verify that features work as expected, with clear steps and expected results.

## When to Use

- Documenting manual test scenarios
- Creating automated test specifications
- Defining acceptance test criteria
- Building regression test suites

## Template

```markdown
# Test Cases: [Feature/Story Name]

## Metadata
- **Story ID**: [Story reference]
- **Author**: [Name]
- **Version**: [1.0]
- **Last Updated**: [Date]

---

## Test Suite: [Suite Name]

### TC-001: [Test Case Title]

**Priority**: P0/P1/P2
**Type**: Functional | Integration | E2E | Performance | Security

**Preconditions**:
- [User is logged in]
- [Test data is available]
- [System is in expected state]

**Test Data**:
| Variable | Value |
|----------|-------|
| username | testuser@example.com |
| password | TestPass123! |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to [URL/page] | Page loads successfully |
| 2 | Enter [input] in [field] | Input is accepted |
| 3 | Click [button] | [Expected response] |
| 4 | Verify [element/state] | [Expected state] |

**Expected Result**:
[Overall expected outcome of the test case]

**Postconditions**:
- [System state after test]
- [Data cleanup requirements]

---

### TC-002: [Edge Case Title]

**Priority**: P1
**Type**: Functional

**Preconditions**:
- [Setup for edge case]

**Test Data**:
| Variable | Value |
|----------|-------|
| [edge_input] | [boundary value] |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | [Setup action] | [Expected state] |
| 2 | [Trigger edge case] | [Expected handling] |
| 3 | [Verify behavior] | [Expected result] |

**Expected Result**:
[How system handles the edge case]

---

### TC-003: [Error Handling Title]

**Priority**: P0
**Type**: Functional

**Preconditions**:
- [Setup to trigger error]

**Test Data**:
| Variable | Value |
|----------|-------|
| invalid_input | [invalid value] |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | [Submit invalid data] | Validation error displayed |
| 2 | [Verify error message] | "[Expected error message]" |
| 3 | [Verify system state] | No data modified |

**Expected Result**:
User sees appropriate error message and system remains stable

---

## Automation Notes

### Playwright Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('[Feature Name]', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate and authenticate
  });

  test('TC-001: [Test Case Title]', async ({ page }) => {
    // Step 1: Navigate
    await page.goto('/path');
    
    // Step 2: Perform action
    await page.fill('[data-testid="field"]', 'value');
    await page.click('[data-testid="submit"]');
    
    // Step 3: Verify
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });
});
```

---

## Test Case Index

| ID | Title | Priority | Type | Status |
|----|-------|----------|------|--------|
| TC-001 | [Title] | P0 | Functional | Ready |
| TC-002 | [Title] | P1 | Edge Case | Ready |
| TC-003 | [Title] | P0 | Error | Ready |

---

## Coverage Matrix

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| [REQ-001] | TC-001, TC-002 | Covered |
| [REQ-002] | TC-003 | Covered |
| [REQ-003] | - | Not Covered |
```

## Quality Criteria

- [ ] Each test case has unique ID
- [ ] Steps are clear and reproducible
- [ ] Expected results are specific
- [ ] Preconditions documented
- [ ] Test data provided
- [ ] Priority assigned
- [ ] Requirements traceable
