import { resetPasswordServer as resetPasswordUtility } from '@emperorrag/better-auth-utilities/reset-password/server';
import { authServer } from '../../../../server/server';

export const resetPassword = resetPasswordUtility({ authServer });
