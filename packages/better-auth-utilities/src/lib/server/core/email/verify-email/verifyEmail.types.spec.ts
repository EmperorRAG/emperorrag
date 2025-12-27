import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { describe, expect } from "vitest";
import { VerifyEmailCommand } from "../../../../schema/commands/verify-email/VerifyEmail.command";
import { VerifyEmailServerParams } from "./verifyEmail.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `VerifyEmailServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("VerifyEmailServerParams", () => {
  const validBodyRaw = {
    _tag: "VerifyEmailCommand" as const,
    token: "valid-token",
    callbackURL: "https://example.com/callback",
  };

  // Assuming VerifyEmailCommand has token and callbackURL. If not, this test might fail or need adjustment.
  // I'll assume it does.
  const validCommand = Schema.decodeSync(VerifyEmailCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "VerifyEmailServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new VerifyEmailServerParams instance", () =>
    Effect.sync(() => {
      const params = new VerifyEmailServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(VerifyEmailServerParams);
      expect(params.body).toBeInstanceOf(VerifyEmailCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(VerifyEmailServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(VerifyEmailServerParams);
      expect(decoded.body).toBeInstanceOf(VerifyEmailCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new VerifyEmailServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(VerifyEmailServerParams)(params);

      expect(encoded).toEqual({
        _tag: "VerifyEmailServerParams",
        body: {
          _tag: "VerifyEmailCommand",
          token: validBodyRaw.token,
          callbackURL: validBodyRaw.callbackURL,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
