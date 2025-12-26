# Prompt Params → Command pipeline (via your Schemas + Transforms)

> Implement a reusable Effect `pipe` pipeline that converts **SignUpEmailAuthServerParams → SignUpEmailCommand** by exercising the existing schema transforms.
>
> **Context / existing code (already in repo):**
>
> - `SignUpEmailCommand` is a `Schema.TaggedClass` representing the authClient params (intent/body shape).
> - `SignUpEmailAuthServerParams` is a `Schema.TaggedClass` representing the authServer params `{ body, headers?, asResponse?, returnHeaders? }` where `body: SignUpEmailCommand`.
> - `TransportCommand` is a `Schema.TaggedClass` with optional strict typed fields:
>   - `headers?: Headers` using `Schema.instanceOf(Headers)`
>   - `asResponse?: boolean`
>   - `returnHeaders?: boolean`
>
> - `UnknownCommandWithTransportCommand` is a `Schema.TaggedClass`:
>   - `{ command: Schema.Unknown, context: TransportCommand }`
>
> - `SignUpEmailCommandWithTransportCommand` is a `Schema.TaggedClass`:
>   - `{ command: SignUpEmailCommand, ctx: TransportCommand }`
>
> - Transform schemas already exist:
>   1. `SignUpEmailAuthServerParamsToCommandWithTransportCommandTransform`:
>      - `SignUpEmailAuthServerParams -> UnknownCommandWithTransportCommand`
>
>   2. `UnknownCommandWithTransportCommandToSignUpEmailCommandTransform`:
>      - `UnknownCommandWithTransportCommand -> SignUpEmailCommandWithTransportCommand`
>
> **Requirements:**
>
> 1. Create a function `SignUpEmailAuthServerParamsToSignUpEmailCommand(raw: unknown)` that returns `Effect.Effect<SignUpEmailCommand, EmailAuthServerInputError>`.
> 2. The pipeline must be implemented using `pipe` from `effect/Function` and must use schema decoding + existing transforms in this order:
>    - decode `raw` using `Schema.decodeUnknown(SignUpEmailAuthServerParams)`
>    - decode the result using `Schema.decodeUnknown(SignUpEmailAuthServerParamsToCommandWithTransportCommandTransform)`
>    - decode the result using `Schema.decodeUnknown(UnknownCommandWithTransportCommandToSignUpEmailCommandTransform)`
>    - `Effect.map` to extract `.command` (discard transport)
>
> 3. Add `Effect.mapError` at each stage to wrap the failure in `EmailAuthServerInputError` with a helpful stage-specific message, and include the original schema issue/cause as the error cause.
> 4. Use imports consistent with this repo:
>
>    ```ts
>    import { Effect, Schema } from "effect";
>    import { pipe } from "effect/Function";
>    ```
>
> 5. Place the function in an appropriate file (e.g. `packages/better-auth-utilities/src/lib/schema/commands/sign-up-email/SignUpEmail.pipeline.ts`) and export it.
>
> **Output:**
>
> - Show the final TypeScript function with correct imports and exports.
> - Ensure the function compiles with the existing schemas/transforms and field names (`context` vs `ctx`).
