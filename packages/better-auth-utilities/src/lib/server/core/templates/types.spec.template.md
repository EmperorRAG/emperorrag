# Template for types tests of server-side module

```typescript
import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { describe, expect } from "vitest";
// import { {{PascalCase}}Command } from "../../../../schema/commands/{{kebabCase}}/{{PascalCase}}.command";
import { {{PascalCase}}Params } from "./{{camelCase}}.types";

/**
 * Acceptance Criteria for Types Tests:
 * 1. Must verify creation of `{{PascalCase}}Params` instance.
 * 2. Must verify decoding of valid input.
 * 3. Must verify encoding to expected structure.
 * 4. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("{{PascalCase}}Params", () => {
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
    _tag: "{{PascalCase}}Params" as const,
    body: validBodyRaw,
    headers: new Headers({ "x-test": "true" }),
    asResponse: true,
    returnHeaders: false,
  };

  it.effect("should create a new {{PascalCase}}Params instance", () =>
    Effect.sync(() => {
      const params = new {{PascalCase}}Params(validParamsForConstructor as any);
      expect(params).toBeInstanceOf({{PascalCase}}Params);
      // expect(params.body).toBeInstanceOf({{PascalCase}}Command);
    }));

  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode({{PascalCase}}Params)(validParamsForDecode);
      expect(decoded).toBeInstanceOf({{PascalCase}}Params);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new {{PascalCase}}Params(validParamsForConstructor as any);
      const encoded = yield* Schema.encode({{PascalCase}}Params)(params);

      expect(encoded).toEqual({
        _tag: "{{PascalCase}}Params",
        body: expect.anything(), // Check specific structure
        headers: expect.any(Headers),
        asResponse: true,
        returnHeaders: false,
      });
    }));
});
```
