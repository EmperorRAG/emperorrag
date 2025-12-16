/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.controller.ts
 * @description Server-side controller for OAuth callback operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { callbackOAuthServerService } from "./callbackOAuth.service";
import {
  type AuthServerApiCallbackOAuthParamsFor,
  type callbackOAuthPropsFor,
  isAuthServerApiCallbackOAuthParamsFor,
} from "./callbackOAuth.types";

export const callbackOAuthServerController: callbackOAuthPropsFor = (
  params: AuthServerApiCallbackOAuthParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    const validatedParams = yield* validateInputEffect(
      createAuthServerApiEndpointParamsSchema(),
    )(isAuthServerApiCallbackOAuthParamsFor)(params);
    return yield* callbackOAuthServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.CallbackOAuth(),
    }),
  );
