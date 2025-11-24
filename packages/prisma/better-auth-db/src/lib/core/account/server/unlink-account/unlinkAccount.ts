import { unlinkAccount as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/core/account/server/unlink-account/unlinkAccount';
import { authServer } from '../../../../auth/auth';

export const unlinkAccount = unlinkAccountUtility({ authServer });
