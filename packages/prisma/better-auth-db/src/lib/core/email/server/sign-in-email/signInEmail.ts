import { signInEmailServer as signInEmailUtility } from '@emperorrag/better-auth-utilities/core/email/server/sign-in-email/signInEmail';
import { authServer } from '../../../../server/server';

export const signInEmail = signInEmailUtility({ authServer });
