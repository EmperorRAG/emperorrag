/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/shared/session.error.ts
 * @description Server-side error types for session authentication operations.
 * @deprecated Use core.error.ts instead.
 */

import {
    CoreAuthServerDependenciesError,
    CoreAuthServerInputError,
    CoreAuthServerApiError,
    CoreAuthServerDataMissingError,
    CoreAuthServerSessionError,
    CoreAuthServerError,
    validateInputEffect,
    mapBetterAuthApiErrorToCoreAuthError,
    describeCoreAuthError
} from '../../shared/core.error';

export { validateInputEffect };

export const SessionAuthServerDependenciesError = CoreAuthServerDependenciesError;
export type SessionAuthServerDependenciesError = CoreAuthServerDependenciesError;

export const SessionAuthServerInputError = CoreAuthServerInputError;
export type SessionAuthServerInputError = CoreAuthServerInputError;

export const SessionAuthServerApiError = CoreAuthServerApiError;
export type SessionAuthServerApiError = CoreAuthServerApiError;

export const SessionAuthServerDataMissingError = CoreAuthServerDataMissingError;
export type SessionAuthServerDataMissingError = CoreAuthServerDataMissingError;

export const SessionAuthServerSessionError = CoreAuthServerSessionError;
export type SessionAuthServerSessionError = CoreAuthServerSessionError;

export type SessionAuthServerError = CoreAuthServerError;

export const mapBetterAuthApiErrorToSessionAuthError = mapBetterAuthApiErrorToCoreAuthError;
export const describeSessionAuthError = describeCoreAuthError;
