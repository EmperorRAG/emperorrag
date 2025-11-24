import { getSession as getSessionUtility } from '@emperorrag/better-auth-utilities/core/session/client/get-session/getSession';
import { authClient } from '../../../../auth/auth';

export const getSession = getSessionUtility({ authClient });
