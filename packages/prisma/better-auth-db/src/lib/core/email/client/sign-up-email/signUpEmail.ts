import { signUpEmailClient as signUpEmailUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const signUpEmail = signUpEmailUtility({ authClient });
