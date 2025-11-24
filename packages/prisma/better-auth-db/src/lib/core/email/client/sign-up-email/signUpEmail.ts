import { signUpEmail as signUpEmailUtility } from '@emperorrag/better-auth-utilities/core/email/client/sign-up-email/signUpEmail';
import { authClient } from '../../../../auth/auth';

export const signUpEmail = signUpEmailUtility({ authClient });
