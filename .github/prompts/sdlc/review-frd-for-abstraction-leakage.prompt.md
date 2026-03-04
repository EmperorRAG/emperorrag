---
description: 'Review a Feature Requirements Document (FRD) for abstraction leakage, implementation-detail drift, and misalignment with the intended purpose of an FRD.'
agent: 'agent'
tools: [vscode/askQuestions, read/readFile, agent, search/changes, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, todo]
---

# Review FRD for Abstraction Leakage

Review the provided **Feature Requirements Document (FRD)** against the purpose of a feature requirements document.

## Inputs

* **FRD to Review**: ${input:frdFile:Link or pasted content of the FRD to review}
* **Parent IRD**: ${input:parentIRD:Link or pasted content of the parent Initiative Requirements Document}
* **Optional Supporting Context**:

  * Product Vision: ${input:productVision:Link or pasted content of the product vision}
  * Product Roadmap: ${input:productRoadmap:Link or pasted content of the product roadmap}
  * ADRs / Technical Specs: ${input:adrsTechnicalSpecs:Link or pasted content of ADRs or technical specs, only if needed for context}

## Task

Review the FRD and determine whether it is written at the **feature capability level** or whether it has drifted into:

* implementation detail
* low-level design
* architecture specification
* pipeline execution trace
* code-structure rules
* technical standards better placed elsewhere

The goal of this review is to identify whether the FRD still adheres to the intention and purpose of a feature requirements document.

---

## Review Standard

A correct FRD should describe:

* what the feature must do
* what scenarios it must support
* what outcomes it must provide
* how invalid input and failure conditions must be handled at the feature level
* what feature-specific quality expectations apply
* what is in and out of scope

A correct FRD should **not** describe:

* exact function, class, interface, schema, tag, or type names
* exact file, folder, module, or barrel structure
* exact library methods, helpers, or combinators
* internal execution flow such as decode → map → delegate → annotate
* exact dependency-resolution mechanics
* exact test-file inventories or code artefact counts
* detailed architecture patterns that belong in ADRs or technical specs

---

## Required Review Process

### 1. Identify the Intended Feature Boundary

From the FRD and parent IRD, determine:

* what feature or capability area the FRD is supposed to cover
* which initiative-level requirements it is supposed to support
* which adjacent capabilities belong elsewhere

Then judge whether the FRD stays inside that boundary or drifts into adjacent areas or lower-level design.

### 2. Check the Abstraction Level of Each Major Section

Review each FRD section and determine whether it is written at the correct level:

* Overview
* Problem Statement
* Goals & Success Metrics
* User Context
* Functional Requirements
* Non-Functional Requirements
* Scope
* Constraints & Dependencies
* Acceptance Criteria Outline
* User Stories
* Open Questions
* Related Documentation

For each section, determine whether it is:

* correctly feature-level
* somewhat too technical
* strongly implementation-oriented
* misplaced entirely

### 3. Inspect Functional Requirements for Leakage

Review every functional requirement and check whether it describes:

* a feature capability
* a validation behavior
* a success outcome
* a failure outcome
* a boundary rule

or whether it instead describes:

* a function to define
* a helper to call
* a schema to decode with
* a service/controller/internal layer to invoke
* a file or folder to create
* an annotation or tracing hook to apply
* a specific SDK method to call

Mark any such cases as abstraction leakage.

### 4. Inspect NFRs for Misclassification

Review all NFRs and determine whether they are truly feature-level quality expectations, or whether they are actually:

* coding standards
* architecture rules
* technical constraints
* implementation conventions
* documentation standards
* test-framework instructions

If an NFR would fit better in an ADR, technical standard, or definition of done, flag it.

### 5. Inspect Scope for Capability vs Artefact Drift

Review **In Scope** and **Out of Scope** and determine whether they list:

* capabilities and scenarios
  or
* code artefacts and implementation items

If the scope is framed in terms of controllers, services, schemas, files, annotations, or internal modules, flag it as misaligned.

### 6. Run the Refactor Test

For each important requirement and section, apply this question:

**Would this still be true if the internal implementation were refactored without changing feature behavior?**

