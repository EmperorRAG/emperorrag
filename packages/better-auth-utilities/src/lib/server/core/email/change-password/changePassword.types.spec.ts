import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { ChangePasswordCommand } from "../../../../schema/commands/change-password/ChangePassword.command";
import { ChangePasswordServerParams } from "./changePassword.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `ChangePasswordServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("ChangePasswordServerParams", () => {
  const validBodyRaw = {
    _tag: "ChangePasswordCommand" as const,
    newPassword: "newPassword123",
    currentPassword: "oldPassword123",
    revokeOtherSessions: true,
  };

  const validCommand = Schema.decodeSync(ChangePasswordCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "ChangePasswordServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new ChangePasswordServerParams instance", () =>
    Effect.sync(() => {
      const params = new ChangePasswordServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(ChangePasswordServerParams);
      expect(params.body).toBeInstanceOf(ChangePasswordCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(ChangePasswordServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(ChangePasswordServerParams);
      expect(decoded.body).toBeInstanceOf(ChangePasswordCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new ChangePasswordServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(ChangePasswordServerParams)(params);

      expect(encoded).toEqual({
        _tag: "ChangePasswordServerParams",
        body: {
          _tag: "ChangePasswordCommand",
          newPassword: validBodyRaw.newPassword,
          currentPassword: validBodyRaw.currentPassword,
          revokeOtherSessions: validBodyRaw.revokeOtherSessions,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
