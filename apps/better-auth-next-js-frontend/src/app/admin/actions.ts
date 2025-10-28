'use server';

import { Effect, Match, pipe } from 'effect';
import { filter, map } from 'effect/Array';
import * as Option from 'effect/Option';
import { cookies } from 'next/headers';

/**
 * Query parameters supported by Better Auth admin list endpoints.
 */
export type AdminQuery = Readonly<Record<string, unknown>>;

/**
 * JSON payload forwarded to Better Auth admin mutation endpoints.
 */
export type AdminPayload = Readonly<Record<string, unknown>>;

/**
 * Representation of a Better Auth admin user record.
 */
export interface AdminUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role?: string | ReadonlyArray<string>;
  readonly emailVerified?: boolean;
  readonly banned?: boolean;
  readonly banReason?: string | null;
  readonly banExpiresAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly [key: string]: unknown;
}

/**
 * Response payload returned from `/admin/list-users`.
 */
export interface AdminUsersResponse {
  readonly users: ReadonlyArray<AdminUser>;
  readonly total: number;
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Representation of a Better Auth session record.
 */
export interface AdminSession {
  readonly id: string;
  readonly userId: string;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly ipAddress?: string | null;
  readonly userAgent?: string | null;
  readonly [key: string]: unknown;
}

/**
 * Response payload produced by `/admin/impersonate-user`.
 */
export interface AdminImpersonationResponse {
  readonly session: AdminSession;
}

interface AdminActionError {
  readonly _tag: 'AdminNetworkError' | 'AdminHttpError' | 'AdminDecodeError';
  readonly message: string;
  readonly status?: number;
  readonly cause?: unknown;
  readonly responseBody?: unknown;
}

type AdminActionResult<T> = Promise<T>;
type AdminActionVoidResult = Promise<void>;

interface AdminRequestConfig<TResponse> {
  readonly path: string;
  readonly method: AdminHttpMethod;
  readonly query?: AdminQuery;
  readonly body?: AdminPayload;
}

type AdminHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

const DEFAULT_ADMIN_API_BASE_URL = 'http://localhost:3333/api/auth/';

const ADMIN_API_BASE_URL = pipe(
  Option.fromNullable(process.env.BETTER_AUTH_ADMIN_API_BASE_URL),
  Option.filter((value) => value.length > 0),
  Option.match({
    onSome: (value) => value,
    onNone: () => DEFAULT_ADMIN_API_BASE_URL,
  })
);

/**
 * Adds a trailing slash to a base URL when missing.
 *
 * @pure Ensures deterministic URL formatting without side effects.
 * @description Guarantees that the base URL terminates with exactly one slash to simplify path concatenation.
 *
 * @fp-pattern Predicate refinement
 *
 * @param value - The base URL to normalize.
 * @returns {string} The normalized base URL with a trailing slash.
 */
const ensureTrailingSlash = (value: string): string =>
  Match.value(value.endsWith('/')).pipe(
    Match.when(true, () => value),
    Match.orElse(() => `${value}/`)
  );

/**
 * Removes the leading slash from a relative path when present.
 *
 * @pure Maintains referential transparency by returning a derived value.
 * @description Normalizes paths before joining them with the computed base URL, preventing duplicate separators.
 *
 * @fp-pattern Normalizer
 *
 * @param path - The path to normalize.
 * @returns {string} The path without a leading slash.
 */
const stripLeadingSlash = (path: string): string =>
  Match.value(path.startsWith('/')).pipe(
    Match.when(true, () => path.slice(1)),
    Match.orElse(() => path)
  );

/**
 * Serializes query parameter values into strings.
 *
 * @pure Converts supported scalar types to their string representation without side effects.
 * @description Ensures query parameters remain stable across repeated invocations.
 *
 * @fp-pattern Total function
 *
 * @param value - The value to serialize.
 * @returns {string} The string representation of the provided value.
 */
const formatQueryValue = (value: unknown): string =>
  Match.value(typeof value).pipe(
    Match.when('string', () => value as string),
    Match.when('number', () => String(value)),
    Match.when('boolean', () => ((value as boolean) ? 'true' : 'false')),
    Match.orElse(() => String(value))
  );

/**
 * Builds a URL query string from a record of parameters.
 *
 * @pure Maintains immutability by returning a new string for each invocation.
 * @description Filters out nullish values, serializes the remainder, and joins them using `&` separators.
 *
 * @fp-pattern Transducer
 *
 * @param query - The optional record of query parameters.
 * @returns {string | undefined} A URL query string or `undefined` when no parameters are provided.
 */
const createQueryString = (query?: AdminQuery): string | undefined =>
  pipe(
    Option.fromNullable(query),
    Option.map((params) =>
      pipe(
        Object.entries(params) as ReadonlyArray<[string, unknown]>,
        filter(([, value]) =>
          pipe(
            Option.fromNullable(value),
            Option.match({
              onSome: () => true,
              onNone: () => false,
            })
          )
        ),
        map(([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(formatQueryValue(value))}`
        ),
        (segments) => segments.join('&')
      )
    ),
    Option.filter((value) => value.length > 0),
    Option.match({
      onSome: (value) => value,
      onNone: () => undefined,
    })
  );

/**
 * Computes the absolute URL for a Better Auth admin endpoint.
 *
 * @pure Does not mutate inputs and always returns the same URL for identical arguments.
 * @description Joins the configured base URL with the supplied path and optional query string.
 *
 * @fp-pattern Constructor
 *
 * @param path - The admin endpoint path.
 * @param query - Optional query parameters appended to the URL.
 * @returns {string} The absolute URL pointing at the Better Auth admin endpoint.
 */
const createAdminUrl = (path: string, query?: AdminQuery): string => {
  const base = ensureTrailingSlash(ADMIN_API_BASE_URL);
  const relativePath = stripLeadingSlash(path);
  const url = new URL(relativePath, base);
  const serializedQuery = createQueryString(query);

  return pipe(
    Option.fromNullable(serializedQuery),
    Option.match({
      onSome: (value) => {
        url.search = value;
        return url.toString();
      },
      onNone: () => url.toString(),
    })
  );
};

/**
 * Collects headers that should be forwarded to the Better Auth backend.
 *
 * @description Preserves session cookies and selected request headers so the backend can authenticate the caller.
 *
 * @returns {Headers} Headers pre-populated with cookies and user-agent details.
 */
const collectForwardHeaders = (): Headers => {
  const baseHeaders = new Headers();
  baseHeaders.set('Accept', 'application/json');

  pipe(
    cookies().toString(),
    (raw) => raw.trim(),
    Option.fromNullable,
    Option.filter((value) => value.length > 0),
    Option.match({
      onSome: (value) => {
        baseHeaders.set('cookie', value);
      },
      onNone: () => undefined,
    })
  );

  return baseHeaders;
};

/**
 * Produces a `RequestInit` configuration for invoking Better Auth admin endpoints.
 *
 * @pure Returns a new immutable object describing the outgoing request.
 * @description Applies session cookies, authentication headers, and JSON serialization when a payload is present.
 *
 * @fp-pattern Builder
 *
 * @param method - The HTTP method to use.
 * @param body - Optional payload serialized as JSON.
 * @returns {RequestInit} The request configuration used by `fetch`.
 */
const createRequestInit = (method: AdminHttpMethod, body?: AdminPayload): RequestInit =>
  pipe(
    collectForwardHeaders(),
    (forwardedHeaders) =>
      pipe(
        Option.fromNullable(body),
        Option.match({
          onSome: (payload) => {
            forwardedHeaders.set('Content-Type', 'application/json');
            return {
              method,
              headers: forwardedHeaders,
              body: JSON.stringify(payload),
              credentials: 'include',
            } satisfies RequestInit;
          },
          onNone: () => ({
            method,
            headers: forwardedHeaders,
            credentials: 'include',
          }) satisfies RequestInit,
        })
      )
  );

const createNetworkError = (url: string, cause: unknown): AdminActionError => ({
  _tag: 'AdminNetworkError',
  message: `Unable to reach Better Auth admin endpoint at ${url}.`,
  cause,
});

const createHttpError = (status: number, responseBody: unknown): AdminActionError => ({
  _tag: 'AdminHttpError',
  message: `Better Auth admin endpoint responded with HTTP ${status}.`,
  status,
  responseBody,
});

const createDecodeError = (message: string, cause: unknown): AdminActionError => ({
  _tag: 'AdminDecodeError',
  message,
  cause,
});

const readErrorBody = (response: Response): Effect.Effect<string | undefined, AdminActionError> =>
  pipe(
    Effect.tryPromise({
      try: () => response.text(),
      catch: (cause) => createDecodeError('Failed to read error response body.', cause),
    }),
    Effect.map((content) =>
      Match.value(content.trim()).pipe(
        Match.when('', () => undefined),
        Match.orElse(() => content)
      )
    )
  );

const readSuccessBody = <T>(response: Response): Effect.Effect<T, AdminActionError> =>
  Effect.gen(function* () {
    const raw = yield* Effect.tryPromise({
      try: () => response.text(),
      catch: (cause) => createDecodeError('Failed to read response body.', cause),
    });

    return yield* Match.value(raw.trim()).pipe(
      Match.when('', () => Effect.succeed(undefined as T)),
      Match.orElse(() =>
        Effect.try({
          try: () => JSON.parse(raw) as T,
          catch: (cause) => createDecodeError('Failed to parse JSON response body.', cause),
        })
      )
    );
  });

const handleResponse = <T>(response: Response): Effect.Effect<T, AdminActionError> =>
  Match.value(response.ok).pipe(
    Match.when(true, () => readSuccessBody<T>(response)),
    Match.orElse(() =>
      Effect.gen(function* () {
        const body = yield* readErrorBody(response);
        return yield* Effect.fail(createHttpError(response.status, body));
      })
    )
  );

const executeAdminRequest = <TResponse>(
  config: AdminRequestConfig<TResponse>
): Effect.Effect<TResponse, AdminActionError> =>
  Effect.gen(function* () {
    const url = createAdminUrl(config.path, config.query);
    const requestInit = createRequestInit(config.method, config.body);

    const response = yield* Effect.tryPromise({
      try: () => fetch(url, requestInit),
      catch: (cause) => createNetworkError(url, cause),
    });

    return yield* handleResponse<TResponse>(response);
  });

/**
 * Retrieves paginated admin users via the Better Auth NestJS bridge.
 *
 * @description Forwards the caller's cookies to ensure the backend authorizes the request with the active Better Auth session.
 *
 * @param query - Optional query parameters controlling pagination, filtering, and sorting.
 * @returns {Promise<AdminUsersResponse>} Resolves with the paginated admin user collection.
 */
export const listAdminUsers = async (query: AdminQuery): AdminActionResult<AdminUsersResponse> =>
  Effect.runPromise(
    executeAdminRequest<AdminUsersResponse>({
      path: 'admin/list-users',
      method: 'GET',
      query,
    })
  );

/**
 * Creates a new user through the Better Auth admin API.
 *
 * @description Delegates user creation to the NestJS microservice, returning the created user on success.
 *
 * @param payload - The user attributes required by Better Auth.
 * @returns {Promise<AdminUser>} Resolves with the created user record.
 */
export const createAdminUser = async (payload: AdminPayload): AdminActionResult<AdminUser> =>
  Effect.runPromise(
    executeAdminRequest<AdminUser>({
      path: 'admin/create-user',
      method: 'POST',
      body: payload,
    })
  );

/**
 * Updates an existing user using the admin API.
 *
 * @description Sends the updated field patch to Better Auth and returns the latest user state.
 *
 * @param payload - The update payload containing `userId` and fields to mutate.
 * @returns {Promise<AdminUser>} Resolves with the updated user record.
 */
export const updateAdminUser = async (payload: AdminPayload): AdminActionResult<AdminUser> =>
  Effect.runPromise(
    executeAdminRequest<AdminUser>({
      path: 'admin/update-user',
      method: 'POST',
      body: payload,
    })
  );

/**
 * Bans a user via the Better Auth admin API.
 *
 * @description Forwards the ban request and resolves when Better Auth confirms completion.
 *
 * @param payload - The payload containing the target user identifier and ban metadata.
 * @returns {Promise<void>} Resolves once the ban operation completes.
 */
export const banAdminUser = async (payload: AdminPayload): AdminActionVoidResult =>
  Effect.runPromise(
    pipe(
      executeAdminRequest<Record<string, unknown>>({
        path: 'admin/ban-user',
        method: 'POST',
        body: payload,
      }),
      Effect.map(() => undefined)
    )
  );

/**
 * Removes an existing ban from a user.
 *
 * @description Delegates the unban workflow to Better Auth.
 *
 * @param payload - The payload identifying the user to unban.
 * @returns {Promise<void>} Resolves when the user has been unbanned.
 */
export const unbanAdminUser = async (payload: AdminPayload): AdminActionVoidResult =>
  Effect.runPromise(
    pipe(
      executeAdminRequest<Record<string, unknown>>({
        path: 'admin/unban-user',
        method: 'POST',
        body: payload,
      }),
      Effect.map(() => undefined)
    )
  );

/**
 * Creates an impersonation session for a target user.
 *
 * @description Returns the Better Auth session that enables the admin to impersonate the specified user.
 *
 * @param payload - The payload containing the user identifier to impersonate.
 * @returns {Promise<AdminImpersonationResponse>} Resolves with the impersonation session payload.
 */
export const impersonateAdminUser = async (
  payload: AdminPayload,
): AdminActionResult<AdminImpersonationResponse> =>
  Effect.runPromise(
    executeAdminRequest<AdminImpersonationResponse>({
      path: 'admin/impersonate-user',
      method: 'POST',
      body: payload,
    })
  );

/**
 * Lists sessions belonging to the specified user.
 *
 * @description Calls Better Auth to retrieve active session metadata for auditing and revocation workflows.
 *
 * @param payload - The payload containing the `userId` whose sessions should be listed.
 * @returns {Promise<ReadonlyArray<AdminSession>>} Resolves with active session records.
 */
export const listAdminSessions = async (
  payload: AdminPayload,
): AdminActionResult<ReadonlyArray<AdminSession>> =>
  Effect.runPromise(
    executeAdminRequest<ReadonlyArray<AdminSession>>({
      path: 'admin/list-user-sessions',
      method: 'POST',
      body: payload,
    })
  );

/**
 * Revokes a single Better Auth session by its identifier.
 *
 * @description Invalidates the session token on the Better Auth backend.
 *
 * @param payload - The payload containing the session token to revoke.
 * @returns {Promise<void>} Resolves when the session has been revoked.
 */
export const revokeAdminSession = async (
  payload: AdminPayload,
): AdminActionVoidResult =>
  Effect.runPromise(
    pipe(
      executeAdminRequest<Record<string, unknown>>({
        path: 'admin/revoke-user-session',
        method: 'POST',
        body: payload,
      }),
      Effect.map(() => undefined)
    )
  );

/**
 * Removes a user permanently from Better Auth storage.
 *
 * @description Triggers the hard delete workflow for the specified user.
 *
 * @param payload - The payload identifying the user to remove.
 * @returns {Promise<void>} Resolves when Better Auth confirms the removal.
 */
export const removeAdminUser = async (payload: AdminPayload): AdminActionVoidResult =>
  Effect.runPromise(
    pipe(
      executeAdminRequest<Record<string, unknown>>({
        path: 'admin/remove-user',
        method: 'POST',
        body: payload,
      }),
      Effect.map(() => undefined)
    )
  );
