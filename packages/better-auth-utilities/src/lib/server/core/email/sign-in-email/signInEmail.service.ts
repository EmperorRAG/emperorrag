/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/sign-in-email/signInEmail.service.ts
 * @description Server-side service for sign-in email operation using Better Auth API.
 */

import { Effect } from "effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { SignInEmailServerParams } from "./signInEmail.types";

/**
 * Sign in a user via email and password using Better Auth server API.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `signInEmailService`.
 * 2. Must be a pure function (marked with @pure if applicable, though Effect functions are generally pure descriptions).
 * 3. Must use `AuthServerTag` to access the Better Auth server instance.
 * 4. Must call the corresponding `authServer.api.signInEmail` function.
 * 5. Must map the input `params` to the structure expected by the Better Auth API.
 * 6. Must wrap the API call in `Effect.tryPromise`.
 * 7. Must handle errors using `Effect.catchAll(mapApiError)`.
 *
 * @param params - The parameters for the operation.
 * @returns An Effect that resolves to the response, requiring `AuthServerTag`.
 */
export const signInEmailService = (params: SignInEmailServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.signInEmail({
        body: {
          email: params.body.email.value,
          password: params.body.password.value,
          ...(params.body.callbackURL
            ? { callbackURL: params.body.callbackURL.value }
            : {}),
          ...(params.body.rememberMe
            ? { rememberMe: params.body.rememberMe }
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
