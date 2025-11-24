import { unlinkAccountServer as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/core/account/server/unlink-account/unlinkAccount';
import { authServer } from '../../../../server/server';

export const unlinkAccount = unlinkAccountUtility({ authServer });
