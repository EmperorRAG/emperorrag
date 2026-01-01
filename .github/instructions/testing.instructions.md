---
description: "Testing instructions for coding standards and best practices."
applyTo: "**/*.test.ts, **/*.spec.ts"
---

# Testing

Instructions for writing and maintaining tests in this repository.

## Critical Instructions

### Happy Path Integrity

- Implement requested success scenarios as genuine happy paths.
- If a requested test case cannot be implemented as a happy path due to missing tooling or prerequisites (for example, you cannot create a required user state such as a password-less user), stop and inform the user of the limitation.
- Do not change a test labeled as a success scenario to assert on a failure condition (for example, expecting a 400 error) just to force a passing test.

### Prerequisite Verification & No Workarounds

- Before writing a test, verify that the necessary helpers, factories, or state setup tools exist.
- If they are missing, stop and report the gap.
- Do not implement complex workarounds to force a test state. This includes, but is not limited to:

  - Manual database insertions or modifications.
  - Mocking internal APIs or private methods of the system under test (for example, `authServer.api.method = mock`).

    - Exception: Use supported configuration hooks provided by `setupServerTestEnvironment` or `setupClientTestEnvironment` (for example, `sendResetPassword`, `sendVerificationEmail`).

  - Overriding read-only properties.
  - Creating partial objects that do not satisfy the full interface.

- If the system cannot be tested in its current state without these hacks, report the limitation instead of implementing the workaround.