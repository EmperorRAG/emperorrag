'use client';

import { useState } from 'react';

import styles from './page.module.css';

const AdminUserDialogs = () => {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  // TODO(plan §5): Replace placeholder markup with actual dialog components.
  // TODO(plan §5): Integrate optimistic updates with actions.ts workflows.

  return (
    <div className={styles['placeholder']}>
      Admin user dialogs placeholder (user: {activeUserId ?? 'none'})
      <div className={styles['toolbarActions']}>
        <button
          type="button"
          onClick={() => {
            setActiveUserId('new-user');
            // TODO(plan §5): Trigger createAdminUser action flow.
          }}
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
        >
          Remove user
        </button>
      </div>
    </div>
  );
};

export default AdminUserDialogs;
