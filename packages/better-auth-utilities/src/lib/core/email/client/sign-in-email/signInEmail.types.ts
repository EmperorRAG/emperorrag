import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor, AuthClientSignInFor } from '../../../../client.types.js';
import type { EmailAuthClientDeps, SignInEmailResult } from '../email.types.js';
import type { EmailAuthError } from '../email.error.js';
import type { Effect } from 'effect';

/**
 * Type helper to extract the signIn.email method type from an AuthClient.
 *
 * @description Returns the type of the signIn.email method, including any plugin-specific overloads.
 *
 * @example
 * ```typescript
 * type SignInEmailMethod = AuthClientSignInEmailFor<typeof authClient>;
 * // (credentials: { email: string, password: string, ... }) => Promise<...>
 * ```
 */
export type SignInEmailInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	'email' extends keyof AuthClientSignInFor<T> ? AuthClientSignInFor<T>['email'] : never;

export interface signInEmailProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: Parameters<SignInEmailInput<T>>[0]) => Effect.Effect<SignInEmailResult<T>, EmailAuthError>;
}
