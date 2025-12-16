import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import { AuthServerInputError } from "../../errors/authServer.error";
import type { CreateAuthServerInputErrorProps } from "./createAuthServerInputError.types";

/**
 * Creates a AuthServerInputError.
 *
 * @pure
 * @description Initializes a new AuthServerInputError wrapped in an Effect.
 */
export const createAuthServerInputError: CreateAuthServerInputErrorProps = (message, cause) =>
  pipe(
    Effect.succeed(message),
    Effect.map((msg) => new AuthServerInputError({ message: msg, cause })),
    Effect.withSpan("createAuthServerInputError"),
  );
