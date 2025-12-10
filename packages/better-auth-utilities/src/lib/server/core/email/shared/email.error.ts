/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/shared/email.error.ts
 * @description Server-side error types for email authentication operations.
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

export const EmailAuthServerDependenciesError = CoreAuthServerDependenciesError;
export type EmailAuthServerDependenciesError = CoreAuthServerDependenciesError;

export const EmailAuthServerInputError = CoreAuthServerInputError;
export type EmailAuthServerInputError = CoreAuthServerInputError;

export const EmailAuthServerApiError = CoreAuthServerApiError;
export type EmailAuthServerApiError = CoreAuthServerApiError;

export const EmailAuthServerDataMissingError = CoreAuthServerDataMissingError;
export type EmailAuthServerDataMissingError = CoreAuthServerDataMissingError;

export const EmailAuthServerSessionError = CoreAuthServerSessionError;
export type EmailAuthServerSessionError = CoreAuthServerSessionError;

export type EmailAuthServerError = CoreAuthServerError;

export const mapBetterAuthApiErrorToEmailAuthError = mapBetterAuthApiErrorToCoreAuthError;
export const describeEmailAuthError = describeCoreAuthError;
