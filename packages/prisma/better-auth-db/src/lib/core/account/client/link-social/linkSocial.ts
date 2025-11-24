import { linkSocialClient as linkSocialUtility } from '@emperorrag/better-auth-utilities/core/account/client/link-social/linkSocial';
import { authClient } from '../../../../client/client';

export const linkSocial = linkSocialUtility({ authClient });
