import { unlinkAccount as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/core/account/client/unlink-account/unlinkAccount';
import { authClient } from '../../../../auth/auth';

export const unlinkAccount = unlinkAccountUtility({ authClient });
