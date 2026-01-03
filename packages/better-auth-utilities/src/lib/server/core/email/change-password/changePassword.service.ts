/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-password/changePassword.service.ts
 * @description Server-side service for change password operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { ChangePasswordServerParams } from "./changePassword.types";

/**
 * Initiate change password flow using Better Auth server API.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `changePasswordServerService`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.changePassword` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const changePasswordServerService = (params: ChangePasswordServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.changePassword({
        body: {
          newPassword: params.body.newPassword.value,
          currentPassword: params.body.currentPassword.value,
          ...(params.body.revokeOtherSessions
            ? { revokeOtherSessions: params.body.revokeOtherSessions }
            : {}),
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
