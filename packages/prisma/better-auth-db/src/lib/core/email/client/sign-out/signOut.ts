import { signOutClient as signOutUtility } from '@emperorrag/better-auth-utilities/sign-out/client';
import { authClient } from '../../../../client/client';

export const signOut = signOutUtility({ authClient });
