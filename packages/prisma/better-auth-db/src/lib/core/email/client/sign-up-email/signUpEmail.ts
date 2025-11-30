import { signUpEmailClient as signUpEmailUtility } from '@emperorrag/better-auth-utilities/sign-up-email/client';
import { authClient } from '../../../../client/client';

export const signUpEmail = signUpEmailUtility({ authClient });
