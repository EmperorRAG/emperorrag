import * as Effect from "effect/Effect";
import { SessionAuthApiError } from "../shared/session.error";
import type { GetSessionProps } from "./getSession.types";

/**
 * Retrieves the current user session.
 *
 * @pure
 * @description Wraps the Better Auth `getSession` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const getSessionClient: GetSessionProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (
        authClient.getSession as unknown as (
          input: unknown,
        ) => Promise<{ error?: unknown }>
      )(input);
      if (result?.error) {
        throw result.error;
      }
      return result;
    },
    catch: (error) => {
      const errObj = error as { message?: string; status?: number };
      const message = errObj?.message
        || (error instanceof Error ? error.message : "Get session failed");
      const status = errObj?.status;
      return new SessionAuthApiError(message, status, error);
    },
  });
};
