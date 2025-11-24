import { signIn as signInUtility } from '@emperorrag/better-auth-utilities/core/oauth/server/sign-in/signIn';
import { authServer } from '../../../../auth/auth';

export const signIn = signInUtility({ authServer });
