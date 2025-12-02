import { sendVerificationEmailClient as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/send-verification-email/client';
import { authClient } from '../../../../client/client';

export const sendVerificationEmailClient = sendVerificationEmailUtility({ authClient });
