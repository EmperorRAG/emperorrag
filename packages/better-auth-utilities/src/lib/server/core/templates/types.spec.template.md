# Template for types tests of server-side module

```typescript
import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
// import { {{PascalCase}}Command } from "../../../../schema/commands/{{kebabCase}}/{{PascalCase}}.command";
import { {{PascalCase}}ServerParams } from "./{{camelCase}}.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `{{PascalCase}}ServerParams` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("{{PascalCase}}ServerParams", () => {
  const validBodyRaw = {
    // _tag: "{{PascalCase}}Command" as const,
    // ... fields
  };

  // const validCommand = Schema.decodeSync({{PascalCase}}Command)(validBodyRaw);

  const validParamsForConstructor = {
    body: validBodyRaw, // or validCommand
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  const validParamsForDecode = {
    _tag: "{{PascalCase}}ServerParams" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new {{PascalCase}}ServerParams instance", () =>
    Effect.sync(() => {
      const params = new {{PascalCase}}ServerParams(validParamsForConstructor as any);
      expect(params).toBeInstanceOf({{PascalCase}}ServerParams);
      // expect(params.body).toBeInstanceOf({{PascalCase}}Command);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode({{PascalCase}}ServerParams)(validParamsForDecode);
      expect(decoded).toBeInstanceOf({{PascalCase}}ServerParams);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new {{PascalCase}}ServerParams(validParamsForConstructor as any);
      const encoded = yield* Schema.encode({{PascalCase}}ServerParams)(params);

      expect(encoded).toEqual({
        _tag: "{{PascalCase}}ServerParams",
        body: expect.anything(), // Check specific structure
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
```
