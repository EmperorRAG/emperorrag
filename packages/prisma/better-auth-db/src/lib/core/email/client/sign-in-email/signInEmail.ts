import { signInEmailClient as signInEmailUtility } from '@emperorrag/better-auth-utilities/core/email/client/sign-in-email/signInEmail';
import { authClient } from '../../../../client/client';

export const signInEmail = signInEmailUtility({ authClient });
