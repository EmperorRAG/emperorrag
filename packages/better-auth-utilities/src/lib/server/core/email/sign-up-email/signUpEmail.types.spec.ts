import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { SignUpEmailCommand } from "../../../../schema/commands/sign-up-email/SignUpEmail.command";
import { SignUpEmailServerParams } from "./signUpEmail.types";

describe("SignUpEmailServerParams", () => {
  const validBodyRaw = {
    _tag: "SignUpEmailCommand" as const,
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  const validCommand = Schema.decodeSync(SignUpEmailCommand)(validBodyRaw);

  const validParamsForConstructor = {
    body: validCommand,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "SignUpEmailServerParams",
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it("should create a new SignUpEmailServerParams instance", () => {
    const params = new SignUpEmailServerParams(validParamsForConstructor);
    expect(params).toBeInstanceOf(SignUpEmailServerParams);
    expect(params.body).toBeInstanceOf(SignUpEmailCommand);
    // Accessing nested properties requires checking the value property of the branded types
    // But since we don't export Email/Name/Password classes here easily, we can check the encoded value or just existence
    expect(params.body.email.value).toBe(validBodyRaw.email);
  });

  it("should decode valid input", () => {
    const decoded = Schema.decodeSync(SignUpEmailServerParams)(validParamsForDecode);
    expect(decoded).toBeInstanceOf(SignUpEmailServerParams);
    expect(decoded.body).toBeInstanceOf(SignUpEmailCommand);
    expect(decoded.body.email.value).toBe(validBodyRaw.email);
  });

  it("should encode to expected structure", () => {
    const params = new SignUpEmailServerParams(validParamsForConstructor);
    const encoded = Schema.encodeSync(SignUpEmailServerParams)(params);

    expect(encoded).toEqual({
      _tag: "SignUpEmailServerParams",
      body: {
        _tag: "SignUpEmailCommand",
        email: validBodyRaw.email,
        password: validBodyRaw.password,
        name: validBodyRaw.name,
      },
      headers: expect.any(Headers),
      asResponse: true,
      returnHeaders: false,
    });
  });

  it("should fail decoding with invalid body", () => {
    const invalidParams = {
      body: {
        email: "invalid-email", // Invalid email
        password: "short", // Too short
        name: "Test User",
      },
    };

    expect(() => Schema.decodeSync(SignUpEmailServerParams)(invalidParams)).toThrow();
  });
});
