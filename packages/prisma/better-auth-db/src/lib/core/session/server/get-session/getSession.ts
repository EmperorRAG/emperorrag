import { getSessionServer as getSessionUtility } from '@emperorrag/better-auth-utilities/get-session/server';
import { authServer } from '../../../../server/server';

export const getSessionServer = getSessionUtility({ authServer });
