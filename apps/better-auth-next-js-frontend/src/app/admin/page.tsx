/**
 * @module AdminPage
 * @description Renders the Better Auth admin dashboard while adhering to an imperative declarative programming paradigm for server-side data access and tabular presentation.
 */
import { Datagrid } from '@emperorrag/components';
import type { User } from '@emperorrag/prisma-better-auth-db/types';
import styles from './page.module.css';

const BASE_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3333';
const USERS_ENDPOINT = '/api/auth/admin/list-users';
const USERS_URL = new URL(USERS_ENDPOINT, BASE_URL).toString();
const SIGN_IN_ENDPOINT = '/api/auth/sign-in/email';
const SIGN_IN_URL = new URL(SIGN_IN_ENDPOINT, BASE_URL).toString();
const ADMIN_EMAIL = process.env.BETTER_AUTH_NEXT_JS_FRONTEND_EMAIL;
const ADMIN_PASSWORD = process.env.BETTER_AUTH_NEXT_JS_FRONTEND_PASSWORD;

type AdminUser = User;

type AdminUserResponse = Omit<
  AdminUser,
  'createdAt' | 'updatedAt' | 'banExpires'
> & {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly banExpires?: string | null;
};

interface FetchUsersResult {
  readonly data: ReadonlyArray<AdminUser>;
  readonly error?: string;
}

interface SignInResult {
  readonly cookieHeader?: string;
  readonly error?: string;
}

/**
 * @function splitSetCookieHeader
 * @pure Decomposes a combined `set-cookie` header value into individual cookie directives.
 * @description Handles comma-delimited cookie segments while preserving embedded attribute commas.
 * @param headerValue - Raw `set-cookie` header string potentially containing multiple cookies.
 * @returns Individual cookie directive strings extracted from the header.
 */
const splitSetCookieHeader = (headerValue: string): ReadonlyArray<string> =>
  headerValue.split(/,(?=\s*[^\s]+=)/g).map((segment) => segment.trim());

/**
 * @function collectSetCookies
 * @pure Retrieves all `set-cookie` header values from a fetch response.
 * @description Supports the Node.js fetch extension alongside the standard header API.
 * @param headers - Response headers instance supplied by the Better Auth microservice.
 * @returns Discrete `set-cookie` directives describing the issued session cookies.
 */
const collectSetCookies = (headers: Headers): ReadonlyArray<string> => {
  const headersWithGetSetCookie = headers as Headers & {
    readonly getSetCookie?: () => string[];
  };

  if (typeof headersWithGetSetCookie.getSetCookie === 'function') {
    return headersWithGetSetCookie.getSetCookie();
  }

  const rawHeader = headers.get('set-cookie');

  if (!rawHeader) {
    return [];
  }

  return splitSetCookieHeader(rawHeader);
};

/**
 * @function toCookieHeader
 * @pure Converts `set-cookie` directives into a `cookie` request header payload.
 * @description Strips cookie attributes while retaining the `name=value` pairs expected by Better Auth.
 * @param setCookies - Cookie directives issued by the sign-in response.
 * @returns Canonical `cookie` header value ready for authenticated follow-up requests.
 */
const toCookieHeader = (setCookies: ReadonlyArray<string>): string =>
  setCookies
    .map((setCookie) => {
      const [cookiePair] = setCookie.split(';');
      return cookiePair?.trim() ?? '';
    })
    .filter((cookiePair) => cookiePair.length > 0)
    .join('; ');

/**
 * @function performAdminSignIn
 * @description Authenticates with the Better Auth microservice using seeded admin credentials.
 * @returns Result containing an authenticated cookie header or a user-facing error message.
 */
const performAdminSignIn = async (): Promise<SignInResult> => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Better Auth admin credentials are missing from the environment.');

    return {
      error:
        'Unable to authenticate with Better Auth. Confirm the admin email and password environment variables.',
    };
  }

  try {
    console.log('Attempting Better Auth admin sign-in via:', SIGN_IN_URL);

    const response = await fetch(SIGN_IN_URL, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        rememberMe: true,
      }),
    });

    if (!response.ok) {
      console.error(
        `Better Auth admin sign-in failed. Status: ${response.status} ${response.statusText}`
      );

      return {
        error: 'Authentication with Better Auth failed. Please verify the admin credentials.',
      };
    }

    const sessionCookies = collectSetCookies(response.headers);

    if (sessionCookies.length === 0) {
      console.error('Better Auth admin sign-in succeeded but returned no session cookies.');

      return {
        error: 'Better Auth did not issue a session cookie. Please retry the request.',
      };
    }

    const cookieHeader = toCookieHeader(sessionCookies);

    console.log('Successfully authenticated with Better Auth admin API.');

    return {
      cookieHeader,
    };
  } catch (error) {
    console.error('Unexpected error during Better Auth admin sign-in.', error);

    return {
      error: 'A connection error prevented Better Auth admin authentication.',
    };
  }
};

/**
 * @function toOptionalDate
 * @description Normalizes nullable timestamp strings within the imperative declarative transformation flow.
 * @param value - Raw ISO timestamp that may be nullish when Better Auth omits ban metadata.
 * @returns A concrete {@link Date} or `null` to match Prisma's nullable DateTime type.
 */
const toOptionalDate = (value: string | null | undefined): Date | null => {
  // Interpret nullable ISO timestamps as Date instances or null.
  if (value === undefined || value === null) {
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
  banExpires: toOptionalDate(user.banExpires),
});

/**
 * @description Fetches Better Auth users via the administrative listing endpoint while embracing an imperative declarative programming paradigm for robust control-flow narration.
 * @returns An object containing the normalized user list along with an optional fault message when retrieval fails.
 */
const fetchUsers = async (): Promise<FetchUsersResult> => {
  // Trace the administrative endpoint invoked for Better Auth user retrieval.
  console.log('🚀 ~ fetchUsers ~ USERS_URL:', USERS_URL);

  const { cookieHeader, error: authenticationError } = await performAdminSignIn();

  if (!cookieHeader || authenticationError) {
    return {
      data: [],
      error:
        authenticationError ??
        'Better Auth authentication did not return a session cookie. Please try again shortly.',
    };
  }

  try {
    const response = await fetch(USERS_URL, {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        cookie: cookieHeader,
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
    const payload = (await response.json()) as { users: ReadonlyArray<AdminUserResponse> };

    console.log('🚀 ~ fetchUsers ~ payload:', payload);

    const data: ReadonlyArray<AdminUser> = payload.users.map((user) => parseUserDates(user));

    // Capture the total number of administrative users received for Console Ninja monitoring.
    console.log('🚀 ~ fetchUsers ~ data.length:', data.length);

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

  // Surface the rendered user count alongside any Better Auth failure messaging.
  console.log('🚀 ~ AdminPage ~ { users.length, error }:', {
    usersLength: users.length,
    error,
  });

  return (
    <section className={styles.adminPage}>
      <Datagrid
        data={users}
        columns={columns}
        caption="Better Auth admin users"
        emptyState={<span>No Better Auth users found yet.</span>}
        errorState={error ? <span>{error}</span> : undefined}
      />
    </section>
  );
};

export default AdminPage;
