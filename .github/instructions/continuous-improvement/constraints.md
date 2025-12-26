# 2️⃣ Your Constraints (practical & architectural)

These are **constraints you’re operating under**, not stylistic preferences.

## C1. Runtime-driven schemas

- Validation schemas depend on:
  - runtime `authServer` config
  - plugin-defined additional fields

- Compile-time typing cannot fully represent all fields

## C2. Additional fields strategy

- Unknown keys:
  - allowed in input
  - **ignored** unless configured

- Only configured fields:
  - are validated
  - may be required

- Unknown field types → `Schema.Unknown`

## C3. Strict adapter semantics

- Server adapters must:
  - extract transport context
  - validate it strictly
  - fail early

- Adapters are allowed to be strict even if downstream APIs are lenient

## C4. Shared core across client & server

- Same `*CommandSchema` is used for:
  - authClient (body-only)
  - authServer (via adapter)

- Divergence is handled via adapters, not forks

## C5. Minimal hidden magic

- No “accept many shapes” controller inputs
- No implicit nesting or guessing
- Every accepted shape is **explicitly adapted**

## C6. Refactor-friendly error handling

- Early failures (e.g. missing `body`) are structured so they can later be:
  - formatted
  - logged
  - adapted (e.g. to HTTP responses)
