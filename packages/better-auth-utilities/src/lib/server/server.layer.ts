// authServer.layer.ts
import { betterAuth } from "better-auth"; // <-- adjust to your actual import
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { BetterAuthOptionsLive, BetterAuthOptionsTag } from "../configs/config.layer";
import { BetterAuthOptions } from "../configs/config.schema";

/**
 * The runtime type of your better-auth server instance.
 */
export type AuthServer = ReturnType<typeof betterAuth>;

/**
 * Tag that provides the constructed better-auth server instance.
 */
export class AuthServerTag extends Context.Tag("AuthServerTag")<
  AuthServerTag,
  AuthServer
>() {}

/**
 * Construct the authServer instance from BetterAuthOptions.
 */
export const AuthServerLive = Layer.effect(
  AuthServerTag,
  Effect.gen(function*() {
    const options = yield* BetterAuthOptionsTag;
    return betterAuth(BetterAuthOptions.encode(options));
  }),
);

/**
 * Convenience: "the auth stack"
 * (Provide options first, then build server.)
 */
export const AuthLive = Layer.provide(AuthServerLive, BetterAuthOptionsLive);
