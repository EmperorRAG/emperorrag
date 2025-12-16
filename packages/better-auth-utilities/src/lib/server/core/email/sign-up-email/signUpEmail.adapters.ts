import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import { AuthServerInputError as EmailAuthServerInputError } from "../../../../errors/authServer.error";

// 1. ensureRecord
export const ensureRecord = (message: string) =>
(
  u: unknown,
): Effect.Effect<
  Readonly<Record<string, unknown>>,
  EmailAuthServerInputError
> => {
  if (typeof u === "object" && u !== null && !Array.isArray(u)) {
    return Effect.succeed(u as Readonly<Record<string, unknown>>);
  }
  return Effect.fail(new EmailAuthServerInputError({ message }));
};

// 2. getPropE
export const getPropE = (key: string) =>
(
  record: Readonly<Record<string, unknown>>,
): Effect.Effect<unknown, never> => {
  return Effect.succeed(record[key]);
};

// 3. requireDefined
export const requireDefined = (message: string) => (u: unknown): Effect.Effect<unknown, EmailAuthServerInputError> => {
  if (u === undefined) {
    return Effect.fail(new EmailAuthServerInputError({ message }));
  }
  return Effect.succeed(u);
};

// 4. optionalOf
export const optionalOf =
  <A>(validate: (u: unknown) => Effect.Effect<A, EmailAuthServerInputError>) =>
  (u: unknown): Effect.Effect<A | undefined, EmailAuthServerInputError> => {
    if (u === undefined) {
      return Effect.succeed(undefined);
    }
    return validate(u);
  };

// 5. requireBoolean
export const requireBoolean = (message: string) => (u: unknown): Effect.Effect<boolean, EmailAuthServerInputError> => {
  if (typeof u === "boolean") {
    return Effect.succeed(u);
  }
  return Effect.fail(new EmailAuthServerInputError({ message }));
};

// 6. requireHeaders
export const requireHeaders = (message: string) => (u: unknown): Effect.Effect<Headers, EmailAuthServerInputError> => {
  if (u instanceof Headers) {
    return Effect.succeed(u);
  }
  return Effect.fail(new EmailAuthServerInputError({ message }));
};

// 7. extractBodyStrict
export const extractBodyStrict = (
  rawParams: unknown,
): Effect.Effect<unknown, EmailAuthServerInputError> =>
  pipe(
    rawParams,
    ensureRecord("rawParams must be an object"),
    Effect.flatMap((params) =>
      pipe(
        params,
        getPropE("body"),
        Effect.flatMap(requireDefined("body is missing")),
      )
    ),
  );

export type SignUpTransportCtx = Readonly<{
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}>;

// 8. extractSignUpCtxStrict
export const extractSignUpCtxStrict = (
  rawParams: unknown,
): Effect.Effect<SignUpTransportCtx, EmailAuthServerInputError> =>
  pipe(
    rawParams,
    ensureRecord("rawParams must be an object"),
    Effect.flatMap((params) =>
      Effect.gen(function*() {
        const headers = yield* pipe(
          params,
          getPropE("headers"),
          Effect.flatMap(optionalOf(requireHeaders("headers must be Headers"))),
        );

        const asResponse = yield* pipe(
          params,
          getPropE("asResponse"),
          Effect.flatMap(
            optionalOf(requireBoolean("asResponse must be boolean")),
          ),
        );

        const returnHeaders = yield* pipe(
          params,
          getPropE("returnHeaders"),
          Effect.flatMap(
            optionalOf(requireBoolean("returnHeaders must be boolean")),
          ),
        );

        return {
          ...(headers !== undefined ? { headers } : {}),
          ...(asResponse !== undefined ? { asResponse } : {}),
          ...(returnHeaders !== undefined ? { returnHeaders } : {}),
        };
      })
    ),
  );
