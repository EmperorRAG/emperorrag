import { linkSocialClient as linkSocialUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const linkSocial = linkSocialUtility({ authClient });
