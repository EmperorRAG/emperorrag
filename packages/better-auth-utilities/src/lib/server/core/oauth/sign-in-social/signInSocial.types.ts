/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.types.ts
 * @description Type definitions for server-side OAuth social sign-in operation.
 */

import type { Effect } from 'effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerApiError, CoreAuthServerInputError } from '../../shared/core.error';
import type { OAuthAuthServerService } from '../shared/oauth.types';

/**
 * Type helper to extract the signInSocial endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signInSocial` method from the server API. This method
 * initiates OAuth authentication with a social provider, returning a redirect URL or session data.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type SignInSocialMethod = AuthServerApiSignInSocialPropsFor<typeof authServer>;
 * // (args: { body: { provider: string, ... }, headers?: Headers, ... }) => Promise<{ url: string } | Session>
 *
 * const signInSocial: AuthServerApiSignInSocialPropsFor = authServer.api.signInSocial;
 * const result = await signInSocial({
 *   body: { provider: 'google', callbackURL: '/dashboard' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiSignInSocialPropsFor<T extends AuthServerFor = AuthServerFor> =
	'signInSocial' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signInSocial'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.signInSocial.
 *
 * @pure
 * @description Extracts the first parameter type from the signInSocial method.
 * Includes provider identification, callback URLs, headers, and optional configuration.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiSignInSocialParamsFor<typeof authServer>;
 * // { body: { provider: string, callbackURL?: string, ... }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiSignInSocialParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiSignInSocialPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.signInSocial.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to redirect URL or session information depending on configuration.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiSignInSocialResultFor<typeof authServer>;
 * // Promise<{ url: string, redirect: boolean } | { user: User, session: Session }>
 * ```
 */
export type AuthServerApiSignInSocialResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiSignInSocialPropsFor<T>>;

/**
 * Function signature for signInSocial server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires OAuthAuthServerService context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (OAuthAuthServerService)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Error Channel:**
 * - CoreAuthServerApiError: API call failures with HTTP status codes
 * - CoreAuthServerInputError: Validation failures from controller layer
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { signInSocialServerService } from './signInSocial.service';
 * import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
 *
 * const program = signInSocialServerService({
 *   body: {
 *     provider: 'google',
 *     callbackURL: '/dashboard'
 *   },
 *   headers: request.headers
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   Effect.provideService(program, OAuthAuthServerServiceTag, { authServer })
 * );
 * ```
 */
export type signInSocialPropsFor<T extends AuthServerFor = AuthServerFor> = (
	params: AuthServerApiSignInSocialParamsFor<T>
) => Effect.Effect<Awaited<AuthServerApiSignInSocialResultFor<T>>, CoreAuthServerApiError | CoreAuthServerInputError, OAuthAuthServerService>;

/**
 * Type guard for validating AuthServerApiSignInSocialParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiSignInSocialParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiSignInSocialParamsFor<T> structure
 *
 * @example
 * ```typescript
 * const params: unknown = getParamsFromRequest(request);
 *
 * if (isAuthServerApiSignInSocialParamsFor(params)) {
 *   // params is now narrowed to AuthServerApiSignInSocialParamsFor
 *   await service(params);
 * } else {
 *   throw new Error('Invalid params structure');
 * }
 * ```
 */
export const isAuthServerApiSignInSocialParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiSignInSocialParamsFor<T> => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	// signInSocial requires body with provider
	if (!('body' in candidate) || typeof candidate['body'] !== 'object' || candidate['body'] === null) {
		return false;
	}

	const body = candidate['body'] as Record<string, unknown>;

	if (!('provider' in body) || typeof body['provider'] !== 'string') {
		return false;
	}

	return true;
};
