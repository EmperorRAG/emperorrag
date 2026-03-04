---
description: 'Template and guidelines for Feature Requirements Document (FRD)'
applyTo: '**/frd/*.md, **/*-frd.md'
---

# Feature Requirements Document (FRD)

An FRD defines the **feature-level behavioral and quality requirements** for a single feature within an initiative. It explains **what the feature must do**, **what outcomes it must support**, **what constraints apply at the feature level**, and **what success looks like for consumers and engineering**.

An FRD is **not** a low-level design, implementation blueprint, code structure guide, or execution trace of internal pipelines.

---

## Document Intent

The purpose of an FRD is to describe a feature in terms of:

* the problem it solves within the parent initiative
* the user or consumer scenarios it must support
* the functional behaviors the system must provide
* the feature-specific non-functional expectations that must be met
* the scope boundaries of the feature
* the dependencies and constraints relevant to delivering the feature

The FRD must remain at the **feature capability level**. It must not collapse into code-level implementation detail.

---

## When to Use

Use an FRD when:

* specifying a **single feature or capability area** scoped by an Initiative Requirements Document
* translating initiative-level requirements into **feature-level behavior**
* defining the basis for acceptance criteria, validation, and implementation planning
* clarifying what is in and out of scope for a feature
* documenting feature-specific quality expectations that extend or refine the parent initiative

---

## When Not to Use

Do **not** use an FRD to document:

* exact function, class, interface, schema, tag, or type names
* exact file structures, folders, barrels, or module layouts
* exact library methods, combinators, or helper utilities
* internal pipeline sequencing such as decode → map → delegate → annotate
* code-level dependency injection mechanisms
* test file inventories or exact spec-file breakdowns
* implementation walkthroughs of controller/service/internal layers
* architecture decisions that belong in ADRs
* low-level design detail that belongs in a technical specification

If the content would stop being true after a refactor that preserves feature behavior, it likely does **not** belong in the FRD.

---

## Abstraction Boundary

### The FRD Must Describe

* **feature capabilities**
* **consumer-visible behavior**
* **system outcomes**
* **validation and failure behavior**
* **feature-level quality expectations**
* **scope boundaries**
* **dependencies relevant to delivery**

### The FRD Must Not Describe

* exact implementation structure
* exact internal naming
* exact library calls
* exact schema composition mechanics
* exact tracing or observability hooks
* exact helper function usage
* exact testing mechanics beyond feature-level testability expectations

### Technology References

Technology names such as **Effect**, **Better Auth**, or **schema validation** may be mentioned only when they are needed to explain:

* architectural context
* external dependency context
* capability boundaries
* compatibility expectations

Technology references must stay **high-level**. Do not describe the feature in terms of exact Effect or Better Auth APIs.

---

## Source Hierarchy

When generating an FRD, use the following hierarchy:

1. **Product Vision** — why the product exists and what qualities matter
2. **Product Roadmap** — what capability area is being pursued and why now
3. **Parent IRD** — what the initiative must deliver and what feature area this FRD belongs to
4. **ADRs / Technical Standards** — referenced where needed, but not restated as feature requirements
5. **Technical Specs** — linked where needed, but not substituted for feature requirements

The FRD must inherit intent from the parent IRD without duplicating initiative-level wording or restating low-level implementation content from technical documents.

---

## Authoring Rules

### 1. Write Requirements as Feature Behavior

Requirements must describe:

* what the system must support
* what must happen on valid input
* what must happen on invalid input
* what failure outcomes must be surfaced
* what scenarios must be possible within the product boundary

Prefer wording such as:

* The system shall support...
* The system shall validate...
* The system shall return...
* If [invalid condition], the system shall reject...
* When [feature scenario occurs], the system shall provide...

Avoid wording such as:

* The system shall define...
* The system shall call...
* The system shall decode...
* The system shall resolve...
* The system shall annotate...
* The system shall place...
* The system shall re-export...

unless the requirement truly cannot be expressed any other way at the feature level.

### 2. Keep Requirements Capability-Oriented

Each functional requirement must represent **one feature obligation**, not one internal pipeline step.

Good atomicity:

* one requirement for input validation behavior
* one requirement for success behavior
* one requirement for structured failure behavior
* one requirement for a major scenario supported by the feature

Bad atomicity:

* separate rows for decode, map, delegate, annotate, resolve dependency, call SDK, spread optional fields

### 3. Do Not Encode the Implementation

The FRD must **not** include:

