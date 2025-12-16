/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.service.ts
 * @description Server-side service for link social account operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.service";
import type { AuthServerFor } from "../../../server.types";
import type { AuthServerApiLinkSocialAccountParamsFor, linkSocialAccountPropsFor } from "./linkSocialAccount.types";

export const linkSocialAccountServerService: linkSocialAccountPropsFor = (
  params: AuthServerApiLinkSocialAccountParamsFor<AuthServerFor>,
) =>
  Effect.flatMap(
    AuthServerTag,
    (authServer) =>
      Effect.tryPromise(() => authServer.api.linkSocialAccount(params)).pipe(Effect.catchAll(mapApiError)),
  );
