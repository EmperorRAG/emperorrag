/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.service.ts
 * @description Server-side service for change email operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { ChangeEmailServerParams } from "./changeEmail.types";

/**
 * Initiate change email flow using Better Auth server API.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `changeEmailServerService`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.changeEmail` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const changeEmailServerService = (params: ChangeEmailServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.changeEmail({
        body: {
          newEmail: params.body.newEmail.value,
          ...(params.body.callbackURL
            ? { callbackURL: params.body.callbackURL.value }
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
