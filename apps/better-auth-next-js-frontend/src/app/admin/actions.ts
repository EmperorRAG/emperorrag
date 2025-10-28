'use server';

/**
 * Server action scaffolding for Better Auth admin workflows.
 *
 * TODO(plan §3): Wire each action to the @thallesp/nestjs-better-auth endpoints.
 */

type AdminQuery = Readonly<Record<string, unknown>>;
type AdminPayload = Readonly<Record<string, unknown>>;

type AdminActionResult = Promise<unknown>;
type AdminActionVoidResult = Promise<void>;

const raiseUnimplemented = (message: string): never => {
  throw new Error(message);
};

export const listAdminUsers = async (query: AdminQuery): AdminActionResult => {
  void query;
  // TODO(plan §3): Invoke exposed list-users endpoint and return structured data.
  // TODO(plan §3): Apply caching and revalidation strategy once data layer defined.
  return raiseUnimplemented('listAdminUsers action not implemented.');
};

export const createAdminUser = async (payload: AdminPayload): AdminActionResult => {
  void payload;
  // TODO(plan §5): Call create-user admin endpoint and trigger optimistic refresh.
  return raiseUnimplemented('createAdminUser action not implemented.');
};

export const updateAdminUser = async (payload: AdminPayload): AdminActionResult => {
  void payload;
  // TODO(plan §5): Call update-user admin endpoint and update datagrid row state.
  return raiseUnimplemented('updateAdminUser action not implemented.');
};

export const banAdminUser = async (payload: AdminPayload): AdminActionVoidResult => {
  void payload;
  // TODO(plan §5): Call ban-user admin endpoint and invalidate cached sessions.
  return raiseUnimplemented('banAdminUser action not implemented.');
};

export const unbanAdminUser = async (payload: AdminPayload): AdminActionVoidResult => {
  void payload;
  // TODO(plan §5): Call unban-user admin endpoint and display confirmation toast.
  return raiseUnimplemented('unbanAdminUser action not implemented.');
};

export const impersonateAdminUser = async (
  payload: AdminPayload,
): AdminActionResult => {
  void payload;
  // TODO(plan §5): Call impersonate-user endpoint then return redirect/session token.
  return raiseUnimplemented('impersonateAdminUser action not implemented.');
};

export const listAdminSessions = async (
  payload: AdminPayload,
): AdminActionResult => {
  void payload;
  // TODO(plan §5): Call list-user-sessions endpoint with pagination controls.
  return raiseUnimplemented('listAdminSessions action not implemented.');
};

export const revokeAdminSession = async (
  payload: AdminPayload,
): AdminActionVoidResult => {
  void payload;
  // TODO(plan §5): Call revoke-user-session endpoint and surface toast feedback.
  return raiseUnimplemented('revokeAdminSession action not implemented.');
};

export const removeAdminUser = async (payload: AdminPayload): AdminActionVoidResult => {
  void payload;
  // TODO(plan §5): Call remove-user endpoint and refresh datagrid data source.
  return raiseUnimplemented('removeAdminUser action not implemented.');
};
