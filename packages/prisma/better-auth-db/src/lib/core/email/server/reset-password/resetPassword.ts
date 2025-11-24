import { resetPasswordServer as resetPasswordUtility } from '@emperorrag/better-auth-utilities/core/email/server/reset-password/resetPassword';
import { authServer } from '../../../../auth/auth';

export const resetPassword = resetPasswordUtility({ authServer });
