/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.service.ts
 * @description Server-side service for verify email operation using Better Auth API.
 */

import { Effect } from "effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { VerifyEmailServerParams } from "./verifyEmail.types";

/**
 * Verify a user's email using Better Auth server API.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `verifyEmailService`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.verifyEmail` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const verifyEmailService = (params: VerifyEmailServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.verifyEmail({
        query: {
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
