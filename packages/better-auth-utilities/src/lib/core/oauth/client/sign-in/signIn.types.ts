import * as Effect from 'effect/Effect';
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types';
import type { OAuthAuthClientDeps } from '../shared/oauth.types';
import type { OAuthAuthError } from '../shared/oauth.error';

/**
 * Input parameters for the signIn social operation.
 *
 * @description Infers the input type directly from the `signIn.social` method of the Better Auth client.
 */
export type SignInSocialInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	'signIn' extends keyof T
		? 'social' extends keyof T['signIn']
			? T['signIn']['social'] extends (...args: any) => any
				? T['signIn']['social']
				: never
			: never
		: never
>[0];

/**
 * Result type for the signIn social operation.
 *
 * @description Infers the return type directly from the `signIn.social` method of the Better Auth client.
 */
export type SignInSocialResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	'signIn' extends keyof T
		? 'social' extends keyof T['signIn']
			? T['signIn']['social'] extends (...args: any) => any
				? T['signIn']['social']
				: never
			: never
		: never
>;

/**
 * Functional interface for the signIn social service.
 *
 * @description Defines the curried function signature for the signIn social operation.
 */
export interface SignInSocialProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: OAuthAuthClientDeps<T>): (input: SignInSocialInput<T>) => Effect.Effect<Awaited<SignInSocialResult<T>>, OAuthAuthError>;
}
