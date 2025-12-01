import { signOutServer as signOutUtility } from '@emperorrag/better-auth-utilities/sign-out/server';
import { authServer } from '../../../../server/server';

export const signOutServer = signOutUtility({ authServer });
