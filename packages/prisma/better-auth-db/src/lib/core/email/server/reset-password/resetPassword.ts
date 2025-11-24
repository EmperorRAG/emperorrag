import { resetPasswordServer as resetPasswordUtility } from '@emperorrag/better-auth-utilities/core/email/server/reset-password/resetPassword';
import { authServer } from '../../../../server/server';

export const resetPassword = resetPasswordUtility({ authServer });
