import { signInEmailServer as signInEmailUtility } from '@emperorrag/better-auth-utilities/sign-in-email/server';
import { authServer } from '../../../../server/server';

export const signInEmailServer = signInEmailUtility({ authServer });
