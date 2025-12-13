# 📌 Copilot Context Prompt

> **Context**
>
> You are working inside a TypeScript library that uses **Effect**, **@effect/schema**, and **effect/Data**.
>
> This project wraps a **Better Auth server instance**, and schemas must be **generated dynamically at runtime** based on the `authServer.options.user.additionalFields` configuration.
>
> We are implementing **Option B** for additional fields handling:
>
> * Unknown keys in input objects are **allowed but ignored**
> * Only keys declared in `authServer.options.user.additionalFields` with `input !== false` are considered
> * Required fields (`required: true`) **must be present**, otherwise decoding **fails**
> * Value type validation rules:
>
>   * `"string"` → `Schema.String`
>   * `"number"` → `Schema.Number`
>   * `"boolean"` → `Schema.Boolean`
>   * any other or unknown type → `Schema.Unknown`
>
> The output of decoding must be:
>
> ```ts
> Readonly<Record<string, unknown>>
> ```
>
> containing **only the allowed and validated keys**.
>
> ---
>
> **Task**
>
> Implement:
>
> ```ts
> AdditionalFieldsSchema(authServer)
> ```
>
> as an **Effect Schema factory** that:
>
> 1. Extracts `authServer.options.user.additionalFields`
> 2. Builds runtime field specs:
>
>    ```ts
>    {
>      key: string;
>      schema: Schema<any>;
>      required: boolean;
>    }
>    ```
>
> 3. Decodes an arbitrary object input:
>
>    * validates only the allowed keys
>    * ignores all other keys
>    * fails decoding if:
>
>      * a required key is missing
>      * a provided value does not match its schema
> 4. Returns a `Schema<Record<string, unknown>>`
>
> Use **Schema.transformOrFail** (or the closest equivalent in the installed version of `@effect/schema`) so that:
>
> * decoding performs validation + filtering
> * encoding is identity (`Effect.succeed`)
>
> ---
>
> **Important Constraints**
>
> * Do NOT use Zod
> * Do NOT rely on compile-time typing for additional field keys (they are runtime-driven)
> * Prefer `Schema.decodeUnknown(fieldSchema)(value)` when validating individual values
> * Missing required fields must cause decode failure
> * Keep the implementation reusable for other endpoints
>
> ---
>
> **Integration Goal**
>
> This schema will be composed into:
>
> ```ts
> SignUpEmailCommandSchema(authServer)
> ```
>
> which decodes `unknown` → `SignUpEmailCommand` (a `Data.TaggedClass` domain object).
>
> ---
>
> **Deliverable**
>
> Implement `AdditionalFieldsSchema(authServer)` with:
>
> * a helper to build field specs from config
> * a lenient input object schema
> * a transform that produces a filtered, validated record
>
> Ensure the implementation compiles against the project’s current Effect / Schema versions.
