import * as Effect from "effect/Effect";
import { OAuthAuthApiError } from "../shared/oauth.error";
import type { SignInSocialProps } from "./signIn.types";

/**
 * Initiates a social sign-in flow.
 *
 * @pure
 * @description Wraps the Better Auth `signIn.social` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const signInSocialClient: SignInSocialProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (authClient.signIn.social as unknown as (input: unknown) => Promise<{ error?: unknown }>)(
        input,
      );
      if (result?.error) {
        throw result.error;
      }
      return result;
    },
    catch: (error) => {
      const errObj = error as { message?: string; status?: number };
      const message = errObj?.message || (error instanceof Error ? error.message : "Social sign-in failed");
      const status = errObj?.status;
      return new OAuthAuthApiError(message, status, error);
    },
  });
};
