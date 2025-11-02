/**
 * @module AdminPage
 * @description Renders the Better Auth admin dashboard while adhering to an imperative declarative programming paradigm for server-side data access and tabular presentation.
 */
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

/**
 * @function toOptionalDate
 * @description Normalizes nullable timestamp strings within the imperative declarative transformation flow.
 * @param value - Raw ISO timestamp that may be nullish when Better Auth omits ban metadata.
 * @returns A concrete {@link Date}, `null`, or `undefined` to mirror the original signal precisely.
 */
const toOptionalDate = (value: string | null | undefined): Date | null | undefined => {
  // Interpret nullable ISO timestamps as Date instances or propagate absence markers.
  if (value === undefined) {
    return undefined;
  }

  // Preserve explicit nulls so downstream components can distinguish unset dates.
  if (value === null) {
    return null;
  }

  return new Date(value);
};

/**
 * @function parseUserDates
 * @description Converts serialized Better Auth user timestamps into runtime {@link Date} objects as part of the imperative declarative normalization pass.
 * @param user - The API response payload carrying stringified temporal metadata.
 * @returns A fully typed {@link AdminUser} with temporal fields ready for presentation logic.
 */
const parseUserDates = (user: AdminUserResponse): AdminUser => ({
  ...user,
  createdAt: new Date(user.createdAt),
  updatedAt: new Date(user.updatedAt),
  bannedUntil: toOptionalDate(user.bannedUntil),
  banExpires: toOptionalDate(user.banExpires),
});

/**
 * @description Fetches Better Auth users via the administrative listing endpoint while embracing an imperative declarative programming paradigm for robust control-flow narration.
 * @returns An object containing the normalized user list along with an optional fault message when retrieval fails.
 */
const fetchUsers = async (): Promise<FetchUsersResult> => {
  console.log("🚀 ~ fetchUsers ~ USERS_URL:", USERS_URL)
  try {
    const response = await fetch(USERS_URL, {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
      },
    });

    // Surface friendly guidance when the backend indicates a non-successful status.
    if (!response.ok) {
      console.error(
        `Failed to fetch Better Auth users. Status: ${response.status} ${response.statusText}`
      );

      return {
        data: [],
        error: 'We could not load Better Auth users. Please try again shortly.',
      };
    }

    // Marshal raw payload into strong domain types with normalized temporal fields.
    const payload = (await response.json()) as ReadonlyArray<AdminUserResponse>;

    const data: ReadonlyArray<AdminUser> = payload.map((user) => parseUserDates(user));

    return {
      data,
    };
  } catch (error) {
    // Fail safely by logging unexpected communication issues for observability.
    console.error('Unexpected error while fetching Better Auth users.', error);

    return {
      data: [],
      error: 'A connection error prevented loading Better Auth users.',
    };
  }
};

/**
 * @constant createdAtFormatter
 * @description Formats temporal fields sourced from Better Auth while maintaining declarative display semantics.
 */
const createdAtFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/**
 * @constant columns
 * @description Declarative column configuration for the Better Auth datagrid presented through the imperative render pipeline.
 */
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

/**
 * @function AdminPage
 * @description Server component that orchestrates the imperative declarative fetch-and-render cycle for Better Auth users.
 * @returns React node describing the administrative datagrid section.
 */
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
