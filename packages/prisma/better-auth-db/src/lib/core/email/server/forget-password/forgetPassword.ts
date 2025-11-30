import { forgetPasswordServer as forgetPasswordUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const forgetPassword = forgetPasswordUtility({ authServer });
