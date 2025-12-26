import { it } from "@effect/vitest";
import { Effect, Schema } from "effect";
import { describe, expect } from "vitest";
import { SetPasswordCommand } from "../../../../schema/commands/set-password/SetPassword.command";
import { SetPasswordServerParams } from "./setPassword.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `SetPasswordServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("SetPasswordServerParams", () => {
  const validBodyRaw = {
    _tag: "SetPasswordCommand" as const,
    newPassword: "newPassword123",
  };

  const validCommand = Schema.decodeSync(SetPasswordCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "SetPasswordServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new SetPasswordServerParams instance", () =>
    Effect.sync(() => {
      const params = new SetPasswordServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(SetPasswordServerParams);
      expect(params.body).toBeInstanceOf(SetPasswordCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(SetPasswordServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(SetPasswordServerParams);
      expect(decoded.body).toBeInstanceOf(SetPasswordCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new SetPasswordServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(SetPasswordServerParams)(params);

      expect(encoded).toEqual({
        _tag: "SetPasswordServerParams",
        body: {
          _tag: "SetPasswordCommand",
          newPassword: validBodyRaw.newPassword,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
