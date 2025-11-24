import { signUpEmail as signUpEmailUtility } from '@emperorrag/better-auth-utilities/core/email/server/sign-up-email/signUpEmail';
import { authServer } from '../../../../auth/auth';

export const signUpEmail = signUpEmailUtility({ authServer });
