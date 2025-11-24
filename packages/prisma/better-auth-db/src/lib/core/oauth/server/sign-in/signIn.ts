import { signInSocialServer as signInUtility } from '@emperorrag/better-auth-utilities/core/oauth/server/sign-in/signIn';
import { authServer } from '../../../../server/server';

export const signIn = signInUtility({ authServer });
