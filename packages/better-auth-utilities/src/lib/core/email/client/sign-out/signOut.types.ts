import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types';
import type { EmailAuthError } from '../shared/email.error';
import type { EmailAuthClientDeps } from '../shared/email.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the input parameter type for signOut.
 *
 * @description Returns the first parameter type from the signOut method
 * (typically an options object with optional callbackURL and fetchOptions).
 *
 * @example
 * ```typescript
 * type SignOutInput = SignOutInput<typeof authClient>;
 * // { callbackURL?: string, fetchOptions?: {...} }
 * ```
 */
export type SignOutInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	T['signOut']
>[0] extends undefined
	? Record<string, never>
	: Parameters<T['signOut']>[0];

/**
 * Type helper to extract the result type from signOut.
 *
 * @description Returns the Promise-wrapped result type from the signOut method.
 * Typically void or a status object indicating successful sign-out.
 *
 * @example
 * ```typescript
 * type SignOutResult = SignOutResult<typeof authClient>;
 * // Promise<void> or Promise<{ success: boolean }>
 * ```
 */
export type SignOutResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	T['signOut']
>;

/**
 * Function signature for signOut service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the sign-out result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const logoutUser: signOutProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.signOut(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface signOutProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: SignOutInput<T>) => Effect.Effect<Awaited<SignOutResult<T>>, EmailAuthError>;
}
