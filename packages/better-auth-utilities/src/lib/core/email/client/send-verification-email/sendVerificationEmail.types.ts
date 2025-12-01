import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types';
import type { EmailAuthError } from '../shared/email.error';
import type { EmailAuthClientDeps } from '../shared/email.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the input parameter type for sendVerificationEmail.
 *
 * @description Returns the first parameter type from the sendVerificationEmail method
 * (typically an object with email and optional callbackURL and fetchOptions).
 *
 * @example
 * ```typescript
 * type SendVerificationInput = SendVerificationEmailInput<typeof authClient>;
 * // { email: string, callbackURL?: string, fetchOptions?: {...} }
 * ```
 */
export type SendVerificationEmailInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	Parameters<T['sendVerificationEmail']>[0];

/**
 * Type helper to extract the result type from sendVerificationEmail.
 *
 * @description Returns the Promise-wrapped result type from the sendVerificationEmail method.
 * Typically contains a success status or confirmation message.
 *
 * @example
 * ```typescript
 * type SendVerificationResult = SendVerificationEmailResult<typeof authClient>;
 * // Promise<{ success: boolean, message?: string }>
 * ```
 */
export type SendVerificationEmailResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	ReturnType<T['sendVerificationEmail']>;

/**
 * Function signature for sendVerificationEmail service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the send verification result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const sendVerification: sendVerificationEmailProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.sendVerificationEmail(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface sendVerificationEmailProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: SendVerificationEmailInput<T>) => Effect.Effect<Awaited<SendVerificationEmailResult<T>>, EmailAuthError>;
}
