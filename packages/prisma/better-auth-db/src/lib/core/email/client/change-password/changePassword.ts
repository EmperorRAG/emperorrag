import { changePasswordClient as changePasswordUtility } from '@emperorrag/better-auth-utilities/core/email/client/change-password/changePassword';
import { authClient } from '../../../../client/client';

export const changePassword = changePasswordUtility({ authClient });
