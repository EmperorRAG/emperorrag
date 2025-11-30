import { signInSocialClient as signInUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const signIn = signInUtility({ authClient });
