/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.service.ts
 * @description Server-side service for set password operation using Better Auth API.
 */

import { Effect } from "effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { SetPasswordServerParams } from "./setPassword.types";

/**
 * Set a user's password using Better Auth server API.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `setPasswordService`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.setPassword` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const setPasswordService = (params: SetPasswordServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.setPassword({
        body: {
          newPassword: params.body.newPassword.value,
          // Assuming SetPasswordCommand has newPassword.
          // Also might need currentPassword if it's a change, but setPassword usually implies setting it when it's not set or via token?
          // Wait, setPassword usually requires a session or token.
          // If it's setting password for the first time (e.g. after social login), it might just need newPassword and session.
          // Let's assume SetPasswordCommand has the fields.
          ...params.body,
        },
        ...(params.headers ? { headers: params.headers } : {}),
        ...(params.asResponse !== undefined
          ? { asResponse: params.asResponse }
          : {}),
        ...(params.returnHeaders !== undefined
          ? { returnHeaders: params.returnHeaders }
          : {}),
      })
    ).pipe(Effect.catchAll(mapApiError)));
