import { getSessionClient as getSessionUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const getSession = getSessionUtility({ authClient });
