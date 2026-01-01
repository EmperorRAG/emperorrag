---
description: 'Template and guidelines for Technical Specification'
applyTo: '**/technical-spec/**/*.md, **/specs/**/*.md, **/*-technical-spec.md, **/*-spec.md'
---

# Technical Specification

A technical specification provides detailed implementation requirements and constraints for a specific component or feature.

## When to Use

- Detailing specific component implementations
- Defining precise technical requirements
- Establishing interface contracts
- Documenting configuration requirements

## Template

```markdown
# Technical Specification: [Component/Feature Name]

## Metadata
- **Version**: [1.0]
- **Author**: [Name]
- **Status**: [Draft | Approved | Implemented]
- **Date**: [YYYY-MM-DD]

---

## Purpose

[Brief description of what this specification defines]

---

## Scope

### In Scope
- [What this spec covers]

### Out of Scope
- [What this spec does not cover]

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | [Requirement description] | [P0/P1/P2] | [Notes] |
| FR-002 | [Requirement description] | [P0/P1/P2] | [Notes] |

### Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Performance | [Requirement] | [Metric] |
| NFR-002 | Security | [Requirement] | [Standard] |
| NFR-003 | Availability | [Requirement] | [SLA %] |

---

## Technical Details

### Technology Stack
- **Runtime**: [Node.js version, etc.]
- **Framework**: [NestJS, Next.js, etc.]
- **Database**: [PostgreSQL, etc.]
- **Dependencies**: [Key dependencies]

### Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| [PARAM_NAME] | string | [default] | [Description] |
| [PARAM_NAME] | number | [default] | [Description] |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| [VAR_NAME] | Yes/No | [Description] |

---

## Interface Specifications

### Input Interface

```typescript
interface InputType {
  field1: string;
  field2: number;
  options?: {
    setting1: boolean;
  };
}
```

### Output Interface

```typescript
interface OutputType {
  success: boolean;
  data: ResultType;
  errors?: ErrorType[];
}
```

### Error Codes

| Code | Name | Description | Resolution |
|------|------|-------------|------------|
| [E001] | [ErrorName] | [Description] | [How to fix] |

---

## Constraints

### Technical Constraints
- [Constraint 1]
- [Constraint 2]

### Business Constraints
- [Constraint 1]
- [Constraint 2]

---

## Dependencies

### Internal Dependencies
- [Package/Module name] - [Purpose]

### External Dependencies
- [Service name] - [Purpose]

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| [field] | [Validation rule] | [Message] |

---

## Assumptions

- [Assumption 1]
- [Assumption 2]

---

## References

- [Link to Technical Design Doc]
- [Link to API Documentation]
- [Link to ADR]
```

## Quality Criteria

- [ ] All functional requirements listed with IDs
- [ ] Non-functional requirements quantified
- [ ] Interfaces fully specified
- [ ] Configuration documented
- [ ] Dependencies identified
- [ ] Constraints clearly stated
