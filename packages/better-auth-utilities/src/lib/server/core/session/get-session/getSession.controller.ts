/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.controller.ts
 * @description Controller for server-side get session operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { getSessionServerService } from "./getSession.service";
import {
  type AuthServerApiGetSessionParamsFor,
  type getSessionPropsFor,
  isAuthServerApiGetSessionParamsFor,
} from "./getSession.types";

export const getSessionServerController: getSessionPropsFor = (
  params: AuthServerApiGetSessionParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema())(
      isAuthServerApiGetSessionParamsFor,
    )(params);
    return yield* getSessionServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.GetSession(),
    }),
  );
