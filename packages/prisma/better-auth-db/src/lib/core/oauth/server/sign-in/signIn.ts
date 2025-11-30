import { signInSocialServer as signInUtility } from '@emperorrag/better-auth-utilities/sign-in/server';
import { authServer } from '../../../../server/server';

export const signIn = signInUtility({ authServer });
