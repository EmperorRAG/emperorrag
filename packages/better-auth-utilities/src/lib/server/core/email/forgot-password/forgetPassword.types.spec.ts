import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { ForgetPasswordCommand } from "../../../../schema/commands/forget-password/ForgetPassword.command";
import { ForgetPasswordServerParams } from "./forgetPassword.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `ForgetPasswordServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("ForgetPasswordServerParams", () => {
  const validBodyRaw = {
    _tag: "ForgetPasswordCommand" as const,
    email: "test@example.com",
  };

  const validCommand = Schema.decodeSync(ForgetPasswordCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "ForgetPasswordServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new ForgetPasswordServerParams instance", () =>
    Effect.sync(() => {
      const params = new ForgetPasswordServerParams(validParamsForConstructor);
      expect(params).toBeInstanceOf(ForgetPasswordServerParams);
      expect(params.body).toBeInstanceOf(ForgetPasswordCommand);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(ForgetPasswordServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(ForgetPasswordServerParams);
      expect(decoded.body).toBeInstanceOf(ForgetPasswordCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new ForgetPasswordServerParams(validParamsForConstructor);
      const encoded = yield* Schema.encode(ForgetPasswordServerParams)(params);

      expect(encoded).toEqual({
        _tag: "ForgetPasswordServerParams",
        body: {
          _tag: "ForgetPasswordCommand",
          email: validBodyRaw.email,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
