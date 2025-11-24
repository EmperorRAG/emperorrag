import { requestPasswordResetClient as requestPasswordResetUtility } from '@emperorrag/better-auth-utilities/core/email/client/request-password-reset/requestPasswordReset';
import { authClient } from '../../../../auth/auth';

export const requestPasswordReset = requestPasswordResetUtility({ authClient });
