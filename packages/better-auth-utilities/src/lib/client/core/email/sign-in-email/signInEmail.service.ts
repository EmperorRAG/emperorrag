import * as Effect from "effect/Effect";
import { EmailAuthApiError } from "../shared/email.error";
import type { signInEmailProps } from "./signInEmail.types";

/**
 * Sign in a user via email and password using Better Auth.
 *
 * @pure
 * @description Wraps the Better Auth `signIn.email` API call in an Effect, converting Promise-based
 * errors into typed `EmailAuthApiError` failures in the error channel.
 *
 * @fp-pattern Dependency injection + Promise-to-Effect conversion
 * @composition
 *   - Curried function accepting dependencies first, then input
 *   - `Effect.tryPromise` converts Better Auth Promise to Effect with typed error channel
 *   - Error mapping extracts status code and message from Better Auth API errors
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { signInEmail } from './signInEmail.service';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* signInEmail({ authClient })({
 *     email: 'user@example.com',
 *     password: 'securePassword123',
 *     rememberMe: true
 *   });
 *
 *   console.log('Signed in:', result.user.email);
 *   return result;
 * });
 * ```
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting sign-in input and returning an Effect
 */
export const signInEmailClient: signInEmailProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: () => authClient.signIn.email(input),
    catch: (error) => {
      const message = error instanceof Error ? error.message : "Sign in failed";
      const status = error && typeof error === "object" && "status" in error
        ? (error.status as number)
        : undefined;
      return new EmailAuthApiError(message, status, error);
    },
  });
};
