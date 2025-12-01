import { getSessionClient as getSessionUtility } from '@emperorrag/better-auth-utilities/get-session/client';
import { authClient } from '../../../../client/client';

export const getSessionClient = getSessionUtility({ authClient });
