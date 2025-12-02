import { linkSocialClient as linkSocialUtility } from '@emperorrag/better-auth-utilities/link-social/client';
import { authClient } from '../../../../client/client';

export const linkSocialClient = linkSocialUtility({ authClient });
