import { changePasswordServer as changePasswordUtility } from '@emperorrag/better-auth-utilities/core/email/server/change-password/changePassword';
import { authServer } from '../../../../server/server';

export const changePassword = changePasswordUtility({ authServer });
