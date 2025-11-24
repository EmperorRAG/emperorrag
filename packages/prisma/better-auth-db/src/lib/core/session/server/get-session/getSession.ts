import { getSession as getSessionUtility } from '@emperorrag/better-auth-utilities/core/session/server/get-session/getSession';
import { authServer } from '../../../../auth/auth';

export const getSession = getSessionUtility({ authServer });
