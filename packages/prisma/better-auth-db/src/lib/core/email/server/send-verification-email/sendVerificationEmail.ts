import { sendVerificationEmail as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/core/email/server/send-verification-email/sendVerificationEmail';
import { authServer } from '../../../../auth/auth';

export const sendVerificationEmail = sendVerificationEmailUtility({ authServer });
