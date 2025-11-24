import { signOutClient as signOutUtility } from '@emperorrag/better-auth-utilities/core/email/client/sign-out/signOut';
import { authClient } from '../../../../client/client';

export const signOut = signOutUtility({ authClient });
