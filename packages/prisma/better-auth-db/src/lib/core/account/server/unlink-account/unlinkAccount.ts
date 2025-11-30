import { unlinkAccountServer as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/unlink-account/server';
import { authServer } from '../../../../server/server';

export const unlinkAccount = unlinkAccountUtility({ authServer });
