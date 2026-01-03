import { APIError } from "better-auth";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import { ApiError } from "../../errors/api.error";
import type { MapApiErrorProps } from "./mapApiError.types";

export const mapApiError: MapApiErrorProps = (error) => {
  const errorToMap = (error as { _tag?: string; error?: unknown })?._tag === "UnknownException"
    ? (error as { error: unknown }).error
    : error;

  return pipe(
    Match.value(errorToMap),
    Match.when(Match.instanceOf(APIError), (apiError) => {
      const message = typeof apiError.message === "string" && apiError.message.length > 0
        ? apiError.message
        : (apiError.status as string) || "API Error occurred";
      const status = typeof apiError.statusCode === "number"
        ? apiError.statusCode
        : parseInt(apiError.statusCode as string, 10) || undefined;
      return new ApiError({
        message,
        status,
        cause: apiError,
      });
    }),
    Match.when(Match.instanceOf(Error), (err) =>
      new ApiError({
        message: err.message,
        cause: err,
      })),
    Match.orElse((err) =>
      new ApiError({
        message: "Unknown auth server error",
        cause: err,
      })
    ),
    Effect.fail,
  );
};
