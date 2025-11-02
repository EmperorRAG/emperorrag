import { Datagrid } from '@emperorrag/components';
import type { User } from '@emperorrag/better-auth-utilities';
import styles from './page.module.css';

const BASE_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3333';
const USERS_ENDPOINT = '/api/auth/admin/list-users';
const USERS_URL = new URL(USERS_ENDPOINT, BASE_URL).toString();

type AdminUser = User;

type AdminUserResponse = Omit<
  AdminUser,
  'createdAt' | 'updatedAt' | 'bannedUntil' | 'banExpires'
> & {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly bannedUntil?: string | null;
  readonly banExpires?: string | null;
};

interface FetchUsersResult {
  readonly data: ReadonlyArray<AdminUser>;
  readonly error?: string;
}

const toOptionalDate = (value: string | null | undefined): Date | null | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return new Date(value);
};

const parseUserDates = (user: AdminUserResponse): AdminUser => ({
  ...user,
  createdAt: new Date(user.createdAt),
  updatedAt: new Date(user.updatedAt),
  bannedUntil: toOptionalDate(user.bannedUntil),
  banExpires: toOptionalDate(user.banExpires),
});

const fetchUsers = async (): Promise<FetchUsersResult> => {
  console.log("🚀 ~ fetchUsers ~ USERS_URL:", USERS_URL)
  try {
    const response = await fetch(USERS_URL, {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch Better Auth users. Status: ${response.status} ${response.statusText}`
      );

      return {
        data: [],
        error: 'We could not load Better Auth users. Please try again shortly.',
      };
    }

    const payload = (await response.json()) as ReadonlyArray<AdminUserResponse>;

    const data: ReadonlyArray<AdminUser> = payload.map((user) => parseUserDates(user));

    return {
      data,
    };
  } catch (error) {
    console.error('Unexpected error while fetching Better Auth users.', error);

    return {
      data: [],
      error: 'A connection error prevented loading Better Auth users.',
    };
  }
};

const createdAtFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const columns = [
  {
    id: 'id',
    header: 'User ID',
    accessor: (user: AdminUser) => user.id,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (user: AdminUser) => user.email,
  },
  {
    id: 'name',
    header: 'Name',
    accessor: (user: AdminUser) => user.name,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (user: AdminUser) => (user.banned ? 'Suspended' : 'Active'),
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessor: (user: AdminUser) => createdAtFormatter.format(user.createdAt),
  },
] as const;

const AdminPage = async () => {
  const { data: users, error } = await fetchUsers();

  return (
    <section className={styles.adminPage}>
      <Datagrid
        data={users}
        columns={columns}
        caption="Better Auth admin users"
        rowId={(user: AdminUser) => user.id}
        emptyState={<span>No Better Auth users found yet.</span>}
        errorState={error ? <span>{error}</span> : undefined}
      />
    </section>
  );
};

export default AdminPage;
