import * as Effect from "effect/Effect";
import { AccountAuthApiError } from "../shared/account.error";
import type { LinkSocialProps } from "./linkSocial.types";

/**
 * Link a social account to the current user.
 *
 * @pure
 * @description Wraps the Better Auth `linkSocial` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const linkSocialClient: LinkSocialProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (authClient.linkSocial as any)(input);

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => {
      const errObj = error as any;
      const message = errObj?.message || (error instanceof Error ? error.message : "Link social failed");
      const status = errObj?.status;
      return new AccountAuthApiError(message, status, error);
    },
  });
};
