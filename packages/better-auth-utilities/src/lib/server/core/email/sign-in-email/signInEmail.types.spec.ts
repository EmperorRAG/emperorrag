import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { describe, expect } from "vitest";
import { SignInEmailCommand } from "../../../../schema/commands/sign-in-email/SignInEmail.command";
import { SignInEmailServerParams } from "./signInEmail.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `SignInEmailServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("SignInEmailServerParams", () => {
  const validBodyRaw = {
    _tag: "SignInEmailCommand" as const,
    email: "test@example.com",
    password: "password123",
  };

  const validCommand = Schema.decodeSync(SignInEmailCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "SignInEmailServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new SignInEmailServerParams instance", () =>
    Effect.sync(() => {
      const params = new SignInEmailServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(SignInEmailServerParams);
      expect(params.body).toBeInstanceOf(SignInEmailCommand);
      expect(params.body.email.value).toBe(validBodyRaw.email);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(SignInEmailServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(SignInEmailServerParams);
      expect(decoded.body).toBeInstanceOf(SignInEmailCommand);
      expect(decoded.body.email.value).toBe(validBodyRaw.email);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new SignInEmailServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(SignInEmailServerParams)(params);

      expect(encoded).toEqual({
        _tag: "SignInEmailServerParams",
        body: {
          _tag: "SignInEmailCommand",
          email: validBodyRaw.email,
          password: validBodyRaw.password,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
