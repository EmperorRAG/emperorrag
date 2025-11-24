import { listAccounts as listAccountsUtility } from '@emperorrag/better-auth-utilities/core/account/server/list-accounts/listAccounts';
import { authServer } from '../../../../auth/auth';

export const listAccounts = listAccountsUtility({ authServer });
