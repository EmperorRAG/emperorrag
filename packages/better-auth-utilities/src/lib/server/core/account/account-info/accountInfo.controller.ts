/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.controller.ts
 * @description Server-side controller for account info operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { accountInfoServerService } from "./accountInfo.service";
import {
  type accountInfoPropsFor,
  type AuthServerApiAccountInfoParamsFor,
  isAuthServerApiAccountInfoParamsFor,
} from "./accountInfo.types";

export const accountInfoServerController: accountInfoPropsFor = (
  params: AuthServerApiAccountInfoParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    const validatedParams = yield* validateInputEffect(
      createAuthServerApiEndpointParamsSchema(),
    )(isAuthServerApiAccountInfoParamsFor)(params);
    return yield* accountInfoServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.AccountInfo(),
    }),
  );
