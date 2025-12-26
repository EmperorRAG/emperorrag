/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.service.ts
 * @description Server-side service for sign-up email operation using Better Auth API.
 */

import { Effect } from "effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { SignUpEmailServerParams } from "./signUpEmail.types";

/**
 * Register a new user via email and password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signUpEmail in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Creates both user account
 * and initial session in a single operation.
 *
 * @remarks
 * **Dependency Injection:**
 * - Uses `AuthServerTag` to access the Better Auth server instance from the context.
 *
 * **Registration Process:**
 * - Validates email uniqueness (throws error if exists)
 * - Hashes password securely (handled by Better Auth)
 * - Creates user record in database
 * - Creates initial session (if headers provided)
 * - Returns user data and session information
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Email already exists (409), validation failures (400)
 * - Status codes extracted and preserved in AuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @param params - The parameters for the sign-up operation, including body fields wrapped in value objects.
 * @returns An Effect that resolves to the sign-up response, requiring `AuthServerTag` in the context.
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { headers } from 'next/headers';
 * import { signUpEmailServerService } from './signUpEmail.service';
 *
 * // Create the registration program
 * const program = Effect.gen(function* () {
 *   const result = yield* signUpEmailServerService({
 *     body: {
 *       name: { value: 'Alice Johnson' },
 *       email: { value: 'alice@example.com' },
 *       password: { value: 'securePassword123' },
 *       image: { value: 'https://example.com/avatars/alice.jpg' }
 *     },
 *     headers: await headers()
 *   });
 *
 *   console.log('User registered:', result.user.email);
 *   return result;
 * });
 * ```
 */
export const signUpEmailServerService = (params: SignUpEmailServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.signUpEmail({
        body: {
          email: params.body.email.value,
          name: params.body.name.value,
          password: params.body.password.value,
          ...(params.body.image ? { image: params.body.image.value } : {}),
          ...(params.body.callbackURL
            ? { callbackURL: params.body.callbackURL.value }
            : {}),
          ...params.body.additionalFields,
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
