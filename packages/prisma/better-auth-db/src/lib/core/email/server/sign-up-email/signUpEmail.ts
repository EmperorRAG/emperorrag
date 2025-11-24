import { signUpEmailServer as signUpEmailUtility } from '@emperorrag/better-auth-utilities/core/email/server/sign-up-email/signUpEmail';
import { authServer } from '../../../../server/server';

export const signUpEmail = signUpEmailUtility({ authServer });
