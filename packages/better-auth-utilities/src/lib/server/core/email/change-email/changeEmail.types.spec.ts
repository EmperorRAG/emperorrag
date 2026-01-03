import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { ChangeEmailCommand } from "../../../../schema/commands/change-email/ChangeEmail.command";
import { ChangeEmailServerParams } from "./changeEmail.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `ChangeEmailServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("ChangeEmailServerParams", () => {
  const validBodyRaw = {
    _tag: "ChangeEmailCommand" as const,
    newEmail: "new@example.com",
  };

  const validCommand = Schema.decodeSync(ChangeEmailCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "ChangeEmailServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new ChangeEmailServerParams instance", () =>
    Effect.sync(() => {
      const params = new ChangeEmailServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(ChangeEmailServerParams);
      expect(params.body).toBeInstanceOf(ChangeEmailCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(ChangeEmailServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(ChangeEmailServerParams);
      expect(decoded.body).toBeInstanceOf(ChangeEmailCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new ChangeEmailServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(ChangeEmailServerParams)(params);

      expect(encoded).toEqual({
        _tag: "ChangeEmailServerParams",
        body: {
          _tag: "ChangeEmailCommand",
          newEmail: validBodyRaw.newEmail,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
