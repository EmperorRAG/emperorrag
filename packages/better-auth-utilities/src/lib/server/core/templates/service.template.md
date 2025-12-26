# Template for service of server-side module

```typescript
/**
 * @file libs/better-auth-utilities/src/lib/server/core/{{path}}/{{camelCase}}/{{camelCase}}.service.ts
 * @description Server-side service for {{humanReadable}} operation using Better Auth API.
 */

import { Effect } from "effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError"; // Adjust path as needed
import { AuthServerTag } from "../../../server.layer"; // Adjust path as needed
import type { {{PascalCase}}Params } from "./{{camelCase}}.types";

/**
 * {{Description of operation}}.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `{{camelCase}}Service`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.{{methodName}}` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const {{camelCase}}Service = (
  params: {{PascalCase}}Params,
) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.{{methodName}}({
        // Map body fields
        body: {
            // Example mapping:
            // email: params.body.email.value,
            // ... spread other fields
            ...params.body
        },
        // Map optional parameters
        ...(params.headers ? { headers: params.headers } : {}),
        // ... other options like asResponse, returnHeaders
        ...(params.asResponse !== undefined ? { asResponse: params.asResponse } : {}),
        ...(params.returnHeaders !== undefined ? { returnHeaders: params.returnHeaders } : {}),
      })
    ).pipe(Effect.catchAll(mapApiError)));
```
