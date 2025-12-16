/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.controller.ts
 * @description Server-side controller for forget password callback operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { forgetPasswordCallbackServerService } from "./forgetPasswordCallback.service";
import {
  type AuthServerApiForgetPasswordCallbackParamsFor,
  type forgetPasswordCallbackPropsFor,
  isAuthServerApiForgetPasswordCallbackParamsFor,
} from "./forgetPasswordCallback.types";

export const forgetPasswordCallbackServerController: forgetPasswordCallbackPropsFor = (
  params: AuthServerApiForgetPasswordCallbackParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    // 1) Validate params input with Effect-based validation pipeline
    const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema())(
      isAuthServerApiForgetPasswordCallbackParamsFor,
    )(params);

    // 2) Call the service with the validated params
    return yield* forgetPasswordCallbackServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.ForgetPasswordCallback(),
    }),
  );
