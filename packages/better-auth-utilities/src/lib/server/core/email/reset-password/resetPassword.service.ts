/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/reset-password/resetPassword.service.ts
 * @description Server-side service for reset password operation using Better Auth API.
 */

import { Effect } from "effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { ResetPasswordServerParams } from "./resetPassword.types";

/**
 * Reset a user's password using Better Auth server API.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `resetPasswordService`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.resetPassword` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const resetPasswordService = (params: ResetPasswordServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.resetPassword({
        body: {
          newPassword: params.body.newPassword.value,
          // Assuming ResetPasswordCommand has newPassword and token.
          // Better Auth resetPassword usually takes newPassword and token (often in body or query, but usually body for resetPassword).
          // Let's assume ResetPasswordCommand has the fields.
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
