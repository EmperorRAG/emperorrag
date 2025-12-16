/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.service.ts
 * @description Server-side service for revoke other sessions operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.service";
import type { AuthServerFor } from "../../../server.types";
import type {
  AuthServerApiRevokeOtherSessionsParamsFor,
  revokeOtherSessionsPropsFor,
} from "./revokeOtherSessions.types";

export const revokeOtherSessionsServerService: revokeOtherSessionsPropsFor = (
  params: AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor>,
) =>
  Effect.flatMap(
    AuthServerTag,
    (authServer) =>
      Effect.tryPromise(() => authServer.api.revokeOtherSessions(params)).pipe(Effect.catchAll(mapApiError)),
  );
