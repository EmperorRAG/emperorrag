import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types';
import type { EmailAuthError } from '../shared/email.error';
import type { EmailAuthClientDeps } from '../shared/email.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the input parameter type for changePassword.
 *
 * @description Returns the first parameter type from the changePassword method
 * (typically an object with newPassword, currentPassword, and optional revokeOtherSessions and fetchOptions).
 *
 * @example
 * ```typescript
 * type ChangePasswordInput = ChangePasswordInput<typeof authClient>;
 * // { newPassword: string, currentPassword: string, revokeOtherSessions?: boolean, fetchOptions?: {...} }
 * ```
 */
export type ChangePasswordInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	T['changePassword']
>[0];

/**
 * Type helper to extract the result type from changePassword.
 *
 * @description Returns the Promise-wrapped result type from the changePassword method.
 * Typically contains a success status or confirmation message.
 *
 * @example
 * ```typescript
 * type ChangePasswordResult = ChangePasswordResult<typeof authClient>;
 * // Promise<{ success: boolean, message?: string }>
 * ```
 */
export type ChangePasswordResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	ReturnType<T['changePassword']>;

/**
 * Function signature for changePassword service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the change password result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const updatePassword: changePasswordProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.changePassword(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface changePasswordProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: ChangePasswordInput<T>) => Effect.Effect<Awaited<ChangePasswordResult<T>>, EmailAuthError>;
}
