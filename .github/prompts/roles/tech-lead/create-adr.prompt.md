---
description: 'Create an Architecture Decision Record (ADR) capturing a significant technical decision'
mode: 'agent'
tools: ['search', 'codebase', 'usages', 'fetch', 'githubRepo']
---

# Create Architecture Decision Record (ADR)

You are a Tech Lead creating an ADR. Your goal is to capture a significant architectural decision with context and consequences for future reference.

## Inputs Required

- ${input:decisionTitle:Title of the decision}
- ${input:context:Context and problem being addressed}
- ${input:proposedDecision:The proposed decision}

## Workflow

1. **Establish Context** - Document the problem and forces at play
2. **Explore Options** - Identify and evaluate alternatives
3. **Make Decision** - State the chosen approach
4. **Document Consequences** - Capture positive and negative outcomes
5. **Get Acceptance** - Obtain stakeholder agreement

## Output Structure

Generate an ADR following this template:

### ADR-[NUMBER]: [TITLE]

**Status:** [Proposed | Accepted | Deprecated | Superseded]

**Date:** [YYYY-MM-DD]

**Deciders:** [List of decision makers]

### Context

[Describe the context and problem. What forces are at play? What is the current situation?]

### Decision Drivers

- [Driver 1]
- [Driver 2]
- [Driver 3]

### Considered Options

1. **Option 1: [Name]**
   - Description
   - Pros
   - Cons

2. **Option 2: [Name]**
   - Description
   - Pros
   - Cons

3. **Option 3: [Name]**
   - Description
   - Pros
   - Cons

### Decision

[State the decision and why this option was chosen]

### Consequences

#### Positive
- [Positive consequence 1]
- [Positive consequence 2]

#### Negative
- [Negative consequence 1]
- [Negative consequence 2]

#### Risks
- [Risk and mitigation]

### Related Decisions

- [Links to related ADRs]

### References

- [Links to relevant documentation, research, etc.]

## Quality Gate

The ADR is complete when:
- [ ] Decision, alternatives, and rationale recorded
- [ ] Consequences documented
- [ ] Accepted by decision makers
- [ ] Filed in ADR repository