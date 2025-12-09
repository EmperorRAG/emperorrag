/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.service.ts
 * @description Server-side service for handling OAuth social sign-in operations using Effect-TS.
 * Uses Context-based dependency injection to access the Better Auth server.
 */

import { APIError } from 'better-auth/api';
import { Effect } from 'effect';
import { OAuthAuthServerApiError } from '../shared/oauth.error';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
import type { AuthServerApiSignInSocialParamsFor, signInSocialPropsFor } from './signInSocial.types';

/**
 * Server-side service for OAuth social sign-in.
 *
 * @pure
 * @description Creates an Effect that initiates OAuth authentication with a social provider.
 * Uses Effect's Context layer to access the authServer dependency.
 * Returns an Effect requiring OAuthAuthServerService context that, when provided,
 * calls the signInSocial API and returns the redirect URL or session data.
 *
 * @param params - The signInSocial parameters including provider, callbacks, and headers
 * @returns Effect requiring OAuthAuthServerService context, failing with OAuthAuthServerApiError,
 *          and succeeding with the sign-in result
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
 * import { signInSocialServerService } from './signInSocial.service';
 *
 * // Create the service with provider and callbacks
 * const program = signInSocialServerService({
 *   body: {
 *     provider: 'google',
 *     callbackURL: '/dashboard',
 *     errorCallbackURL: '/login?error=oauth_failed'
 *   },
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency via Context
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, OAuthAuthServerServiceTag, { authServer })
 * );
 *
 * // result contains { url: string, redirect: boolean } or session data
 * if ('url' in result) {
 *   redirect(result.url);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* (_) {
 *   const result = yield* _(signInSocialServerService({
 *     body: {
 *       provider: 'github',
 *       callbackURL: '/dashboard'
 *     },
 *     headers: request.headers
 *   }));
 *
 *   // Handle redirect vs direct session
 *   if ('url' in result) {
 *     return { type: 'redirect' as const, url: result.url };
 *   }
 *   return { type: 'session' as const, user: result.user };
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Error handling
 * const program = Effect.gen(function* (_) {
 *   const result = yield* _(
 *     signInSocialServerService({
 *       body: { provider: 'google' },
 *       headers: request.headers
 *     }).pipe(
 *       Effect.catchTag('OAuthAuthServerApiError', (e) => {
 *         if (e.status === 400) {
 *           return Effect.fail(new Error('Invalid OAuth provider'));
 *         }
 *         return Effect.fail(e);
 *       })
 *     )
 *   );
 *   return result;
 * });
 * ```
 */
export const signInSocialServerService: signInSocialPropsFor = (params: AuthServerApiSignInSocialParamsFor) =>
	Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.signInSocial(params),
			catch: (error) => {
				// Better Auth server throws APIError instances with status codes
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new OAuthAuthServerApiError(error.message, status, error);
				}
				// Handle non-APIError exceptions
				const message = error instanceof Error ? error.message : 'OAuth sign-in failed';
				return new OAuthAuthServerApiError(message, undefined, error);
			},
		})
	);
