/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.controller.ts
 * @description Controller for server-side get access token operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { getAccessTokenServerService } from "./getAccessToken.service";
import {
  type AuthServerApiGetAccessTokenParamsFor,
  type getAccessTokenPropsFor,
  isAuthServerApiGetAccessTokenParamsFor,
} from "./getAccessToken.types";

export const getAccessTokenServerController: getAccessTokenPropsFor = (
  params: AuthServerApiGetAccessTokenParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    const validatedParams = yield* validateInputEffect(
      createAuthServerApiEndpointParamsSchema(),
    )(isAuthServerApiGetAccessTokenParamsFor)(params);
    return yield* getAccessTokenServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.GetAccessToken(),
    }),
  );
