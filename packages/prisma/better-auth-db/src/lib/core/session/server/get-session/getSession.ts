import { getSessionServer as getSessionUtility } from '@emperorrag/better-auth-utilities/get-session/server';
import { authServer } from '../../../../server/server';

export const getSession = getSessionUtility({ authServer });
