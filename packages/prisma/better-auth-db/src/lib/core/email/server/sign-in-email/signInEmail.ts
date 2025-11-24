import { signInEmail as signInEmailUtility } from '@emperorrag/better-auth-utilities/core/email/server/sign-in-email/signInEmail';
import { authServer } from '../../../../auth/auth';

export const signInEmail = signInEmailUtility({ authServer });
