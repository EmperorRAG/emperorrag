---
description: 'Template and guidelines for Acceptance Criteria'
applyTo: '**/acceptance-criteria/**/*.md, **/*-acceptance-criteria.md'
---

# Acceptance Criteria

Acceptance criteria define the conditions that must be met for a user story to be considered complete and ready for release.

## When to Use

- Refining user stories with testable conditions
- Providing clear requirements for developers
- Creating basis for test case development

## Template

```markdown
# Acceptance Criteria: [Feature/Story Title]

## Story Reference
- **Story ID**: [ID]
- **Story Title**: [Title]
- **Epic**: [Epic Name]

---

## Functional Criteria

### Scenario 1: [Happy Path - Primary Flow]
```gherkin
Feature: [Feature Name]
  As a [user role]
  I want [capability]
  So that [benefit]

  Scenario: [Scenario Name]
    Given [precondition/initial state]
    And [additional precondition if needed]
    When [action performed by user]
    And [additional action if needed]
    Then [expected outcome]
    And [additional expected outcome]
```

### Scenario 2: [Alternative Flow]
```gherkin
  Scenario: [Alternative Scenario Name]
    Given [precondition]
    When [alternative action]
    Then [expected result]
```

### Scenario 3: [Error/Edge Case Flow]
```gherkin
  Scenario: [Error Scenario Name]
    Given [error-inducing precondition]
    When [action that triggers error]
    Then [expected error handling behavior]
    And [user-facing error message or recovery]
```

---

## Non-Functional Criteria

### Performance
- [ ] [Response time requirement]
- [ ] [Throughput requirement]
- [ ] [Resource usage constraint]

### Security
- [ ] [Authentication requirement]
- [ ] [Authorization requirement]
- [ ] [Data protection requirement]

### Accessibility
- [ ] [WCAG compliance level]
- [ ] [Specific accessibility requirement]

### Compatibility
- [ ] [Browser/device support]
- [ ] [API version compatibility]

---

## Edge Cases

| Input/Condition | Expected Behavior |
|-----------------|-------------------|
| [Edge case 1] | [Expected behavior] |
| [Edge case 2] | [Expected behavior] |
| [Boundary condition] | [Expected behavior] |
| [Null/empty input] | [Expected behavior] |

---

## Validation Rules

| Field/Input | Rule | Error Message |
|-------------|------|---------------|
| [Field name] | [Validation rule] | [User-facing message] |
| [Field name] | [Validation rule] | [User-facing message] |

---

## Dependencies

- [Prerequisite story/feature]
- [External service dependency]
- [Data dependency]

---

## Notes

- [Additional context or clarification]
- [Design decisions or constraints]
```

## Quality Criteria

- [ ] Criteria are testable (pass/fail)
- [ ] Written in Given-When-Then format
- [ ] Edge cases covered
- [ ] Non-functional requirements specified
- [ ] Validation rules defined
- [ ] No ambiguous language