* If yes, it likely belongs in the FRD.
* If no, it is probably implementation detail and should be moved or rewritten.

### 7. Run the Duplication Check

Check whether the FRD repeats the same pattern multiple times with only renamed operations or internal components.

If repeated requirements differ only by implementation substitution, flag them as likely implementation-template duplication rather than true feature requirements.

### 8. Run the User-Perspective Check

Check whether the FRD is written from the perspective of:

* a consumer using the feature
* a system providing a capability
* a feature boundary inside the product

or instead from the perspective of:

* how the engineer should code it
* how the internal pipeline executes
* how files and modules should be arranged

Flag any section that reads like implementation guidance instead of feature requirements.

---

## Abstraction Leakage Indicators

Flag content if it includes items such as:

* exact function names
* exact class or type names
* exact schema names
* exact tag names
* exact helper names
* exact SDK method names
* exact library combinators
* exact controller/service terminology used as requirement content
* exact file or folder structure
* exact barrel/export rules
* exact test file counts or structure
* exact tracing or instrumentation function names
* exact dependency injection mechanism details
* internal pipeline sequencing

The presence of these does **not automatically** make the FRD invalid, but each one must be challenged and justified. If it can be removed without losing feature meaning, it should be removed.

---

## Severity Levels

Use the following severity levels when reporting issues:

* **High** — fundamentally misaligns the FRD with its purpose
* **Medium** — noticeably too technical or misplaced, but salvageable with rewrite
* **Low** — minor drift, wording issue, or optional cleanup

---

## Output Format

Produce the review in the following structure.

### 1. Overall Verdict

State whether the FRD is:

* appropriately written as an FRD
* partially misaligned
* strongly misaligned and functioning more like a technical design document

### 2. Executive Summary

Summarize the most important issues in a few concise bullets.

### 3. Section-by-Section Review

For each major section, provide:

* **Assessment**
* **What is working**
* **What is leaking or misplaced**
* **Severity**
* **Recommended correction**

### 4. Functional Requirements Leakage Review

Create a table like this:

| Requirement ID | Issue Type            | Severity | Why It Is Misaligned                                  | Recommended Rewrite Direction                |
| -------------- | --------------------- | -------- | ----------------------------------------------------- | -------------------------------------------- |
| FR-001         | Implementation detail | High     | Names an exact function instead of a feature behavior | Rewrite as capability or outcome requirement |

If many requirements share the same problem, you may group them into ranges.

### 5. Non-Functional Requirements Review

Create a table like this:

| NFR ID  | Issue Type                       | Severity | Why It Is Misaligned                               | Better Home              |
| ------- | -------------------------------- | -------- | -------------------------------------------------- | ------------------------ |
| NFR-001 | Coding standard disguised as NFR | Medium   | Describes implementation rule, not feature quality | Technical standard / ADR |

### 6. Scope and Dependency Review

State whether Scope, Constraints, and Dependencies are framed in:

* capability terms
* or artefact / implementation terms

Then list specific corrections needed.

### 7. Refactor Test Result

Provide a short conclusion on whether the FRD would remain valid through internal refactoring.

### 8. Rewrite Guidance

Provide concise guidance on how to revise the FRD so that it:

* returns to the feature level
* preserves the real feature intent
* moves technical detail into more appropriate document types

### 9. Optional Clean Rewrite Recommendation

If the FRD is heavily misaligned, provide a brief recommendation for how to restructure it, such as:

* reduce FR count
* merge repeated implementation-shaped requirements
* rewrite scope in capability terms
* move technical content to ADR / technical spec / test spec

---

## Review Rules

* Be strict about the abstraction boundary.
* Prefer feature behavior over implementation mechanism.
* Do not assume that EARS syntax alone makes a requirement appropriate.
* A requirement can be syntactically correct and still be conceptually misplaced.
* Treat duplication caused by architecture templates as a smell.
* Judge the document by whether it matches the purpose of an FRD, not whether the implementation details are technically correct.

---

## Final Instruction

Produce only the review in markdown within the GitHub Copilot chat view.
