/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.controller.ts
 * @description Server-side controller for request password reset callback operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { requestPasswordResetCallbackServerService } from "./requestPasswordResetCallback.service";
import {
  type AuthServerApiRequestPasswordResetCallbackParamsFor,
  isAuthServerApiRequestPasswordResetCallbackParamsFor,
  type requestPasswordResetCallbackPropsFor,
} from "./requestPasswordResetCallback.types";

export const requestPasswordResetCallbackServerController: requestPasswordResetCallbackPropsFor = (
  params: AuthServerApiRequestPasswordResetCallbackParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    // 1) Validate params input with Effect-based validation pipeline
    const validatedParams = yield* validateInputEffect(
      createAuthServerApiEndpointParamsSchema(),
    )(isAuthServerApiRequestPasswordResetCallbackParamsFor)(params);

    // 2) Call the service with the validated params
    return yield* requestPasswordResetCallbackServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.RequestPasswordResetCallback(),
    }),
  );
