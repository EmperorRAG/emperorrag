import { getSessionServer as getSessionUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const getSession = getSessionUtility({ authServer });
