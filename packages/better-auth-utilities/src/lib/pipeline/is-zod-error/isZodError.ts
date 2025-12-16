import { pipe } from "effect/Function";
import * as Predicate from "effect/Predicate";
import type { z } from "zod";
import type { IsZodErrorProps } from "./isZodError.types";

/**
 * Type guard for ZodError detection.
 *
 * @pure
 * @description Checks if an error is a ZodError by examining its structure.
 *
 * @fp-pattern Predicate Composition
 * @composition pipe(error, Predicate.compose(Predicate.isRecord, Predicate.struct(...)))
 */
export const isZodError: IsZodErrorProps = (error: unknown): error is z.ZodError =>
  pipe(
    error,
    Predicate.compose(
      Predicate.isRecord,
      Predicate.struct({
        name: (n: unknown): n is "ZodError" => n === "ZodError",
        issues: (i: unknown): i is unknown[] => Array.isArray(i),
      }),
    ),
  );
