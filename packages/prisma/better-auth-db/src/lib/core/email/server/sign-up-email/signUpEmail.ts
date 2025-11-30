import { signUpEmailServer as signUpEmailUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const signUpEmail = signUpEmailUtility({ authServer });
