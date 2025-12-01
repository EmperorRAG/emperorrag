import { signUpEmailServer as signUpEmailUtility } from '@emperorrag/better-auth-utilities/sign-up-email/server';
import { authServer } from '../../../../server/server';

export const signUpEmailServer = signUpEmailUtility({ authServer });
