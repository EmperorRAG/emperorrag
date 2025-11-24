import { forgetPasswordServer as forgetPasswordUtility } from '@emperorrag/better-auth-utilities/core/email/server/forget-password/forgetPassword';
import { authServer } from '../../../../server/server';

export const forgetPassword = forgetPasswordUtility({ authServer });
