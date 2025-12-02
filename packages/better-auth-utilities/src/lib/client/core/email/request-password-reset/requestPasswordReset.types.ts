import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../client.types';
import type { EmailAuthError } from '../shared/email.error';
import type { EmailAuthClientDeps } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

/**
 * Type helper to extract the input parameter type for forgetPassword.
 *
 * @description Returns the first parameter type from the forgetPassword method
 * (typically an object with email, optional redirectTo/callbackURL, and optional fetchOptions).
 *
 * @example
 * ```typescript
 * type RequestPasswordResetInput = RequestPasswordResetInput<typeof authClient>;
 * // { email: string, redirectTo?: string, callbackURL?: string, fetchOptions?: {...} }
 * ```
 */
export type RequestPasswordResetInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	Parameters<T['forgetPassword']>[0];

/**
 * Type helper to extract the result type from forgetPassword.
 *
 * @description Returns the Promise-wrapped result type from the forgetPassword method.
 * Typically contains a success status or confirmation message.
 *
 * @example
 * ```typescript
 * type RequestPasswordResetResult = RequestPasswordResetResult<typeof authClient>;
 * // Promise<{ success: boolean, message?: string }>
 * ```
 */
export type RequestPasswordResetResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	ReturnType<T['forgetPassword']>;

/**
 * Function signature for requestPasswordReset service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the request password reset result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const requestReset: requestPasswordResetProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.forgetPassword(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface requestPasswordResetProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: RequestPasswordResetInput<T>) => Effect.Effect<Awaited<RequestPasswordResetResult<T>>, EmailAuthError>;
}
