import { APIError } from "better-auth";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import { ApiError } from "../../errors/api.error";
import type { MapApiErrorProps } from "./mapApiError.types";

export const mapApiError: MapApiErrorProps = (error) =>
  pipe(
    Match.value(error as unknown),
    Match.when(Match.instanceOf(APIError), (apiError) => {
      const status = typeof apiError.status === "number"
        ? apiError.status
        : parseInt(apiError.status as string, 10) || undefined;
      return new ApiError({
        message: apiError.message,
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
