/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.service.ts
 * @description Server-side service for revoke all sessions operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.service";
import type { AuthServerFor } from "../../../server.types";
import type { AuthServerApiRevokeSessionsParamsFor, revokeSessionsPropsFor } from "./revokeSessions.types";

export const revokeSessionsServerService: revokeSessionsPropsFor = (
  params: AuthServerApiRevokeSessionsParamsFor<AuthServerFor>,
) =>
  Effect.flatMap(
    AuthServerTag,
    (authServer) => Effect.tryPromise(() => authServer.api.revokeSessions(params)).pipe(Effect.catchAll(mapApiError)),
  );
