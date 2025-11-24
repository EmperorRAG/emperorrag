import { unlinkAccountClient as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/core/account/client/unlink-account/unlinkAccount';
import { authClient } from '../../../../client/client';

export const unlinkAccount = unlinkAccountUtility({ authClient });
