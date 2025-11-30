import { unlinkAccountClient as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/unlink-account/client';
import { authClient } from '../../../../client/client';

export const unlinkAccount = unlinkAccountUtility({ authClient });
