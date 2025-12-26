import * as Effect from "effect/Effect";
import { AccountAuthApiError } from "../shared/account.error";
import type { UnlinkAccountProps } from "./unlinkAccount.types";

/**
 * Unlink a provider from the current user.
 *
 * @pure
 * @description Wraps the Better Auth `unlinkAccount` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const unlinkAccountClient: UnlinkAccountProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (
        authClient.unlinkAccount as unknown as (
          input: unknown,
        ) => Promise<{ data: unknown; error: unknown }>
      )(input);

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => {
      const errObj = error as { message?: string; status?: number };
      const message = errObj?.message
        || (error instanceof Error ? error.message : "Unlink account failed");
      const status = errObj?.status;
      return new AccountAuthApiError(message, status, error);
    },
  });
};
