import { forgetPasswordServer as forgetPasswordUtility } from '@emperorrag/better-auth-utilities/request-password-reset/server';
import { authServer } from '../../../../server/server';

export const forgetPassword = forgetPasswordUtility({ authServer });
