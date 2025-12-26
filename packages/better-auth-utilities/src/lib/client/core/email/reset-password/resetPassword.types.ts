import type { createAuthClient } from "better-auth/client";
import type * as Effect from "effect/Effect";
import type { AuthClientFor } from "../../../client.types";
import type { EmailAuthError } from "../shared/email.error";
import type { EmailAuthClientDeps } from "../shared/email.types";

/**
 * Type helper to extract the input parameter type for resetPassword.
 *
 * @description Returns the first parameter type from the resetPassword method
 * (typically an object with newPassword, token/code, and optional callbackURL and fetchOptions).
 *
 * @example
 * ```typescript
 * type ResetPasswordInput = ResetPasswordInput<typeof authClient>;
 * // { newPassword: string, token?: string, callbackURL?: string, fetchOptions?: {...} }
 * ```
 */
export type ResetPasswordInput<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<
    ReturnType<typeof createAuthClient>
  >,
> = Parameters<T["resetPassword"]>[0];

/**
 * Type helper to extract the result type from resetPassword.
 *
 * @description Returns the Promise-wrapped result type from the resetPassword method.
 * Typically contains a success status or confirmation message.
 *
 * @example
 * ```typescript
 * type ResetPasswordResult = ResetPasswordResult<typeof authClient>;
 * // Promise<{ success: boolean, message?: string }>
 * ```
 */
export type ResetPasswordResult<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<
    ReturnType<typeof createAuthClient>
  >,
> = ReturnType<T["resetPassword"]>;

/**
 * Function signature for resetPassword service.
 *
 * @description Defines a curried function that accepts dependencies first, then input,
 * and returns an Effect that resolves to the reset password result or EmailAuthError.
 *
 * @example
 * ```typescript
 * const resetUserPassword: resetPasswordProps = (deps) => (input) =>
 *   Effect.tryPromise({
 *     try: () => deps.authClient.resetPassword(input),
 *     catch: (error) => new EmailAuthApiError(...)
 *   });
 * ```
 */
export interface resetPasswordProps<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<
    ReturnType<typeof createAuthClient>
  >,
> {
  (
    deps: EmailAuthClientDeps<T>,
  ): (
    input: ResetPasswordInput<T>,
  ) => Effect.Effect<Awaited<ResetPasswordResult<T>>, EmailAuthError>;
}
