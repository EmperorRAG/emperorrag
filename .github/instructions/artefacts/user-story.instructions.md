---
description: 'Template and guidelines for User Story'
applyTo: '**/user-story/**/*.md, **/user-stories/**/*.md, **/*-user-story.md'
---

# User Story

A user story expresses work from the user's perspective with clear intent and testable acceptance criteria.

## When to Use

- Breaking down epics into implementable work items
- Defining features from the user's perspective
- Creating backlog items for sprint planning

## Template

```markdown
# User Story: [Brief Title]

## Story Statement

**As a** [user role/persona],
**I want** [goal/capability],
**So that** [benefit/value].

---

## Description

### Background Context
[Provide background information and context for this story]

### User Journey Context
[Where does this fit in the user's overall journey?]

### Design References
- [Link to mockups/designs if available]

---

## Acceptance Criteria

### Scenario 1: [Happy Path]
```gherkin
Given [initial context/state]
When [action or trigger]
Then [expected outcome]
And [additional outcome if needed]
```

### Scenario 2: [Alternative Path]
```gherkin
Given [context]
When [action]
Then [expected result]
```

### Scenario 3: [Error Handling]
```gherkin
Given [error-inducing context]
When [action that triggers error]
Then [expected error handling]
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| [Edge case 1] | [Behavior] |
| [Edge case 2] | [Behavior] |

---

## Technical Notes

- [Known technical consideration 1]
- [Integration point 1]

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| [Story/Task] | Blocked by | [Status] |
| [External dependency] | Requires | [Status] |

---

## Definition of Done

- [ ] Code complete and peer reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Acceptance criteria validated by QA
- [ ] Product Owner acceptance
```

## Quality Criteria

- [ ] Story has clear user intent
- [ ] Acceptance criteria are testable
- [ ] Story is estimable by the team
- [ ] Edge cases captured
- [ ] Dependencies identified
