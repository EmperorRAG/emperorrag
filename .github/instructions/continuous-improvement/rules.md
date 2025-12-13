# 1️⃣ Your Rules (non-negotiable design rules)

These are **intentional rules you’ve enforced** across the architecture.

## R1. Effect-first execution model

* All executable logic returns **`Effect` or a subtype** (`Effect`, `Either`, `Option`)
* No thrown exceptions for control flow
* No ad-hoc Promise usage outside `Effect.tryPromise`

## R2. Unary, single-responsibility helpers

* Helper functions:

  * take **exactly one argument**
  * perform **exactly one action**
  * return the transformed value (inside `Effect`)
* Composition is done via `pipe`, never by branching inside helpers

## R3. Explicit boundaries

* **Domain intent ≠ transport**
* Transport concerns (headers, flags, HTTP semantics) must never appear in:

  * Commands
  * Domain services
* Transport is handled by **adapters / wrappers only**

## R4. Strict validation at boundaries

* Server wrapper:

  * fails if input is not an object
  * fails if `body` is missing
* Optional fields:

  * allowed to be absent
  * **must be strictly typed if present**
* Invalid input never reaches domain logic

## R5. Commands represent intent only

* `*Command` types:

  * model **what action is being requested**
  * are body-only
  * contain no adapter or framework artifacts
* Commands are immutable, tagged domain values

## R6. Schemas are the single source of truth

* Validation, normalization, and construction are centralized in:

  * **Effect Schema**
* No duplication between:

  * runtime validation
  * domain construction
  * type definitions

## R7. API params are API-layer only

* `AuthServerApi*Params`:

  * are **Better Auth specific**
  * exist only at the service boundary
* Domain logic never consumes API param types

## R8. Errors are domain-modeled

* Failures are values, not strings:

  * `EmailAuthServerInputError`
  * `EmailAuthServerApiError`
  * etc.
* Error creation and mapping is explicit and composable
