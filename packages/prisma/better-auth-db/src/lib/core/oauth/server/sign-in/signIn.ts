import { signInSocialServer as signInUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const signIn = signInUtility({ authServer });
