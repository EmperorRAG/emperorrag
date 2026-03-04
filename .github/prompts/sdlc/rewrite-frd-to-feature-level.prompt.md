---
description: 'Rewrite an existing Feature Requirements Document (FRD) so it adheres to the purpose of an FRD by removing implementation-detail leakage and restoring feature-level abstraction.'
agent: 'agent'
tools: [vscode/askQuestions, read/readFile, agent, edit/editFiles, search/changes, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, todo]
---

# Rewrite FRD to Feature Level

Rewrite the provided **Feature Requirements Document (FRD)** so that it properly functions as a **feature requirements document** rather than a low-level design, implementation blueprint, or architecture specification.

## Inputs

* **FRD to Rewrite**: ${input:frdFile:Link or pasted content of the FRD to rewrite}
* **Parent IRD**: ${input:parentIRD:Link or pasted content of the parent Initiative Requirements Document}
* **Optional Supporting Context**:

  * Product Vision: ${input:productVision:Link or pasted content of the product vision}
  * Product Roadmap: ${input:productRoadmap:Link or pasted content of the product roadmap}
  * FRD Review Output: ${input:frdReviewOutput:Link or pasted content of the FRD review output, if available}
  * ADRs / Technical Specs: ${input:adrsTechnicalSpecs:Link or pasted content of ADRs or technical specs, only if needed for context}

## Task

Transform the FRD into a corrected version that:

* preserves the true feature intent
* stays aligned to the parent IRD
* remains at the **feature capability level**
* removes implementation-detail leakage
* rewrites requirements so they describe **feature behavior, outcomes, validation, failure handling, and scope**
* keeps only the level of detail appropriate for an FRD

The rewritten FRD must still be specific and useful, but it must no longer read like a technical design document.

---

## Rewrite Standard

A correct FRD should describe:

* what the feature must do
* what scenarios it must support
* what outcomes it must provide
* what invalid-input and failure conditions matter
* what feature-specific quality expectations apply
* what is in and out of scope

A correct FRD should **not** describe:

* exact function, class, interface, schema, tag, or type names
* exact file, folder, module, or barrel structure
* exact helper methods, combinators, or SDK calls
* internal pipeline flow such as decode → map → delegate → annotate
* exact dependency injection mechanics
* exact test file structure or file counts
* code-structure obligations better placed in ADRs or technical specs

---

## Required Rewrite Workflow

### 1. Identify the Intended Feature Boundary

Determine from the FRD and parent IRD:

* what feature or capability area the document is supposed to cover
* which initiative-level requirements it supports
* which adjacent capabilities belong elsewhere

Preserve this boundary in the rewrite.

### 2. Separate Intent from Leakage

Before rewriting, distinguish between:

* **valid feature intent** that should be preserved
* **implementation leakage** that should be removed or rewritten upward

Preserve:

* real capability scope
* real user/consumer scenarios
* real validation needs
* real success outcomes
* real failure outcomes
* real feature-specific quality expectations

Remove or rewrite:

* exact code artefacts
* exact internal naming
* exact internal sequencing
* exact library calls
* exact file/test/module structure

### 3. Rebuild the Problem Statement at the Feature Level

Rewrite the problem statement so it explains:

* the feature problem within the initiative
* the consumer or system need it addresses
* why this feature matters

Do **not** explain the problem as missing controllers, schemas, services, tags, or helper utilities.

### 4. Rebuild Goals and Metrics Around Outcomes

Rewrite goals and success metrics so they reflect:

* capability delivery
* supported scenarios
* consumer readiness
* feature usefulness
* meaningful validation of outcomes

Do **not** use internal inventory metrics such as:

* file counts
* helper counts
* annotation counts
* controller/service/type trio counts

### 5. Rebuild User Context from the Consumer Perspective

Rewrite user journeys and scenarios so they describe:

* who is using the feature
* what they are trying to achieve
* what outcomes they expect
* what failure paths matter

Do **not** narrate internal execution flows through schemas, services, contexts, helpers, or combinators.

### 6. Rewrite Functional Requirements to Feature Behavior

Rewrite every functional requirement so it describes one **feature-level testable obligation**.

Functional requirements should cover:

* supported feature capabilities
* success behavior
* validation behavior
* failure behavior
* boundary rules

Functional requirements must **not** describe:

