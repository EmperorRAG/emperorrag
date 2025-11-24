import { resetPasswordClient as resetPasswordUtility } from '@emperorrag/better-auth-utilities/core/email/client/reset-password/resetPassword';
import { authClient } from '../../../../client/client';

export const resetPassword = resetPasswordUtility({ authClient });
