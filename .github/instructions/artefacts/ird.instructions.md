---
description: 'Template and guidelines for Initiative Requirements Document (IRD)'
applyTo: '**/ird/**/*.md, **/*-ird.md'
---

# Initiative Requirements Document (IRD)

An IRD defines the strategic goals, scope, constraints, and success criteria for a product initiative, aligning stakeholders before individual features are specified.

## When to Use

- Starting a new initiative that spans multiple features
- Defining which features and capabilities belong to an initiative
- Aligning cross-functional stakeholders on initiative direction
- Establishing initiative-wide non-functional requirement baselines

## Template

```markdown
# Initiative Requirements Document: [Initiative Name]

## Overview

- **Initiative Name**: [Name]
- **Initiative Owner**: [Name]
- **Sponsor**: [Name]
- **Last Updated**: [Date]
- **Status**: [Draft / In Review / Approved]

### Problem Statement

[Broad articulation of the business or user problem this initiative addresses]

### Strategic Alignment

[How this initiative aligns with product vision pillars and roadmap themes. Link to relevant Product Vision and Product Roadmap sections.]

---

## Goals & Success Criteria

### Business Objectives

- [Objective 1]
- [Objective 2]

### Initiative-Level Success Metrics

| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| [Metric 1] | [Baseline] | [Target value] | [How measured] |
| [Metric 2] | [Baseline] | [Target value] | [How measured] |

### Key Results

- [Key Result 1]
- [Key Result 2]

---

## User & Stakeholder Context

### Target User Segments

[Reference Product Vision personas. Describe which segments this initiative serves.]

- [User segment 1]: [Relevance to this initiative]
- [User segment 2]: [Relevance to this initiative]

### End-to-End User Journey

[Description of how users will experience the initiative across its features]

### Stakeholder Map

| Role | Name | Key Concerns | Decision Authority |
|------|------|--------------|-------------------|
| [Role 1] | [Name] | [Concerns] | [Authority level] |
| [Role 2] | [Name] | [Concerns] | [Authority level] |

---

## Initiative Scope

### Features / Capabilities In Scope

Each item below becomes a separate Feature Requirements Document (FRD).

- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]

### Out of Scope

- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

### Future Considerations / Deferred Capabilities

- [Deferred capability 1]
- [Deferred capability 2]

---

## Requirement Language

All non-functional requirements follow the **EARS (Easy Approach to Requirements Syntax)** pattern with "The system shall" as the canonical subject.

| EARS Type | Abbreviation | Template | When to Use |
|-----------|-------------|----------|-------------|
| Ubiquitous | U | The system shall [verb] | Always-active behaviour with no trigger |
| Event-Driven | E | When [event], the system shall [verb] | Behaviour triggered by a specific event |
| Unwanted Behaviour | UB | If [condition], the system shall [verb] | Error handling or fallback behaviour |
| State-Driven | S | While [state], the system shall [verb] | Behaviour that depends on ongoing state |
| Optional Feature | O | Where [feature], the system shall [verb] | Behaviour gated by configuration |

### Atomicity Rule

Each requirement row must express **exactly one** testable obligation. If a sentence contains "and", a semicolon-joined list, or multiple verbs, split it into separate rows.

---

## Non-Functional Requirements (Initiative-Wide)

These baselines apply to all features within this initiative.

| ID | Category | EARS Type | Requirement | Priority |
|----|----------|-----------|-------------|----------|
| NFR-001 | Performance | U | The system shall [baseline requirement] | Must-Have |
| NFR-002 | Security | U | The system shall [baseline requirement] | Must-Have |
| NFR-003 | Scalability | U | The system shall [baseline requirement] | Must-Have |
| NFR-004 | Accessibility | U | The system shall [baseline requirement] | Must-Have |
| NFR-005 | Testability | U | The system shall [baseline requirement] | Must-Have |
| NFR-006 | Compatibility | U | The system shall [baseline requirement] | Must-Have |

---

## Constraints

### Technical Constraints

- [Platform or architectural constraint 1]

### Business Constraints

- [Budget, timeline, or regulatory constraint 1]

### Organizational Constraints

- [Team capacity or skills constraint 1]

---

## Dependencies

### Cross-Team Dependencies

| Dependency | Team | Impact | Status |
|------------|------|--------|--------|
| [Dependency 1] | [Team] | [What it blocks] | [Status] |

### External Dependencies

| Dependency | Owner | Impact | Mitigation |
|------------|-------|--------|------------|
| [Dependency 1] | [Vendor/Team] | [What it blocks] | [Mitigation plan] |

### Platform / Infrastructure Dependencies

- [Dependency 1]

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] | [Name] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Strategy] | [Name] |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| [Question 1] | [Name] | [Date] | [Pending/Resolved] |

---

## Related Documentation

- [Product Vision](link)
- [Product Roadmap](link)
- [FRD: Feature 1](link)
- [FRD: Feature 2](link)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Sponsor | | | |
| Product Manager | | | |
| Tech Lead | | | |
```

## Quality Criteria

- [ ] Strategic alignment with product vision and roadmap is clear
- [ ] Scope defines feature boundaries (each feature maps to an FRD)
- [ ] Success metrics are measurable with baselines and targets
- [ ] Stakeholder map is complete with decision authority
- [ ] All requirements use EARS syntax with "The system shall" as the canonical subject
- [ ] Every requirement row is atomic — one testable obligation per row
- [ ] Non-functional requirements have IDs (NFR-nnn), EARS Type, and MoSCoW priorities
- [ ] Initiative-wide non-functional requirements establish measurable baselines
- [ ] No compound requirements (semicolons, "and" joining separate obligations)
- [ ] Risks assessed with mitigations and owners
- [ ] Reviewed and approved by stakeholders
