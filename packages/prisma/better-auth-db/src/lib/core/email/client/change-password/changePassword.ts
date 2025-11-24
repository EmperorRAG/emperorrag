import { changePasswordClient as changePasswordUtility } from '@emperorrag/better-auth-utilities/core/email/client/change-password/changePassword';
import { authClient } from '../../../../auth/auth';

export const changePassword = changePasswordUtility({ authClient });
