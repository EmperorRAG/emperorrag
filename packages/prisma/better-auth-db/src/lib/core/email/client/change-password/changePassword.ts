import { changePasswordClient as changePasswordUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const changePassword = changePasswordUtility({ authClient });
