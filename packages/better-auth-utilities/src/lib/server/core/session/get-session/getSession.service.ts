/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.service.ts
 * @description Server-side service for handling getSession operations using Effect-TS.
 * Uses Context-based dependency injection to access the Better Auth server.
 */

import { Effect } from 'effect';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerApiGetSessionParamsFor, getSessionPropsFor } from './getSession.types';

/**
 * Server-side service for retrieving the current user session.
 *
 * @pure
 * @description Creates an Effect that retrieves the current user's session based on
 * the provided headers/cookies. Uses Effect's Context layer to access the authServer dependency.
 * Returns an Effect requiring AuthServerTag context that, when provided,
 * fetches the session data or returns null if no valid session exists.
 *
 * @param params - The getSession parameters including headers for cookie-based lookup
 * @returns Effect requiring AuthServerTag context, failing with CoreAuthServerApiError,
 *          and succeeding with session/user data or null
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { AuthServerTag } from '../../../server.service';
 * import { getSessionServerService } from './getSession.service';
 *
 * // Create the service with request headers
 * const program = getSessionServerService({
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency via Context
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, AuthServerTag, authServer)
 * );
 *
 * // result is { user, session } | null
 * if (result) {
 *   console.log('Authenticated as:', result.user.email);
 * } else {
 *   console.log('No active session');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* (_) {
 *   const session = yield* _(getSessionServerService({
 *     headers: request.headers
 *   }));
 *
 *   if (!session) {
 *     return { authenticated: false };
 *   }
 *
 *   return {
 *     authenticated: true,
 *     userId: session.user.id,
 *     email: session.user.email
 *   };
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Error handling
 * const program = Effect.gen(function* (_) {
 *   const session = yield* _(
 *     getSessionServerService({ headers: request.headers }).pipe(
 *       Effect.catchTag('CoreAuthServerApiError', (e) => {
 *         console.error('Session API error:', e.message);
 *         return Effect.succeed(null);
 *       })
 *     )
 *   );
 *   return session;
 * });
 * ```
 */
export const getSessionServerService: getSessionPropsFor = (params: AuthServerApiGetSessionParamsFor) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.getSession(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
