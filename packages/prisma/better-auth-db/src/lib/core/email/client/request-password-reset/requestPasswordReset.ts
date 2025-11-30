import { requestPasswordResetClient as requestPasswordResetUtility } from '@emperorrag/better-auth-utilities/request-password-reset/client';
import { authClient } from '../../../../client/client';

export const requestPasswordReset = requestPasswordResetUtility({ authClient });
