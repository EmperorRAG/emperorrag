/**
 * @file libs/better-auth-utilities/src/lib/core/oauth/server/sign-in/signIn.types.ts
 * @description Type definitions for OAuth server sign-in operations.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../server.types';
import type { Effect } from 'effect';
import type { OAuthAuthServerError } from '../shared/oauth.error';
import type { OAuthAuthServerDeps } from '../shared/oauth.types';

/**
 * Input parameters for the server-side social sign-in operation.
 * Inferred directly from the Better Auth server instance to support plugin augmentations.
 *
 * @template T - The Better Auth server type
 */
export type SignInSocialServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	'signInSocial' extends keyof T['api'] ? (T['api']['signInSocial'] extends (...args: any) => any ? T['api']['signInSocial'] : never) : never
>[0];

/**
 * Result type for the server-side social sign-in operation.
 * Inferred directly from the Better Auth server instance.
 *
 * @template T - The Better Auth server type
 */
export type SignInSocialServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = ReturnType<
	'signInSocial' extends keyof T['api'] ? (T['api']['signInSocial'] extends (...args: any) => any ? T['api']['signInSocial'] : never) : never
>;

/**
 * Functional interface for the server-side social sign-in service.
 * Follows the curried pattern: (deps) => (input) => Effect
 *
 * @template T - The Better Auth server type
 */
export interface SignInSocialServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: OAuthAuthServerDeps<T>): (params: SignInSocialServerInput<T>) => Effect.Effect<Awaited<SignInSocialServerResult<T>>, OAuthAuthServerError>;
}
