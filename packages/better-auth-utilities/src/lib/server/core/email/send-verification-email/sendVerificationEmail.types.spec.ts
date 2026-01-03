import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { SendVerificationEmailCommand } from "../../../../schema/commands/send-verification-email/SendVerificationEmail.command";
import { SendVerificationEmailServerParams } from "./sendVerificationEmail.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `SendVerificationEmailServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("SendVerificationEmailServerParams", () => {
  const validBodyRaw = {
    _tag: "SendVerificationEmailCommand" as const,
    email: "test@example.com",
  };

  const validCommand = Schema.decodeSync(SendVerificationEmailCommand)(
    validBodyRaw,
  );

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "SendVerificationEmailServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect(
    "should create a new SendVerificationEmailServerParams instance",
    () =>
      Effect.sync(() => {
        const params = new SendVerificationEmailServerParams(
          validParamsForConstructor,
        );
        expect(params).toBeInstanceOf(SendVerificationEmailServerParams);
        expect(params.body).toBeInstanceOf(SendVerificationEmailCommand);
      }),
  );

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(SendVerificationEmailServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(SendVerificationEmailServerParams);
      expect(decoded.body).toBeInstanceOf(SendVerificationEmailCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new SendVerificationEmailServerParams(
        validParamsForConstructor,
      );
      const encoded = yield* Schema.encode(SendVerificationEmailServerParams)(
        params,
      );

      expect(encoded).toEqual({
        _tag: "SendVerificationEmailServerParams",
        body: {
          _tag: "SendVerificationEmailCommand",
          email: validBodyRaw.email,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
