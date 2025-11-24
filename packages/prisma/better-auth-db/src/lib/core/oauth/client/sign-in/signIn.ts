import { signInSocialClient as signInUtility } from '@emperorrag/better-auth-utilities/core/oauth/client/sign-in/signIn';
import { authClient } from '../../../../client/client';

export const signIn = signInUtility({ authClient });
