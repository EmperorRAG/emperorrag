---
description: 'Template and guidelines for Architecture Decision Record (ADR)'
applyTo: '**/adr/**/*.md, **/adrs/**/*.md, **/*-adr.md'
---

# Architecture Decision Record (ADR)

An ADR documents an architecturally significant decision with its context, rationale, and consequences.

## When to Use

- Making technology or framework choices
- Defining integration patterns
- Establishing coding standards or conventions
- Any decision that affects system structure

## Template

```markdown
# ADR-[NUMBER]: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Date
[YYYY-MM-DD]

---

## Context

### Problem Statement
[Describe the issue or decision that needs to be made]

### Driving Forces
- [Force 1: e.g., scalability requirement]
- [Force 2: e.g., team expertise]
- [Force 3: e.g., time constraints]
- [Force 4: e.g., cost considerations]

### Constraints
- [Technical constraint]
- [Business constraint]
- [Resource constraint]

---

## Decision Drivers

- [Driver 1: Most important factor]
- [Driver 2: Second most important]
- [Driver 3: etc.]

---

## Considered Options

### Option 1: [Option Name]
**Description**: [Brief description]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |
| [Pro 2] | [Con 2] |

### Option 2: [Option Name]
**Description**: [Brief description]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |
| [Pro 2] | [Con 2] |

### Option 3: [Option Name]
**Description**: [Brief description]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |
| [Pro 2] | [Con 2] |

---

## Decision

**Chosen Option**: [Option Name]

### Rationale
[Explain why this option was chosen over others]

### Trade-offs Accepted
- [Trade-off 1]
- [Trade-off 2]

---

## Consequences

### Positive
- [Positive consequence 1]
- [Positive consequence 2]

### Negative
- [Negative consequence 1]
- [Negative consequence 2]

### Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## Implementation Notes

- [Implementation consideration 1]
- [Migration path if applicable]
- [Timeline considerations]

---

## Related Decisions

- [ADR-XXX: Related decision]
- [Link to related documentation]

---

## References

- [Link to relevant documentation]
- [Link to research or benchmarks]
```

## Quality Criteria

- [ ] Context clearly explains the problem
- [ ] Multiple options were considered
- [ ] Rationale explains why chosen option is best
- [ ] Consequences documented (positive and negative)
- [ ] Status is current
- [ ] Date recorded
