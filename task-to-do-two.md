# ✅ Copilot Chat Prompt

> **Context**
>
> We are in a TypeScript repo using the Effect ecosystem. Our code uses:
>
> - `effect/Effect`
> - `effect/Function` (`pipe`)
>
> All “adapter helper” functions must:
>
> - take **exactly one argument**
> - perform **exactly one action**
> - return an `Effect` (or subtype). In this task, return `Effect.Effect`.
>
> We are implementing strict server-side adapter helpers for Better Auth “signUpEmail” endpoint.
>
> Strictness requirements:
>
> - If `rawParams` is not an object → fail with `EmailAuthServerInputError`
> - If `rawParams.body` is missing/undefined → fail with `EmailAuthServerInputError`
> - Transport ctx extraction is **strict**:
>   - `headers` is **optional**, but if present must be `instanceof Headers` else fail
>   - `asResponse` is optional, but if present must be boolean else fail
>   - `returnHeaders` is optional, but if present must be boolean else fail
>
> These helpers will be used by a strict server wrapper controller:
>
> ```ts
> export const signUpEmailServerController = (rawParams: unknown) =>
>   Effect.gen(function* (_) {
>     const rawBody = yield* _(extractBodyStrict(rawParams));
>     const ctx = yield* _(extractSignUpCtxStrict(rawParams));
>
>     const cmd = yield* _(decodeSignUpEmailCommand(rawBody));
>     return yield* _(signUpEmailServerServiceFromCommandWithCtx(cmd, ctx));
>   });
> ```
>
> Existing types/functions in repo (import and use them, don’t redefine):
>
> - `EmailAuthServerInputError` (domain error)
> - `decodeSignUpEmailCommand(rawBody: unknown)` (shared decode core)
> - `signUpEmailServerServiceFromCommandWithCtx(cmd, ctx)` (server service boundary)
>
> ---
>
> **Task**
>
> Implement the following helper functions (prefer putting them in a file like `signUpEmail.adapters.ts` or a shared `serverAdapters.ts` if you already have one):
>
> 1. `ensureRecord(message)(u)`
>    - Unary function factory
>    - Ensures `u` is a non-null object
>    - Returns `Effect.Effect<Readonly<Record<string, unknown>>, EmailAuthServerInputError>`
>
> 2. `getPropE(key)(record)`
>    - Unary function factory
>    - Reads record[key] and returns it inside Effect
>    - Returns `Effect.Effect<unknown, never>`
>
> 3. `requireDefined(message)(u)`
>    - Unary function factory
>    - Fails if `u === undefined`
>    - Returns `Effect.Effect<unknown, EmailAuthServerInputError>`
>
> 4. `optionalOf(validate)(u)`
>    - Unary function factory
>    - If `u === undefined`, succeed with `undefined`
>    - Else run `validate(u)`
>    - Returns `Effect.Effect<A | undefined, EmailAuthServerInputError>`
>
> 5. `requireBoolean(message)(u)`
>    - Unary function factory
>    - Succeeds only if `typeof u === "boolean"`
>    - Returns `Effect.Effect<boolean, EmailAuthServerInputError>`
>
> 6. `requireHeaders(message)(u)`
>    - Unary function factory
>    - Succeeds only if `u instanceof Headers`
>    - Returns `Effect.Effect<Headers, EmailAuthServerInputError>`
>
> Then implement strict composed extractors:
>
> 7. `extractBodyStrict(rawParams)`
>    - Uses `pipe` and helpers above
>    - Must fail if rawParams not object
>    - Must fail if `body` missing/undefined
>    - Returns `Effect.Effect<unknown, EmailAuthServerInputError>`
>
> 8. `extractSignUpCtxStrict(rawParams)`
>    - Uses `pipe` and helpers above
>    - Must fail if rawParams not object
>    - Must return:
>
>      ```ts
>      export type SignUpTransportCtx = Readonly<{
>        headers?: Headers;
>        asResponse?: boolean;
>        returnHeaders?: boolean;
>      }>;
>      ```
>
>    - Each field is optional but strictly typed if provided, otherwise fail with `EmailAuthServerInputError`
>    - Returns `Effect.Effect<SignUpTransportCtx, EmailAuthServerInputError>`
>
> Implementation constraints:
>
> - Use imports:
>
>   ```ts
>   import * as Effect from "effect/Effect";
>   import { pipe } from "effect/Function";
>   ```
>
> - Keep helpers generic/reusable (not hard-coded to sign-up only except the composed extractors)
> - Keep each helper to a single responsibility
> - Ensure TypeScript compiles
>
> Finally, update/create the strict server wrapper controller `signUpEmailServerController` to use:
>
> - `extractBodyStrict`
> - `extractSignUpCtxStrict`
>   and then call `decodeSignUpEmailCommand` and `signUpEmailServerServiceFromCommandWithCtx` as shown above.
>
> **Output**
>
> Provide the updated/new code (files or patches) implementing all helpers and extractors, with correct imports and exported symbols.
