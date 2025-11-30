import { signInSocialClient as signInUtility } from '@emperorrag/better-auth-utilities/sign-in/client';
import { authClient } from '../../../../client/client';

export const signIn = signInUtility({ authClient });
