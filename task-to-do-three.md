# ✅ Copilot Chat Prompt

> **Context**
>
> We are building a Better Auth utilities package using the Effect ecosystem. We are using the following modules (match the codebase style and imports):
>
> - `effect/Effect` for all computations (all functions return Effect or a subtype like Either/Option)
> - `effect/Schema` (NOT `@effect/schema`) with `Schema.transformOrFail`, `Schema.decodeUnknownEither`, etc.
> - `effect/ParseResult` for schema decode failures
> - `effect/Either`
> - `effect/Data` for `Data.TaggedClass`
> - `effect/Function` for `pipe`
>
> We have decided on architecture:
>
> - `AuthServerApi*Params` types are strictly Better Auth API-layer constructs.
> - Domain intent is represented by a `*Command` type.
> - Controllers validate/construct domain intent using **Effect Schema**.
> - Transport/adapter fields (`headers`, `asResponse`, `returnHeaders`) are handled strictly by a **server wrapper**, not by the command.
> - Strictness rules:
>   - Server wrapper **fails** if `rawParams` is not an object
>   - Server wrapper **fails** if `rawParams.body` is missing
>   - `headers` is **optional**, but if present must be `instanceof Headers` (strict)
>   - `asResponse` and `returnHeaders` are **optional**, but if present must be boolean (strict)
>
> We already implemented `AdditionalFieldsSchema(authServer)` using `effect/Schema` and `ParseResult` (code shown below). It implements “Option B”: unknown keys allowed but ignored; only configured keys with `input !== false` are considered; required fields must be present; type-mapped; unknown types -> Schema.Unknown.
>
> **Existing implemented code** (do not rewrite, just integrate with it):
>
> ```ts
> import * as Either from "effect/Either";
> import * as ParseResult from "effect/ParseResult";
> import * as Schema from "effect/Schema";
> import { AuthServer } from "../server/server.types";
>
> export const AdditionalFieldsSchema = (authServer: AuthServer) => {
>   const additionalFields = authServer.options?.user?.additionalFields || {};
>   const fieldSpecs: Record<
>     string,
>     { schema: Schema.Schema<any>; required: boolean }
>   > = {};
>
>   for (const [key, options] of Object.entries(additionalFields)) {
>     if (options.input === false) continue;
>     let schema: Schema.Schema<any>;
>     switch (options.type) {
>       case "string":
>         schema = Schema.String;
>         break;
>       case "number":
>         schema = Schema.Number;
>         break;
>       case "boolean":
>         schema = Schema.Boolean;
>         break;
>       default:
>         schema = Schema.Unknown;
>         break;
>     }
>     fieldSpecs[key] = { schema, required: !!options.required };
>   }
>
>   return Schema.transformOrFail(
>     Schema.Unknown,
>     Schema.Record({ key: Schema.String, value: Schema.Unknown }),
>     {
>       decode: (input: unknown, _options: any, ast: any) => {
>         if (typeof input !== "object" || input === null) {
>           return ParseResult.fail(new ParseResult.Type(ast, input));
>         }
>         const output: Record<string, unknown> = {};
>         const errors: ParseResult.ParseIssue[] = [];
>
>         for (const [key, spec] of Object.entries(fieldSpecs)) {
>           const value = (input as any)[key];
>           if (value === undefined) {
>             if (spec.required) {
>               errors.push(new ParseResult.Missing(spec.schema.ast as any));
>             }
>             continue;
>           }
>           const result = Schema.decodeUnknownEither(spec.schema)(value);
>           if (Either.isLeft(result)) {
>             errors.push(
>               new ParseResult.Pointer(key, value, result.left.issue),
>             );
>           } else {
>             output[key] = result.right;
>           }
>         }
>
>         if (errors.length > 0) {
>           return ParseResult.fail(
>             new ParseResult.Composite(ast, input, errors as any),
>           );
>         }
>         return ParseResult.succeed(output);
>       },
>       encode: (output: any) => ParseResult.succeed(output),
>     },
>   );
> };
> ```
>
> ---
>
> **Task: implement remaining code additions and integrate**
>
> 1. Implement `SignUpEmailCommand` using `effect/Data` `Data.TaggedClass("SignUpEmailCommand")` with fields:
>    - `name: string`
>    - `email: Email` (use existing Email schema/type already implemented elsewhere in project)
>    - `password: Password` (existing Password schema factory/type already implemented elsewhere)
>    - optional `callbackURL?: string`, `image?: string`
>    - `additionalFields: Readonly<Record<string, unknown>>` (always present; default `{}` when input missing)
>      Transport fields must NOT be on the command.
>
> 2. Implement `SignUpEmailCommandSchema(authServer: AuthServer)` in a new module or existing sign-up email schema module:
>    - Uses `effect/Schema` and the already implemented `AdditionalFieldsSchema(authServer)`
>    - The input shape is BODY-ONLY (client style):
>
>      ```ts
>      {
>        name, email, password, callbackURL?, image?,
>        additionalFields?: { ... }
>      }
>      ```
>
>    - `additionalFields` is optional on input but must become `{}` on the command if missing.
>    - Compose Email/Password schemas:
>      - Email schema is static already implemented (import it)
>      - Password schema is dynamic based on `authServer` password policy (import a function like `PasswordSchema(policy)` or whatever exists; use the project’s current utilities to extract policy from authServer)
>
>    - Use `Schema.transformOrFail` (or `Schema.transform` if appropriate) to decode into a `new SignUpEmailCommand({ ... })`.
>      Encoding should return a plain object matching the body shape.
>
> 3. Implement shared core `decodeSignUpEmailCommand(rawBody: unknown)`:
>    - returns `Effect.Effect<SignUpEmailCommand, EmailAuthServerInputError, EmailAuthServerService>` (or whatever the tag/service environment is)
>    - Uses `EmailAuthServerServiceTag` (Context/Tag already exists in project) to obtain `{ authServer }` and then decodes with `Schema.decodeUnknownEither(SignUpEmailCommandSchema(authServer))(rawBody)`
>    - On schema decode failure, map to `EmailAuthServerInputError` with a message like `"Invalid sign up input"` and include the parse issue as the cause.
>
> 4. Implement strict server wrapper helpers (each should be unary and return Effect):
>    - `ensureRecord(message)(unknown) -> Effect<Record<string, unknown>, EmailAuthServerInputError>`
>    - `extractBodyStrict(rawParams) -> Effect<unknown, EmailAuthServerInputError>`
>      - fails if rawParams not object
>      - fails if `body` missing (property absent OR undefined)
>
>    - `extractSignUpCtxStrict(rawParams) -> Effect<{ headers?: Headers; asResponse?: boolean; returnHeaders?: boolean }, EmailAuthServerInputError>`
>      - fails if rawParams not object
>      - headers is optional but if present must be `instanceof Headers` else fail
>      - asResponse optional but if present must be boolean else fail
>      - returnHeaders optional but if present must be boolean else fail
>        Use `pipe` and `Effect` combinators; keep helpers reusable for other endpoints.
>
> 5. Implement the server controller wrapper using the recommended pattern:
>    - `signUpEmailServerController(rawParams: unknown)`:
>      - `rawBody <- extractBodyStrict(rawParams)`
>      - `ctx <- extractSignUpCtxStrict(rawParams)`
>      - `cmd <- decodeSignUpEmailCommand(rawBody)`
>      - call a server service function `signUpEmailServerServiceFromCommandWithCtx(cmd, ctx)` which already exists or should be added if missing (it builds Better Auth API params using ctx and calls `authServer.api.signUpEmail`, mapping Better Auth `APIError` to existing domain errors).
>        The command remains clean; ctx only used at service boundary.
>
> ---
>
> **Implementation notes**
>
> - Prefer `Schema.Struct` and `Schema.optional` / `Schema.UndefinedOr` whichever is used in this repo.
> - If you need to validate URL strings, keep it simple for now (optional string), unless repo already has a URL schema.
> - Use the repo’s existing error types:
>   - `EmailAuthServerInputError` for validation/decoding failures.
>
> - Use existing tags/layers:
>   - `EmailAuthServerServiceTag` to access `authServer`.
>
> - Keep file/module names consistent with existing convention (e.g., `signUpEmail.command.ts`, `signUpEmail.command.schema.ts`, `signUpEmail.controller.ts`, `signUpEmail.adapters.ts`).
>
> Please implement all missing parts, wire imports, ensure TypeScript types compile, and do not remove the existing `AdditionalFieldsSchema` implementation.
>
> **Output:** Provide the new/updated code files (or patches) with correct imports and minimal necessary changes.
