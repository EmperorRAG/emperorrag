import { linkSocial as linkSocialUtility } from '@emperorrag/better-auth-utilities/core/account/client/link-social/linkSocial';
import { authClient } from '../../../../auth/auth';

export const linkSocial = linkSocialUtility({ authClient });
