/**
 * Server component scaffold for the Better Auth admin dashboard UI.
 */

import { Suspense } from 'react';

import styles from './page.module.css';
import AdminDashboardToolbar from './AdminDashboardToolbar';
import AdminUserDialogs from './AdminUserDialogs';

const AdminDashboardData = async () => {
  // TODO(plan §3): Invoke server actions to fetch paginated Better Auth users.
  // TODO(plan §4): Render the shared datagrid component with fetched data.
  return (
    <div className={styles['content']}>
      <div className={styles['placeholder']}>
        {/* TODO(plan §4): Replace with datagrid once data wiring is complete. */}
        Admin datagrid placeholder
      </div>
      <AdminUserDialogs
        onCreate={() => {
          // TODO(plan §5): Connect to createAdminUser action and modal workflow.
        }}
        onUpdate={() => {
          // TODO(plan §5): Connect to updateAdminUser action with selected record.
        }}
        onBan={() => {
          // TODO(plan §5): Connect to banAdminUser action and revalidation logic.
        }}
        onUnban={() => {
          // TODO(plan §5): Connect to unbanAdminUser action.
        }}
        onImpersonate={() => {
          // TODO(plan §5): Connect to impersonateAdminUser action then redirect.
        }}
        onRemove={() => {
          // TODO(plan §5): Connect to removeAdminUser action and refresh grid.
        }}
      />
    </div>
  );
};

const AdminDashboard = async () => {
  return (
    <section className={styles['container']}>
      <div className={styles['header']}>
        <h1>Admin dashboard</h1>
        <AdminDashboardToolbar
          onSearch={() => {
            // TODO(plan §5): Trigger listAdminUsers action with search params.
          }}
          onRefresh={() => {
            // TODO(plan §5): Revalidate server data when refresh is invoked.
          }}
        />
      </div>

      <Suspense
        fallback={(
          <div className={styles['placeholder']}>
            {/* TODO(plan §7): Replace with accessible loading indicator. */}
            Loading admin dashboard…
          </div>
        )}
      >
        <AdminDashboardData />
      </Suspense>
    </section>
  );
};

export default AdminDashboard;
