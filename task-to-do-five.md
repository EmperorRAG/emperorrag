# Copilot prompt

> Implement a reusable “Command → API Params adapter pipeline” system using `effect/Schema` and `Schema.transformOrFail`.
>
> Requirements:
>
> 1. Use `Schema.instanceOf(Headers)` for strict headers validation (optional but typed if present).
> 2. Create `TransportCtx` as `Schema.TaggedClass` with fields:
>    - headers?: Headers
>    - asResponse?: boolean
>    - returnHeaders?: boolean
>      Include static `decode/encode`.
>
> 3. Create a shared non-generic carrier `CommandWithTransport` as `Schema.TaggedClass` with:
>    - command: unknown
>    - ctx: TransportCtx
>      Include static `decode/encode`.
>
> 4. Create a schema pipeline `ServerParamsToCommandWithTransport`:
>    - Input schema: `Schema.Struct({ body: Schema.Unknown, headers?: Headers, asResponse?: boolean, returnHeaders?: boolean })`
>    - Output schema: `CommandWithTransport`
>    - STRICT: fail decode if body is missing/undefined
>    - In decode, map `body` → `command` and the other fields into `ctx`.
>
> 5. Create an endpoint-specific tagged class `SignUpEmailCommandWithTransport`:
>    - command: SignUpEmailCommand (existing Schema.TaggedClass)
>    - ctx: TransportCtx
>
> 6. Create a schema pipeline `CommandWithTransportToSignUpEmail`:
>    - Input: CommandWithTransport
>    - Output: SignUpEmailCommandWithTransport
>    - Decode `command` using `Schema.decodeUnknownEither(SignUpEmailCommand)` and fail with `ParseResult.Pointer("command", ...)` if invalid.
>
> 7. Add two API-body adapters for sign-up email:
>    - `toSignUpEmailApiBodyNested(cmd)` produces `{ name, email, password, callbackURL?, image?, additionalFields: cmd.additionalFields }`
>    - `toSignUpEmailApiBodyFlattened(cmd)` produces `{ name, email, password, callbackURL?, image?, ...cmd.additionalFields }`
>
> 8. Place code under `packages/better-auth-utilities/src/lib/schema/...` using existing file conventions and ensure exports are wired.
>
> Output:
>
> - new files/classes/schemas implemented
> - where they live
> - any updated exports/index files
