'use client';

import { useState } from 'react';

import styles from './page.module.css';
import useAdminPermissions from './useAdminPermissions';

const AdminUserDialogs = () => {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const {
    isLoading,
    canManageUsers,
    canManageSessions,
    canImpersonate,
    permissions,
    error,
  } = useAdminPermissions();

  const userActions = permissions['user'] ?? [];
  const sessionActions = permissions['session'] ?? [];
  const canUpdateUser = canManageUsers || userActions.includes('update');
  const canBanUser = userActions.includes('ban');
  const canUnbanUser = userActions.includes('unban');
  const canRemoveUser = userActions.includes('delete');
  const canRevokeSessions = canManageSessions || sessionActions.includes('revoke');

  // TODO(plan §5): Replace placeholder markup with actual dialog components.
  // TODO(plan §5): Integrate optimistic updates with actions.ts workflows.

  return (
    <div className={styles['placeholder']}>
      Admin user dialogs placeholder (user: {activeUserId ?? 'none'})
      {error ? <div role="status">{error}</div> : null}
      <div className={styles['toolbarActions']}>
        <button
          type="button"
          onClick={() => {
            setActiveUserId('new-user');
            // TODO(plan §5): Trigger createAdminUser action flow.
          }}
          disabled={isLoading || !canManageUsers}
        >
          Open create user dialog
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            // TODO(plan §5): Launch update dialog with selected user.
            void identifier;
          }}
          disabled={isLoading || !canUpdateUser}
        >
          Open update dialog
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            void identifier;
            // TODO(plan §5): Connect to banAdminUser action.
          }}
          disabled={isLoading || !canBanUser}
        >
          Ban user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            void identifier;
            // TODO(plan §5): Connect to unbanAdminUser action.
          }}
          disabled={isLoading || !canUnbanUser}
        >
          Unban user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            void identifier;
            // TODO(plan §5): Connect to impersonateAdminUser action.
          }}
          disabled={isLoading || !canImpersonate}
        >
          Impersonate user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            void identifier;
            // TODO(plan §5): Connect to removeAdminUser action.
          }}
          disabled={isLoading || !canRemoveUser}
        >
          Remove user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            void identifier;
            // TODO(plan §5): Connect to revokeAdminSession action.
          }}
          disabled={isLoading || !canRevokeSessions}
        >
          Revoke sessions
        </button>
      </div>
    </div>
  );
};

export default AdminUserDialogs;
