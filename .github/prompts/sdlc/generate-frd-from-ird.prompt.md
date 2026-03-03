---
description: 'Generate a Feature Requirements Document (FRD) from a parent Initiative Requirements Document (IRD) while preserving feature-level abstraction and avoiding implementation-detail leakage.'
agent: 'agent'
tools: [vscode/askQuestions, read/readFile, agent, edit/createFile, edit/editFiles, search/changes, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, todo]
---

# Generate FRD from IRD

Create a **Feature Requirements Document (FRD)** for the feature named below using the linked or provided **Initiative Requirements Document (IRD)** as the primary source of truth.

## Inputs

* **Feature Name**: ${input:featureName:Name of the feature or capability area this FRD will cover}
* **Parent IRD**: ${input:parentIRD:Link or pasted content of the parent Initiative Requirements Document}
* **Optional Supporting Context**:

  * Product Vision: ${input:productVision:Link or pasted content of the product vision}
  * Product Roadmap: ${input:productRoadmap:Link or pasted content of the product roadmap}
  * ADRs / Technical Specs: ${input:adrsTechnicalSpecs:Link or pasted content of ADRs or technical specs, only if needed for context}

## Task

Generate an FRD that adheres to the purpose of a **feature requirements document**.

The FRD must describe:

* what the feature must do
* what scenarios it must support
* what outcomes it must provide
* how invalid input and failure conditions must be handled at the feature level
* what feature-specific quality expectations apply
* what is in and out of scope for the feature

The FRD must **not** become a low-level design, implementation blueprint, execution trace, or code-structure specification.

---

## Required Workflow

### 1. Identify the Feature Boundary

Determine exactly which **feature or capability area** this FRD is responsible for.

Define the boundary in terms of:

* the capability area being delivered
* the scenarios the feature must support
* the adjacent capabilities that belong to other FRDs
* the initiative-level requirements this feature helps satisfy

Do **not** define the feature boundary in terms of operations, functions, modules, or files.

### 2. Extract Only the Relevant IRD Content

From the parent IRD, extract only the content relevant to this feature:

* relevant problem context
* relevant user segments
* relevant initiative goals
* relevant initiative-level requirements
* relevant quality expectations
* relevant constraints
* relevant dependencies
* relevant scope boundaries

Do **not** restate the whole IRD.

### 3. Translate Initiative Intent into Feature Intent

Convert the extracted IRD content into a feature-specific understanding of:

* what this feature contributes to the initiative
* what capability this feature must provide
* what consumer need or scenario this feature addresses
* what success looks like for this feature

Keep this at the **feature capability level**.

### 4. Derive Consumer Scenarios Before Requirements

Before writing requirements, identify the main consumer scenarios the feature must support.

For each scenario, determine:

* who is using the feature
* what they are trying to achieve
* what valid outcome they expect
* what invalid or failure conditions matter

Write scenarios from the **consumer perspective**, not as an internal execution walkthrough.

### 5. Derive Functional Requirements from Capability and Scenarios

Create functional requirements by combining:

* the feature boundary
* relevant initiative-level requirements
* supported consumer scenarios
* needed success, validation, and failure behaviors

Functional requirements should generally cover:

* capability requirements
* success behavior requirements
* validation requirements
* failure requirements
* feature boundary requirements

Write the **smallest number of requirements needed** to fully describe the feature.

Do **not** derive requirements from internal pipeline steps, helper methods, or code structure.

### 6. Derive Feature-Specific NFRs from Quality Expectations

Start from the parent IRD’s quality expectations, then include only the NFRs that are meaningfully specific to this feature.

Possible categories include:

* security/privacy
* correctness
* compatibility
* testability
* usability
* performance, only where there is a meaningful feature-specific target
* observability, only where materially relevant at feature level

Do **not** restate coding standards or architecture rules as NFRs.

### 7. Define Scope in Capability Terms

Populate **In Scope** and **Out of Scope** using:

* supported capability areas
* supported scenarios
* excluded adjacent features
* explicit feature-boundary exclusions

Do **not** list:

* files
* folders
* controllers
* services
* schemas
* helper utilities
* annotations
* test-file inventories

### 8. Define Constraints and Dependencies Carefully

Include only constraints and dependencies that materially affect the feature’s delivery or behavior.

Good examples:

* dependency on a shared capability area
* dependency on an external platform capability
* compatibility constraints
* feature-boundary constraints
* release-scope limitations

Bad examples:

* exact helper modules
* exact internal tags
* exact combinators
* exact file-structure rules

### 9. Run the Refactor Test

Before finalizing the FRD, check every requirement and section against this question:

**Would this still be true if the internal implementation were refactored without changing feature behavior?**

* If yes, it likely belongs in the FRD.
* If no, move it out or rewrite it at a higher level.

### 10. Run the Anti-Pattern Check

Before final output, remove or rewrite any content that includes:

* exact function names
* exact class, schema, tag, or type names
* exact SDK method names
* exact helper names
* exact library combinators
* exact file or folder structure
* exact controller/service/test-file expectations
* internal pipeline sequencing

If any of those details are present, revise the document upward.

---

## FRD Output Rules

### Keep the document at the feature level

Write in terms of:

* feature capabilities
* consumer-visible behavior
* system outcomes
* input validation behavior
* failure behavior
* scope boundaries
* feature-level quality expectations

Do **not** write in terms of:

* exact implementation structure
* exact internal naming
* exact library calls
* exact schema composition details
* exact observability hooks
* exact test suite structure
* exact dependency-resolution mechanisms

### Use EARS syntax for requirements

All functional and non-functional requirements must use **EARS** with **"The system shall"** as the canonical subject.

Use these forms:

* **Ubiquitous (U):** The system shall [verb]
* **Event-Driven (E):** When [event], the system shall [verb]
* **Unwanted Behaviour (UB):** If [condition], the system shall [verb]
* **State-Driven (S):** While [state], the system shall [verb]
* **Optional Feature (O):** Where [feature/configuration], the system shall [verb]

### Apply the correct atomicity rule

Each requirement row must express **exactly one feature-level testable obligation**.

Split requirements when they contain multiple **independent outcomes or behaviors**.

Do **not** split requirements merely because the internal implementation contains multiple internal steps.

### Minimize duplication

Do not repeat the same implementation-shaped pattern across multiple rows with only renamed operations or internal components.

Group requirements at the shared capability level wherever possible.

---

## Mandatory Exclusions

Do **not** include any of the following in the FRD unless absolutely unavoidable for feature comprehension:

* function names
* class names
* schema names
* tag names
* helper names
* SDK method names
* exact module/file/folder/barrel structure
* exact internal architecture sequencing
* exact test file counts or test file structure
* exact tracing or instrumentation function names
* exact dependency injection mechanics

If such content appears, rewrite it.

---

## Desired Document Shape

The FRD should contain:

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

Before outputting the FRD, confirm that:

* the feature boundary is derived from the IRD
* the FRD stays aligned to the parent initiative
* the problem statement is written at the feature-capability level
* the user journey is written from the consumer perspective
* the functional requirements describe supported capabilities, validations, outcomes, and failure behavior
* the functional requirements do **not** mention exact internal implementation details
* the NFRs are feature-specific and outcome-oriented
* the scope is written in capability terms, not code-artefact terms
* the document would remain valid if the internal implementation were refactored
* the document reflects the purpose of an FRD rather than a technical design document

## Output Instruction

Produce only the completed FRD in markdown.
