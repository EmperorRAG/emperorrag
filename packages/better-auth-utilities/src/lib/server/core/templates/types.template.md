# Template for types of server-side module

```typescript
import * as Schema from "effect/Schema";
import { pipe } from "effect/Function";
// Import the specific Command schema if it exists, or define the body schema here
// import { {{PascalCase}}Command } from "../../../../schema/commands/{{kebabCase}}/{{PascalCase}}.command";

/**
 * Represents the parameters for the {{humanReadable}} server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `{{PascalCase}}ServerParams`.
 * 2. Must extend `Schema.TaggedClass<{{PascalCase}}ServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class {{PascalCase}}ServerParams extends Schema.TaggedClass<{{PascalCase}}ServerParams>()(
  "{{PascalCase}}ServerParams",
  {
    body: Schema.Any, // Replace with specific Command schema: {{PascalCase}}Command
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown({{PascalCase}}ServerParams));
  }

  static encode(value: {{PascalCase}}ServerParams) {
    return pipe(value, Schema.encode({{PascalCase}}ServerParams));
  }
}
```
