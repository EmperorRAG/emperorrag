import { sendVerificationEmailClient as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/core/email/client/send-verification-email/sendVerificationEmail';
import { authClient } from '../../../../auth/auth';

export const sendVerificationEmail = sendVerificationEmailUtility({ authClient });
