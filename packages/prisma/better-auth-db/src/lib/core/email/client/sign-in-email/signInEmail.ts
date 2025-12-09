import { signInEmailClient as signInEmailUtility } from '@emperorrag/better-auth-utilities/sign-in-email/client';
import { authClient } from '../../../../client/client';

export const signInEmailClient = signInEmailUtility({ authClient });
