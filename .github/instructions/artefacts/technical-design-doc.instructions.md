---
description: 'Template and guidelines for Technical Design Document'
applyTo: '**/technical-design-doc/**/*.md, **/technical-design/**/*.md, **/*-technical-design.md, **/*-tdd.md'
---

# Technical Design Document

A technical design document provides detailed technical specifications for implementing a feature or system component.

## When to Use

- Before implementing complex features
- When multiple components need coordination
- For features requiring architectural review
- When establishing technical approach for epics

## Template

```markdown
# Technical Design: [Feature/Component Name]

## Document Info
- **Author**: [Name]
- **Reviewers**: [Names]
- **Status**: [Draft | In Review | Approved | Implemented]
- **Last Updated**: [Date]

---

## Overview

### Problem Statement
[What problem does this solve?]

### Goals
- [Goal 1]
- [Goal 2]

### Non-Goals
- [Explicitly not addressing 1]
- [Explicitly not addressing 2]

---

## Background

### Current State
[Describe the current system state or behavior]

### Proposed Change
[High-level description of the proposed solution]

---

## Detailed Design

### System Architecture

```
[ASCII diagram or reference to architecture diagram]
┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  Component  │
└─────────────┘     └─────────────┘
```

### Component Design

#### [Component 1 Name]
- **Responsibility**: [What this component does]
- **Interfaces**: [APIs exposed]
- **Dependencies**: [What it depends on]

#### [Component 2 Name]
- **Responsibility**: [What this component does]
- **Interfaces**: [APIs exposed]
- **Dependencies**: [What it depends on]

### Data Model

```typescript
interface EntityName {
  id: string;
  field1: Type;
  field2: Type;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Design

#### Endpoint 1
- **Method**: `POST /api/resource`
- **Request Body**:
```json
{
  "field": "value"
}
```
- **Response**:
```json
{
  "id": "string",
  "status": "success"
}
```

### Sequence Diagram

```
User -> API: Request
API -> Service: Process
Service -> Database: Query
Database -> Service: Result
Service -> API: Response
API -> User: Result
```

---

## Implementation Plan

### Phase 1: [Phase Name]
- [ ] Task 1
- [ ] Task 2

### Phase 2: [Phase Name]
- [ ] Task 1
- [ ] Task 2

---

## Testing Strategy

### Unit Tests
- [Key unit test scenarios]

### Integration Tests
- [Key integration test scenarios]

### Performance Tests
- [Performance test approach]

---

## Security Considerations

- [Security consideration 1]
- [Security consideration 2]

---

## Performance Considerations

- [Expected load/scale]
- [Performance requirements]
- [Optimization strategies]

---

## Migration Plan

### Data Migration
[If applicable, describe data migration approach]

### Rollback Plan
[How to rollback if issues arise]

---

## Open Questions

| Question | Owner | Status |
|----------|-------|--------|
| [Question 1] | [Name] | [Open/Resolved] |

---

## References

- [Link to PRD]
- [Link to related ADRs]
- [Link to relevant documentation]
```

## Quality Criteria

- [ ] Problem and goals clearly stated
- [ ] Architecture diagrams included
- [ ] Data models defined
- [ ] API contracts specified
- [ ] Implementation phases outlined
- [ ] Testing strategy defined
- [ ] Security considerations addressed
- [ ] Reviewed and approved
