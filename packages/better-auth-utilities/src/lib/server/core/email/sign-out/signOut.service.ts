/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.service.ts
 * @description Server-side service for sign-out operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.service";
import type { AuthServerFor } from "../../../server.types";
import type { AuthServerApiSignOutParamsFor, signOutPropsFor } from "./signOut.types";

/**
 * Terminate the current user session using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signOut in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Invalidates the session
 * and clears authentication cookies.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (AuthServerTag)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Sign-Out Process:**
 * - Reads session cookie from Headers
 * - Validates session is active
 * - Invalidates session in database
 * - Clears authentication cookies via response headers
 * - Returns success confirmation
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Invalid session (401), expired session (401)
 * - Status codes extracted and preserved in AuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - Parameters including headers for session cookie access
 * @returns Effect requiring AuthServerTag context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { signOutServerService } from './signOut.service';
 * import { AuthServerTag } from '../../../server.service';
 *
 * const program = signOutServerService({
 *   headers: requestHeaders
 * });
 *
 * await Effect.runPromise(
 *   Effect.provideService(program, AuthServerTag, authServer)
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Handle expired session gracefully
 * import * as Effect from 'effect/Effect';
 *
 * const program = signOutServerService({
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'AuthServerApiError', (error) => {
 *   if (error.status === 401) {
 *     console.log('Session already expired or invalid');
 *     return Effect.succeed(undefined);
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(
 *   Effect.provideService(handled, AuthServerTag, authServer)
 * );
 * ```
 */
export const signOutServerService: signOutPropsFor = (params: AuthServerApiSignOutParamsFor<AuthServerFor>) =>
  Effect.flatMap(
    AuthServerTag,
    (authServer) => Effect.tryPromise(() => authServer.api.signOut(params)).pipe(Effect.catchAll(mapApiError)),
  );
