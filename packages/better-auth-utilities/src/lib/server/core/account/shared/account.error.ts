/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/shared/account.error.ts
 * @description Server-side error types for account authentication operations.
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

export const AccountAuthServerDependenciesError = CoreAuthServerDependenciesError;
export type AccountAuthServerDependenciesError = CoreAuthServerDependenciesError;

export const AccountAuthServerInputError = CoreAuthServerInputError;
export type AccountAuthServerInputError = CoreAuthServerInputError;

export const AccountAuthServerApiError = CoreAuthServerApiError;
export type AccountAuthServerApiError = CoreAuthServerApiError;

export const AccountAuthServerDataMissingError = CoreAuthServerDataMissingError;
export type AccountAuthServerDataMissingError = CoreAuthServerDataMissingError;

export const AccountAuthServerSessionError = CoreAuthServerSessionError;
export type AccountAuthServerSessionError = CoreAuthServerSessionError;

export type AccountAuthServerError = CoreAuthServerError;

export const mapBetterAuthApiErrorToAccountAuthError = mapBetterAuthApiErrorToCoreAuthError;
export const describeAccountAuthError = describeCoreAuthError;
