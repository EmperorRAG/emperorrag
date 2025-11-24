import { changePassword as changePasswordUtility } from '@emperorrag/better-auth-utilities/core/email/server/change-password/changePassword';
import { authServer } from '../../../../auth/auth';

export const changePassword = changePasswordUtility({ authServer });
