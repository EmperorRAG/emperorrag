import Datagrid from '@emperorrag/components'
import styles from './page.module.css';

const USERS_ENDPOINT = '/api/users';

type AdminUser = unknown;
// TODO(plan §2): Replace placeholder type with the shared User interface once exported from better-auth-utilities.

const fetchUsers = async (): Promise<ReadonlyArray<AdminUser>> => {
  // TODO(plan §3): Call GET /api/users from better-auth-nest-js-microservice, handle non-OK responses, and parse the JSON payload.
  // TODO(plan §1): Confirm the Better Auth microservice is reachable before enabling live data fetching.
  void USERS_ENDPOINT;
  return [] as const;
};

const AdminPage = async () => {
  // TODO(plan §6): Enforce admin-only access once the authentication/authorization strategy is finalized.
  const users = await fetchUsers();

  return (
    <section className={styles.adminPage}>
      {/* TODO(plan §4): Replace placeholder caption and configure columns for id, email, name, status, and createdAt. */}
      <Datagrid
        data={users}
        caption="TODO(plan §4): Provide admin users caption"
        isLoading
        emptyState={<span>TODO(plan §5): Provide empty state messaging</span>}
        errorState={<span>TODO(plan §5): Provide error state messaging</span>}
      />
    </section>
  );
};

export default AdminPage;
