import { signUpEmailClient as signUpEmailUtility } from '@emperorrag/better-auth-utilities/core/email/client/sign-up-email/signUpEmail';
import { authClient } from '../../../../client/client';

export const signUpEmail = signUpEmailUtility({ authClient });
