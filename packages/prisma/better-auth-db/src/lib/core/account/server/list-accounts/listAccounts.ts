import { listAccountsServer as listAccountsUtility } from '@emperorrag/better-auth-utilities/core/account/server/list-accounts/listAccounts';
import { authServer } from '../../../../server/server';

export const listAccounts = listAccountsUtility({ authServer });