* functions to define
* helpers to call
* schemas to decode with
* services/controllers to invoke
* exact SDK methods
* annotations to apply
* files or folders to create

Where multiple requirements differ only by internal implementation substitutions, merge them into higher-level capability or behavior requirements.

### 7. Rewrite NFRs to Feature-Specific Quality Expectations

Retain only NFRs that are meaningfully feature-specific, such as:

* security/privacy handling for this feature
* correctness expectations
* compatibility expectations relevant to this feature
* testability expectations for release-scope feature behavior
* usability expectations
* performance only if there is a meaningful feature-specific target
* observability only if materially relevant at the feature level

Remove or relocate NFRs that are actually:

* coding standards
* architecture rules
* implementation conventions
* documentation standards
* test-framework instructions

### 8. Rewrite Scope in Capability Terms

Rewrite **In Scope** and **Out of Scope** so they list:

* capabilities
* supported scenarios
* adjacent excluded features
* feature-boundary exclusions

Do **not** list internal artefacts such as:

* controllers
* services
* schemas
* helper utilities
* annotations
* barrels
* spec files

### 9. Rewrite Constraints and Dependencies Carefully

Keep only constraints and dependencies that materially affect:

* feature behavior
* feature delivery
* compatibility
* scope boundaries
* release-scope limitations

Remove or rewrite constraints that are purely about:

* internal module structure
* exact helper usage
* exact tags or combinators
* exact file organization

### 10. Run the Refactor Test

For every major section and requirement, apply this question:

**Would this still be true if the internal implementation were refactored without changing feature behavior?**

* If yes, keep it.
* If no, rewrite it at a higher level or remove it.

### 11. Run the Minimal-Change Principle

Do not rewrite the FRD more aggressively than necessary.

* Preserve correct content that already matches FRD purpose.
* Revise only what is needed to restore abstraction, reduce duplication, and align the document to FRD intent.
* Prefer improving the existing document over replacing its meaning.

---

## Rewrite Rules

### Keep

* feature name
* parent initiative alignment
* true feature intent
* valid scenarios and outcomes
* useful scope boundaries
* useful dependencies
* user stories where they remain feature-level
* EARS syntax where it still fits the corrected requirement

### Remove or Rewrite

* exact function names
* exact class/type/schema/tag names
* exact helper names
* exact SDK method names
* exact combinators
* controller/service/module/file structure requirements
* test file inventories
* tracing/instrumentation function names
* internal sequencing steps
* duplicated requirements caused by implementation templates

### Requirement Rule

Each requirement must remain:

* **testable**
* **feature-level**
* **refactor-stable**
* **non-duplicative**
* **aligned to the parent IRD**

---

## EARS Requirement Rule

All functional and non-functional requirements must use **EARS** with **"The system shall"** as the canonical subject.

Use these forms:

* **Ubiquitous (U):** The system shall [verb]
* **Event-Driven (E):** When [event], the system shall [verb]
* **Unwanted Behaviour (UB):** If [condition], the system shall [verb]
* **State-Driven (S):** While [state], the system shall [verb]
* **Optional Feature (O):** Where [feature/configuration], the system shall [verb]

### Atomicity Rule

Each requirement row must express **exactly one feature-level testable obligation**.

Do **not** split requirements merely because the underlying implementation contains multiple internal steps.

---

## Desired Output Shape

The rewritten FRD should contain:

1. Overview
2. Problem Statement
3. Goals & Success Metrics
4. User Context
5. Functional Requirements
6. Non-Functional Requirements (Feature-Specific)
7. Scope
8. Constraints & Dependencies
9. Acceptance Criteria Outline
10. User Stories
11. Open Questions (omit if none)
12. Related Documentation
13. Approval

---

## Final Validation Checklist

Before modifying the FRD to be rewritten, confirm that:

* the feature boundary is preserved and aligned to the parent IRD
* the problem statement is written at the feature-capability level
* the user context is written from the consumer perspective
* the functional requirements describe capabilities, validations, outcomes, and failure behavior
* the functional requirements do **not** contain implementation-detail leakage
* the NFRs are feature-specific and outcome-oriented
* the scope is written in capability terms
* the document would remain valid through internal refactoring
* the document now behaves like an FRD rather than a technical design document
* unnecessary duplication has been removed

## Output Instruction

Modify only the FRD to be rewritten.
