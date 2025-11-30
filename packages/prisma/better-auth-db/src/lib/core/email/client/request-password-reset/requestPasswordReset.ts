import { requestPasswordResetClient as requestPasswordResetUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const requestPasswordReset = requestPasswordResetUtility({ authClient });
