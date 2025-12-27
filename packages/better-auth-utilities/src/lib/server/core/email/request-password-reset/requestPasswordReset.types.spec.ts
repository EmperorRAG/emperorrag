import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { RequestPasswordResetCommand } from "../../../../schema/commands/request-password-reset/RequestPasswordReset.command";
import { RequestPasswordResetServerParams } from "./requestPasswordReset.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `RequestPasswordResetServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("RequestPasswordResetServerParams", () => {
  const validBodyRaw = {
    _tag: "RequestPasswordResetCommand" as const,
    email: "test@example.com",
  };

  const validCommand = Schema.decodeSync(RequestPasswordResetCommand)(
    validBodyRaw,
  );

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "RequestPasswordResetServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect(
    "should create a new RequestPasswordResetServerParams instance",
    () =>
      Effect.sync(() => {
        const params = new RequestPasswordResetServerParams(
          validParamsForConstructor,
        );
        expect(params).toBeInstanceOf(RequestPasswordResetServerParams);
        expect(params.body).toBeInstanceOf(RequestPasswordResetCommand);
      }),
  );

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode(RequestPasswordResetServerParams)(
        validParamsForDecode,
      );
      expect(decoded).toBeInstanceOf(RequestPasswordResetServerParams);
      expect(decoded.body).toBeInstanceOf(RequestPasswordResetCommand);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new RequestPasswordResetServerParams(
        validParamsForConstructor,
      );
      const encoded = yield* Schema.encode(RequestPasswordResetServerParams)(
        params,
      );

      expect(encoded).toEqual({
        _tag: "RequestPasswordResetServerParams",
        body: {
          _tag: "RequestPasswordResetCommand",
          email: validBodyRaw.email,
        },
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
