import { getSessionServer as getSessionUtility } from '@emperorrag/better-auth-utilities/core/session/server/get-session/getSession';
import { authServer } from '../../../../server/server';

export const getSession = getSessionUtility({ authServer });
