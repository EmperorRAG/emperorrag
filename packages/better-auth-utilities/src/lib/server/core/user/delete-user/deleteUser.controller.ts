/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.controller.ts
 * @description Controller for server-side delete user operation with validation.
 */

import * as Effect from "effect/Effect";
import { PipelineContext } from "../../../../context/pipeline.context";
import { AuthServerApiEndpoints } from "../../../../enums/authServerApiEndpoints.enum";
import { validateInputEffect } from "../../../../pipeline/zod-input-validator/zodInputValidator";
import { createAuthServerApiEndpointParamsSchema } from "../../../../pipeline/zod-schema-builder/zodSchemaBuilder";
import type { AuthServerFor } from "../../../server.types";
import { deleteUserServerService } from "./deleteUser.service";
import {
  type AuthServerApiDeleteUserParamsFor,
  type deleteUserPropsFor,
  isAuthServerApiDeleteUserParamsFor,
} from "./deleteUser.types";

export const deleteUserServerController: deleteUserPropsFor = (
  params: AuthServerApiDeleteUserParamsFor<AuthServerFor>,
) =>
  Effect.gen(function*() {
    const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema())(
      isAuthServerApiDeleteUserParamsFor,
    )(params);
    return yield* deleteUserServerService(validatedParams);
  }).pipe(
    Effect.provideService(PipelineContext, {
      endpoint: AuthServerApiEndpoints.DeleteUser(),
    }),
  );
