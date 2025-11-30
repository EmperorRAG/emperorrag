import { signInEmailServer as signInEmailUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const signInEmail = signInEmailUtility({ authServer });
