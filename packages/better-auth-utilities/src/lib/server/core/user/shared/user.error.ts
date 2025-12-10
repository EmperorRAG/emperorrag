/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/shared/user.error.ts
 * @description Server-side error types for user authentication operations.
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

export const UserAuthServerDependenciesError = CoreAuthServerDependenciesError;
export type UserAuthServerDependenciesError = CoreAuthServerDependenciesError;

export const UserAuthServerInputError = CoreAuthServerInputError;
export type UserAuthServerInputError = CoreAuthServerInputError;

export const UserAuthServerApiError = CoreAuthServerApiError;
export type UserAuthServerApiError = CoreAuthServerApiError;

export const UserAuthServerDataMissingError = CoreAuthServerDataMissingError;
export type UserAuthServerDataMissingError = CoreAuthServerDataMissingError;

export const UserAuthServerSessionError = CoreAuthServerSessionError;
export type UserAuthServerSessionError = CoreAuthServerSessionError;

export type UserAuthServerError = CoreAuthServerError;

export const mapBetterAuthApiErrorToUserAuthError = mapBetterAuthApiErrorToCoreAuthError;
export const describeUserAuthError = describeCoreAuthError;
