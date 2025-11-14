import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor, AuthClientSignInFor } from '../../../../client.types.js';
import type { EmailAuthClientDeps, SignInEmailResult } from '../email.types.js';
import type { EmailAuthError } from '../email.error.js';
import type { Effect } from 'effect';

/**
 * Type helper to extract the input parameter type for signIn.email.
 *
 * @description Returns the first parameter type from the signIn.email method (credentials object with email, password, etc.).
 *
 * @example
 * ```typescript
 * type SignInInput = SignInEmailInput<typeof authClient>;
 * // { email: string, password: string, rememberMe?: boolean, callbackURL?: string, ...fetchOptions }
 * ```
 */
export type SignInEmailInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	'email' extends keyof AuthClientSignInFor<T> ? AuthClientSignInFor<T>['email'] : never
>[0];

export interface signInEmailProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: SignInEmailInput<T>) => Effect.Effect<SignInEmailResult<T>, EmailAuthError>;
}
