import { it } from "@effect/vitest";
import { Effect, Schema } from "effect";
import { describe, expect } from "vitest";
import { SignOutCommand } from "../../../../schema/commands/sign-out/SignOut.command";
import { SignOutEmailServerParams } from "./signOutEmail.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `SignOutEmailServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("SignOutEmailServerParams", () => {
  const validBodyRaw = {
    _tag: "SignOutCommand" as const,
  };

  const validCommand = Schema.decodeSync(SignOutCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "SignOutEmailServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new SignOutEmailServerParams instance", () =>
    Effect.sync(() => {
      const params = new SignOutEmailServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(SignOutEmailServerParams);
      expect(params.body).toBeInstanceOf(SignOutCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(SignOutEmailServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(SignOutEmailServerParams);
      expect(decoded.body).toBeInstanceOf(SignOutCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new SignOutEmailServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(SignOutEmailServerParams)(params);

      expect(encoded).toEqual({
        _tag: "SignOutEmailServerParams",
        body: {
          _tag: "SignOutCommand",
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