* exact function names
* exact schema or TaggedClass names
* exact SDK method names
* exact helper names
* exact effect combinators
* exact file names or folder structures
* exact test file counts
* exact branded-value extraction behavior
* exact dependency-resolution details

That content belongs in technical specifications, ADRs, or implementation guidance.

### 4. Minimize Duplication

Do not repeat the same controller/service/error-handling pattern across multiple requirement groups with only renamed operations.

If multiple scenarios share the same feature behavior, write one requirement at the shared capability level instead of repeating the same implementation pattern three times.

### 5. Keep Scope at the Capability Level

“In Scope” and “Out of Scope” must list:

* capabilities
* scenarios
* adjacent feature boundaries
* excluded behavior areas

They must **not** list:

* files
* folders
* modules
* classes
* helper utilities
* annotations
* spec suites

### 6. Keep User Context Consumer-Focused

The user journey and scenarios must describe:

* how a consumer uses the feature
* what the system validates
* what outcomes the consumer receives
* what error paths matter

They must **not** narrate the internal implementation path through schemas, services, contexts, or helper functions.

### 7. Keep NFRs Outcome-Oriented

Feature-specific NFRs should focus on:

* security/privacy handling
* correctness
* compatibility
* testability
* usability
* observability only if materially relevant at feature level
* performance only if there is a meaningful feature-specific target

Feature NFRs must **not** be restated coding standards such as:

* use TaggedClass
* use branded value objects
* use Effect error channel
* use specific tracing methods
* include TSDoc on every export
* avoid `any`
* use a specific DI mechanism

Those belong in architecture standards or implementation guidance.

### 8. Keep Metrics Meaningful

Feature metrics should measure outcomes such as:

* supported scenarios delivered
* validation behavior covered
* capability availability
* consumer readiness
* feature adoption in a consuming context

Avoid metrics that are merely implementation inventories, such as:

* number of files
* number of helper utilities
* number of spans
* number of internal patterns applied

---

## Requirement Language

All functional and non-functional requirements follow the **EARS (Easy Approach to Requirements Syntax)** pattern with **"The system shall"** as the canonical subject.

| EARS Type          | Abbreviation | Template                                               | When to Use                                              |
| ------------------ | ------------ | ------------------------------------------------------ | -------------------------------------------------------- |
| Ubiquitous         | U            | The system shall [verb]                                | Always-active feature behaviour                          |
| Event-Driven       | E            | When [event], the system shall [verb]                  | Behaviour triggered by a scenario or input event         |
| Unwanted Behaviour | UB           | If [condition], the system shall [verb]                | Invalid input, failure handling, fallback behaviour      |
| State-Driven       | S            | While [state], the system shall [verb]                 | Behaviour dependent on an ongoing feature state          |
| Optional Feature   | O            | Where [feature/configuration], the system shall [verb] | Behaviour gated by feature availability or configuration |

### Atomicity Rule

Each requirement row must express **exactly one feature-level testable obligation**.

Split requirements when they combine multiple **independent outcomes or behaviors**.

Do **not** split a requirement merely because the internal implementation contains multiple internal steps.

### Requirement Quality Rule

Every requirement should remain valid even if the internal implementation is refactored, as long as the feature behavior remains the same.

If a requirement would become false simply because function names, helper methods, or file structure changed, rewrite it at a higher level.

---

## Section-Specific Authoring Guidance

### Functional Requirements Guidance

Write functional requirements in terms of:

* supported feature capabilities
* validation behaviour
* success behaviour
* failure behaviour
* scenario coverage
* feature boundary rules

Do **not** write functional requirements in terms of:

* exact function/type/schema names
* exact helper methods
* exact SDK calls
* exact internal module boundaries
* exact tracing or testing mechanics

### Non-Functional Requirements Guidance

Only include NFRs that are meaningfully specific to the feature.

Write NFRs in terms of:

* feature-level security/privacy expectations
* feature-level correctness expectations
* feature-level compatibility expectations
* feature-level testability expectations
* feature-level usability expectations
* performance or observability only where materially relevant

Do **not** restate generic coding standards or implementation rules as feature NFRs.

### Constraints & Dependencies Guidance

Include only constraints and dependencies that materially affect the feature.

Good examples include:

* external platform or library dependencies relevant to the feature boundary
* shared capability dependencies
* compatibility constraints
* release-scope limitations
* feature-boundary constraints

Do **not** list internal modules, helper utilities, or file-structure rules unless they are externally meaningful to the feature boundary.

---

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

