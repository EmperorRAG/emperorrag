import { signOutServer as signOutUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const signOut = signOutUtility({ authServer });
