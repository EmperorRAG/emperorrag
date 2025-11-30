import { signOutClient as signOutUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const signOut = signOutUtility({ authClient });
