import { resetPassword as resetPasswordUtility } from '@emperorrag/better-auth-utilities/core/email/client/reset-password/resetPassword';
import { authClient } from '../../../../auth/auth';

export const resetPassword = resetPasswordUtility({ authClient });
