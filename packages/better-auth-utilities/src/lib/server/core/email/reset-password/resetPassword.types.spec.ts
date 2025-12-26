import { it } from "@effect/vitest";
import { Effect, Schema } from "effect";
import { describe, expect } from "vitest";
import { ResetPasswordCommand } from "../../../../schema/commands/reset-password/ResetPassword.command";
import { ResetPasswordServerParams } from "./resetPassword.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `ResetPasswordServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("ResetPasswordServerParams", () => {
  const validBodyRaw = {
    _tag: "ResetPasswordCommand" as const,
    newPassword: "newPassword123",
    token: "valid-token",
  };

  const validCommand = Schema.decodeSync(ResetPasswordCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "ResetPasswordServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new ResetPasswordServerParams instance", () =>
    Effect.sync(() => {
      const params = new ResetPasswordServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(ResetPasswordServerParams);
      expect(params.body).toBeInstanceOf(ResetPasswordCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(ResetPasswordServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(ResetPasswordServerParams);
      expect(decoded.body).toBeInstanceOf(ResetPasswordCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new ResetPasswordServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(ResetPasswordServerParams)(params);

      expect(encoded).toEqual({
        _tag: "ResetPasswordServerParams",
        body: {
          _tag: "ResetPasswordCommand",
          newPassword: validBodyRaw.newPassword,
          token: validBodyRaw.token,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
