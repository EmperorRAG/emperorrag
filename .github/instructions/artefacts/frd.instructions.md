---
description: 'Template and guidelines for Feature Requirements Document (FRD)'
applyTo: '**/frd/**/*.md, **/*-frd.md'
---

# Feature Requirements Document (FRD)

An FRD defines the detailed functional and non-functional requirements for a single feature within an initiative, providing the specification needed for engineering to implement and test.

## When to Use

- Specifying a feature scoped by an Initiative Requirements Document
- Communicating detailed requirements to engineering
- Establishing the basis for acceptance criteria and test cases
- Defining feature-specific non-functional requirement targets

## Template

```markdown
# Feature Requirements Document: [Feature Name]

## Overview

- **Feature Name**: [Name]
- **Parent Initiative**: [Initiative Name](link to IRD)
- **Feature Owner**: [Name]
- **Last Updated**: [Date]
- **Status**: [Draft / In Review / Approved]

### Problem Statement

[Specific problem this feature solves within the parent initiative]

---

## Goals & Success Metrics

### Feature Objectives

[How this feature contributes to the parent initiative's goals]

- [Objective 1]
- [Objective 2]

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [Metric 1] | [Target value] | [How measured] |
| [Metric 2] | [Target value] | [How measured] |

---

## User Context

### Target User Segment(s)

[Subset of user segments from the parent IRD relevant to this feature]

- [User segment]: [How they interact with this feature]

### User Journey for This Feature

[Specific interaction flow for this feature]

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| [Scenario 1] | [Description] | [Outcome] |
| [Scenario 2] | [Description] | [Outcome] |

---

## Requirement Language

All functional and non-functional requirements follow the **EARS (Easy Approach to Requirements Syntax)** pattern with "The system shall" as the canonical subject.

| EARS Type | Abbreviation | Template | When to Use |
|-----------|-------------|----------|-------------|
| Ubiquitous | U | The system shall [verb] | Always-active behaviour with no trigger |
| Event-Driven | E | When [event], the system shall [verb] | Behaviour triggered by a specific event |
| Unwanted Behaviour | UB | If [condition], the system shall [verb] | Error handling or fallback behaviour |
| State-Driven | S | While [state], the system shall [verb] | Behaviour that depends on ongoing state |
| Optional Feature | O | Where [feature], the system shall [verb] | Behaviour gated by configuration |

### Atomicity Rule

Each requirement row must express **exactly one** testable obligation. If a sentence contains "and", a semicolon-joined list, or multiple verbs, split it into separate rows. Pipeline steps (accept → decode → map → delegate → annotate) each become their own requirement.

---

## Functional Requirements

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-001 | U | The system shall [verb phrase] | Must-Have | |
| FR-002 | E | When [event], the system shall [verb phrase] | Should-Have | |
| FR-003 | UB | If [condition], the system shall [verb phrase] | Nice-to-Have | |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| ID | Category | EARS Type | Requirement | Priority |
|----|----------|-----------|-------------|----------|
| NFR-001 | Performance | U | The system shall [measurable target] | Must-Have |
| NFR-002 | Security | U | The system shall [measurable target] | Must-Have |
| NFR-003 | Accessibility | U | The system shall [measurable target] | Must-Have |
| NFR-004 | Compatibility | U | The system shall [measurable target] | Must-Have |

---

## Scope

### In Scope

- [Item 1]
- [Item 2]

### Out of Scope

- [Item 1]
- [Item 2]

---

## Constraints & Dependencies

### Technical Constraints

- [Feature-specific constraint 1]

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| [Dependency 1] | Feature / API / Service / Data | [Team] | [Status] |

---

## Acceptance Criteria Outline

- [ ] [High-level criterion 1]
- [ ] [High-level criterion 2]
- [ ] [Edge case handling]

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| [US-001] | [Story title] | Must-Have | [Status] |
| [US-002] | [Story title] | Should-Have | [Status] |

*Full user story documents are maintained separately.*

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| [Question 1] | [Name] | [Date] | [Pending/Resolved] |

---

## Related Documentation

- [Parent IRD](link)
- [Technical Spec](link)
- [Acceptance Criteria](link)
- [RTM](link)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | |
| Tech Lead | | | |
```

## Quality Criteria

- [ ] Parent initiative referenced with link to IRD
- [ ] All requirements use EARS syntax with "The system shall" as the canonical subject
- [ ] Every requirement row is atomic — one testable obligation per row
- [ ] Functional requirements have IDs, EARS Type, and MoSCoW priorities
- [ ] Non-functional requirements have IDs (NFR-nnn), EARS Type, and MoSCoW priorities
- [ ] Non-functional requirement targets are feature-specific and measurable
- [ ] No compound requirements (semicolons, "and" joining separate obligations, multi-step pipelines in one row)
- [ ] User stories identified and prioritized
- [ ] Technical feasibility reviewed with engineering
