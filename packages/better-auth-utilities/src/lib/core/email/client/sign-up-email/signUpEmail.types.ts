import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor, AuthClientSignUpFor } from '../../../../client.types.js';
import type { EmailAuthError } from '../shared/email.error.js';
import type { Effect } from 'effect';
import type { EmailAuthClientDeps } from '../sign-in-email/signInEmail.types.js';

/**
 * Type helper to extract the input parameter type for signUp.email.
 *
 * @description Returns the first parameter type from the signUp.email method
 * (credentials object with name, email, password, optional image, callbackURL, fetchOptions).
 *
 * @example
 * ```typescript
 * type SignUpInput = SignUpEmailInput<typeof authClient>;
 * // { name: string, email: string, password: string, image?: string,
 * //   callbackURL?: string, fetchOptions?: {...} }
 * ```
 */
export type SignUpEmailInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	'email' extends keyof AuthClientSignUpFor<T> ? AuthClientSignUpFor<T>['email'] : never
>[0];

/**
 * Type helper to extract the result type from signUp.email.
 *
 * @description Returns the Promise-wrapped result type from the signUp.email method.
 * Typically contains user and session data.
 *
 * @example
 * ```typescript
 * type SignUpResult = SignUpEmailResult<typeof authClient>;
 * // Promise<{ data?: { user: User, session: Session }, error?: unknown }>
 * ```
 */
export type SignUpEmailResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	'email' extends keyof AuthClientSignUpFor<T> ? AuthClientSignUpFor<T>['email'] : never
>;

/**
 * Function signature for signUpEmail service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the sign-up result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const signUpUser: signUpEmailProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.signUp.email(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface signUpEmailProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: EmailAuthClientDeps<T>): (input: SignUpEmailInput<T>) => Effect.Effect<Awaited<SignUpEmailResult<T>>, EmailAuthError>;
}

// Re-export shared type
export type { EmailAuthClientDeps };
