import type { createAuthClient } from "better-auth/client";
import type * as Effect from "effect/Effect";
import type { AuthClientFor, AuthClientSignInFor } from "../../../client.types";
import type { EmailAuthError } from "../shared/email.error";
import type { EmailAuthClientDeps } from "../shared/email.types";

/**
 * Type helper to extract the input parameter type for signIn.email.
 *
 * @description Returns the first parameter type from the signIn.email method
 * (credentials object with email, password, rememberMe, callbackURL, fetchOptions).
 *
 * @example
 * ```typescript
 * type SignInInput = SignInEmailInput<typeof authClient>;
 * // { email: string, password: string, rememberMe?: boolean, callbackURL?: string, ...fetchOptions }
 * ```
 */
export type SignInEmailInput<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<
    ReturnType<typeof createAuthClient>
  >,
> = Parameters<
  "email" extends keyof AuthClientSignInFor<T> ? AuthClientSignInFor<T>["email"]
    : never
>[0];

/**
 * Type helper to extract the result type from signIn.email.
 *
 * @description Returns the Promise-wrapped result type from the signIn.email method.
 * Typically contains user and session data.
 *
 * @example
 * ```typescript
 * type SignInResult = SignInEmailResult<typeof authClient>;
 * // Promise<{ data?: { user: User, session: Session }, error?: unknown }>
 * ```
 */
export type SignInEmailResult<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<
    ReturnType<typeof createAuthClient>
  >,
> = ReturnType<
  "email" extends keyof AuthClientSignInFor<T> ? AuthClientSignInFor<T>["email"]
    : never
>;

/**
 * Function signature for signInEmail service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the sign-in result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const signInUser: signInEmailProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.signIn.email(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface signInEmailProps<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<
    ReturnType<typeof createAuthClient>
  >,
> {
  (
    deps: EmailAuthClientDeps<T>,
  ): (
    input: SignInEmailInput<T>,
  ) => Effect.Effect<Awaited<SignInEmailResult<T>>, EmailAuthError>;
}
