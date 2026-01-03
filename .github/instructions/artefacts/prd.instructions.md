---
description: 'Template and guidelines for Product Requirements Document (PRD)'
applyTo: '**/prd/**/*.md, **/prd.md, **/*-prd.md'
---

# Product Requirements Document (PRD)

A PRD defines what capabilities must be included in a product or feature, aligning delivery teams on goals, scope, and constraints.

## When to Use

- Starting a new feature or initiative
- Defining scope for a major product change
- Communicating requirements to engineering and design

## Template

```markdown
# Product Requirements Document: [Feature Name]

## Overview

### Feature/Initiative Name
[Name of the feature]

### Problem Statement
[Clear articulation of the user problem being solved]

### Strategic Alignment
[How this aligns with product strategy and business goals]

---

## Goals & Success Metrics

### Primary Goals
- [Goal 1]
- [Goal 2]

### Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [Metric 1] | [Target value] | [How measured] |
| [Metric 2] | [Target value] | [How measured] |

---

## User & Stakeholder Context

### Target Users
- [User segment 1]: [Description]
- [User segment 2]: [Description]

### User Journey
[Description of how users will interact with this feature]

### Stakeholder Needs
| Stakeholder | Key Concerns |
|-------------|--------------|
| [Stakeholder 1] | [Concerns] |

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | [Requirement] | Must-Have | |
| FR-002 | [Requirement] | Should-Have | |
| FR-003 | [Requirement] | Nice-to-Have | |

### Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | [Requirements] |
| Security | [Requirements] |
| Scalability | [Requirements] |
| Accessibility | [Requirements] |

---

## Scope

### In Scope
- [Item 1]
- [Item 2]

### Out of Scope
- [Item 1]
- [Item 2]

### Future Considerations
- [Item for future releases]

---

## Constraints & Dependencies

### Technical Constraints
- [Constraint 1]

### Business Constraints
- [Constraint 1]

### Dependencies
| Dependency | Owner | Status |
|------------|-------|--------|
| [Dependency 1] | [Team] | [Status] |

---

## Acceptance Criteria Outline

- [ ] [High-level criterion 1]
- [ ] [High-level criterion 2]
- [ ] [Edge case handling]

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| [Question 1] | [Name] | [Date] | [Pending/Resolved] |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | |
| Tech Lead | | | |
| Stakeholder | | | |
```

## Quality Criteria

- [ ] Scope, non-goals, and constraints approved by stakeholders
- [ ] User problem and success metrics clearly defined
- [ ] Acceptance criteria outline established
- [ ] Technical feasibility reviewed with engineering
