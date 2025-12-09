import { listAccountsServer as listAccountsUtility } from '@emperorrag/better-auth-utilities/list-accounts/server';
import { authServer } from '../../../../server/server';

export const listAccountsServer = listAccountsUtility({ authServer });
