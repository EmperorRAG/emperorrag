import { requestPasswordResetClient as requestPasswordResetUtility } from '@emperorrag/better-auth-utilities/core/email/client/request-password-reset/requestPasswordReset';
import { authClient } from '../../../../client/client';

export const requestPasswordReset = requestPasswordResetUtility({ authClient });
