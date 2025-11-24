import { signOutServer as signOutUtility } from '@emperorrag/better-auth-utilities/core/email/server/sign-out/signOut';
import { authServer } from '../../../../auth/auth';

export const signOut = signOutUtility({ authServer });
