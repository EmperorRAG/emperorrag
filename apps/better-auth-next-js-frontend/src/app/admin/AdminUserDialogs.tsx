'use client';

import { useState } from 'react';

import styles from './page.module.css';

interface AdminUserDialogsProps {
  readonly onCreate?: () => void;
  readonly onUpdate?: (identifier: string) => void;
  readonly onBan?: (identifier: string) => void;
  readonly onUnban?: (identifier: string) => void;
  readonly onImpersonate?: (identifier: string) => void;
  readonly onRemove?: (identifier: string) => void;
}

const AdminUserDialogs = ({
  onCreate,
  onUpdate,
  onBan,
  onUnban,
  onImpersonate,
  onRemove,
}: AdminUserDialogsProps) => {
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
            if (onCreate) {
              onCreate();
            }
          }}
        >
          Open create user dialog
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            if (onUpdate) {
              onUpdate(identifier);
            }
            // TODO(plan §5): Launch update dialog with selected user.
          }}
        >
          Open update dialog
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            if (onBan) {
              onBan(identifier);
            }
          }}
        >
          Ban user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            if (onUnban) {
              onUnban(identifier);
            }
          }}
        >
          Unban user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            if (onImpersonate) {
              onImpersonate(identifier);
            }
          }}
        >
          Impersonate user
        </button>
        <button
          type="button"
          onClick={() => {
            const identifier = activeUserId ?? 'user-id';
            if (onRemove) {
              onRemove(identifier);
            }
          }}
        >
          Remove user
        </button>
      </div>
    </div>
  );
};

export default AdminUserDialogs;
