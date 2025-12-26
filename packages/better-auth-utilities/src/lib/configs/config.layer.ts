import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Context, Effect, Layer } from "effect";
import { BetterAuthOptions } from "./config.schema";

/**
 * Tag that provides the constructed BetterAuthOptions instance.
 */

export class BetterAuthOptionsTag extends Context.Tag("BetterAuthOptionsTag")<
  BetterAuthOptionsTag,
  BetterAuthOptions
>() {
}

/**
 * Build+decode BetterAuthOptions.
 *
 * NOTE: PrismaClient is constructed inside this layer (your Option A).
 * NOTE: We are intentionally NOT managing connect/disconnect here, per your preference.
 */
export const BetterAuthOptionsLive = Layer.effect(
  BetterAuthOptionsTag,
  Effect.gen(function*() {
    const prisma = new PrismaClient();

    // Build the raw (unknown) input for decoding.
    // Include the prismaAdapter output in the `database` property, as you do today.
    const rawOptions: unknown = {
      // ---- fill in your existing config here ----
      // appName: "...",
      // baseURL: "...",
      // secret: "...",

      database: prismaAdapter(prisma, { provider: "postgresql" }),
      // ...the rest of your BetterAuthOptions input...
    };

    // Option B: decode to TaggedClass instance
    const options = yield* BetterAuthOptions.decode(rawOptions);

    return options;
  }),
);
