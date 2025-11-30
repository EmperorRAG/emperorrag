import { resetPasswordClient as resetPasswordUtility } from '@emperorrag/better-auth-utilities/reset-password/client';
import { authClient } from '../../../../client/client';

export const resetPassword = resetPasswordUtility({ authClient });
