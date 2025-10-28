'use client';

import { useState } from 'react';

import styles from './page.module.css';
import useAdminPermissions from './useAdminPermissions';

interface AdminDashboardToolbarProps {
  readonly onSearch?: (value: string) => void;
  readonly onRefresh?: () => void;
}

const AdminDashboardToolbar = ({
  onSearch,
  onRefresh,
}: AdminDashboardToolbarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { isLoading, permissions } = useAdminPermissions();
  const canManageUsers = Array.isArray(permissions['user'])
    ? permissions['user'].includes('create')
    : false;

  // TODO(plan §4): Synchronize toolbar state with server actions from actions.ts.
  // TODO(plan §5): Hook buttons into workflow modals and optimistic updates.

  return (
    <div className={styles['toolbar']}>
      <input
        className={styles['toolbarInput']}
        placeholder="Search users"
        value={searchValue}
        onChange={(event) => {
          const value = event.target.value;
          setSearchValue(value);
          // TODO(plan §5): Debounce search and call onSearch with filters.
          if (onSearch) {
            onSearch(value);
          }
        }}
      />

      <div className={styles['toolbarActions']}>
        <button
          type="button"
          onClick={() => {
            // TODO(plan §5): Trigger create-user modal workflow.
          }}
          disabled={!canManageUsers}
        >
          New user
        </button>

        <button
          type="button"
          onClick={() => {
            if (onRefresh) {
              onRefresh();
            }
            // TODO(plan §5): Revalidate datagrid state after mutations.
          }}
          disabled={isLoading}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardToolbar;