[Specific problem this feature solves within the parent initiative, written in capability and consumer terms rather than implementation terms.]

---

## Goals & Success Metrics

### Feature Objectives

- [How this feature contributes to the parent initiative]
- [What capability or outcome this feature delivers]
- [What important consumer or product problem it resolves]

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| [Outcome-oriented metric] | [Target value] | [How measured] |
| [Capability readiness metric] | [Target value] | [How measured] |

---

## User Context

### Target User Segment(s)

- [Relevant user segment]: [How they use or depend on this feature]

### User Journey for This Feature

[Describe the consumer interaction flow and outcomes at a high level. Do not narrate internal pipeline steps.]

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| [Scenario 1] | [Description] | [Outcome] |
| [Scenario 2] | [Description] | [Outcome] |

---

## Functional Requirements

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-001 | U | The system shall [feature-level behaviour] | Must-Have | |
| FR-002 | E | When [feature scenario], the system shall [behaviour/outcome] | Must-Have | |
| FR-003 | UB | If [invalid input or failure condition], the system shall [failure behaviour] | Must-Have | |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| ID | Category | EARS Type | Requirement | Priority |
|----|----------|-----------|-------------|----------|
| NFR-001 | Security | U | The system shall protect sensitive feature data from exposure in logs, examples, and failure metadata. | Must-Have |
| NFR-002 | Correctness | U | The system shall validate feature inputs before attempting external authentication execution. | Must-Have |
| NFR-003 | Compatibility | U | The system shall remain compatible with the supported product dependencies relevant to this feature. | Must-Have |
| NFR-004 | Testability | U | The feature shall support isolated automated validation of its release-scope behaviours. | Must-Have |

---

## Scope

### In Scope

- [Capability or scenario 1]
- [Capability or scenario 2]

### Out of Scope

- [Adjacent capability not owned by this feature]
- [Deeper implementation detail not defined here]
- [Related features covered by separate FRDs]

---

## Constraints & Dependencies

### Feature Constraints

- [Feature-level constraint relevant to behaviour, scope, or compatibility]

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| [Relevant dependency] | Feature / API / Service / Capability | [Owner] | [Status] |

---

## Acceptance Criteria Outline

- [ ] [High-level success criterion]
- [ ] [Important validation or failure criterion]
- [ ] [Important scenario coverage criterion]

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | [Consumer need stated as a story] | Must-Have | [Status] |
| US-002 | [Consumer need stated as a story] | Should-Have | [Status] |

*Full user story documents are maintained separately.*

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| [Question 1] | [Name] | [Date] | [Pending/Resolved] |

If there are no real open questions, omit this section instead of filling it with placeholder rows.

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

---

## Examples

### Bad Requirement Examples

* The system shall define `signUpEmailServerController` as a function that accepts unknown input.
* When the controller receives input, the system shall decode it through `Schema.decodeUnknown`.
* When decode succeeds, the system shall delegate via `Effect.flatMap`.
* The system shall annotate the pipeline with `Effect.withSpan`.
* The system shall place each operation in its own directory.

### Good Requirement Examples

* The system shall support credential-based email sign-up within the product boundary.
* When valid sign-up input is provided, the system shall create a new email-authenticated account through the supported authentication foundation.
* If sign-up input is invalid, the system shall reject the request with a structured validation failure.
* If credential authentication cannot be completed, the system shall return a structured failure suitable for consumer handling.
* The system shall support sign-in and sign-out for email-authenticated users within the release scope.

---

## Quality Criteria

* [ ] Parent initiative referenced with link to IRD
* [ ] Problem statement written at the feature-capability level
* [ ] User journey and scenarios written from the consumer perspective
* [ ] All requirements use EARS syntax with "The system shall" as the canonical subject
* [ ] Every requirement row is atomic at the **feature-behavior** level, not the implementation-step level
* [ ] Functional requirements describe supported capabilities, validations, outcomes, and failure behavior
* [ ] Functional requirements do **not** mention exact functions, classes, schemas, helper methods, SDK calls, file structures, or internal pipeline steps
* [ ] Functional requirements avoid duplication across similar scenarios
* [ ] Non-functional requirements are feature-specific and outcome-oriented
* [ ] Scope is stated in capability terms, not code artefact terms
* [ ] Constraints and dependencies are materially relevant to the feature boundary
* [ ] User stories identified and prioritized where applicable
* [ ] Technical feasibility reviewed with engineering
* [ ] The document remains true even if internal implementation is refactored without changing feature behavior
