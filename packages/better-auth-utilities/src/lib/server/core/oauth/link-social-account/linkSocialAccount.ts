/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.ts
 * @description Barrel export for server-side link social account module.
 */

export { linkSocialAccountServerController } from "./linkSocialAccount.controller";
export { linkSocialAccountServerService } from "./linkSocialAccount.service";
export {
  type AuthServerApiLinkSocialAccountParamsFor,
  type AuthServerApiLinkSocialAccountPropsFor,
  type AuthServerApiLinkSocialAccountResultFor,
  isAuthServerApiLinkSocialAccountParamsFor,
  type linkSocialAccountPropsFor,
} from "./linkSocialAccount.types";
