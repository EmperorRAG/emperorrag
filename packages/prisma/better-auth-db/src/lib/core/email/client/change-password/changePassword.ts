import { changePasswordClient as changePasswordUtility } from '@emperorrag/better-auth-utilities/change-password/client';
import { authClient } from '../../../../client/client';

export const changePasswordClient = changePasswordUtility({ authClient });
