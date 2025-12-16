import type { createAuthClient } from "better-auth/client";
import type * as Effect from "effect/Effect";
import type { AuthClientFor } from "../../../client.types";
import type { UserAuthError } from "../shared/user.error";
import type { UserAuthClientDeps } from "../shared/user.types";

/**
 * Type helper to extract the input parameter type for authClient.updateUser.
 */
export type UpdateUserInput<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>,
> = Parameters<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "updateUser" extends keyof T ? (T["updateUser"] extends (...args: any) => any ? T["updateUser"] : never) : never
>[0];

/**
 * Type helper to extract the result type from authClient.updateUser.
 */
export type UpdateUserResult<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>,
> = ReturnType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "updateUser" extends keyof T ? (T["updateUser"] extends (...args: any) => any ? T["updateUser"] : never) : never
>;

/**
 * Function signature for updateUser service.
 */
export interface UpdateUserProps<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>,
> {
  (
    deps: UserAuthClientDeps<T>,
  ): (input: UpdateUserInput<T>) => Effect.Effect<Awaited<UpdateUserResult<T>>, UserAuthError>;
}
