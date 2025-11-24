import { signOutClient as signOutUtility } from '@emperorrag/better-auth-utilities/core/email/client/sign-out/signOut';
import { authClient } from '../../../../auth/auth';

export const signOut = signOutUtility({ authClient });
