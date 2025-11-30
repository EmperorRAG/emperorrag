import { changePasswordServer as changePasswordUtility } from '@emperorrag/better-auth-utilities/change-password/server';
import { authServer } from '../../../../server/server';

export const changePassword = changePasswordUtility({ authServer });
