/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/shared/oauth.error.ts
 * @description Server-side error types for oauth authentication operations.
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

export const OAuthAuthServerDependenciesError = CoreAuthServerDependenciesError;
export type OAuthAuthServerDependenciesError = CoreAuthServerDependenciesError;

export const OAuthAuthServerInputError = CoreAuthServerInputError;
export type OAuthAuthServerInputError = CoreAuthServerInputError;

export const OAuthAuthServerApiError = CoreAuthServerApiError;
export type OAuthAuthServerApiError = CoreAuthServerApiError;

export const OAuthAuthServerDataMissingError = CoreAuthServerDataMissingError;
export type OAuthAuthServerDataMissingError = CoreAuthServerDataMissingError;

export const OAuthAuthServerSessionError = CoreAuthServerSessionError;
export type OAuthAuthServerSessionError = CoreAuthServerSessionError;

export type OAuthAuthServerError = CoreAuthServerError;

export const mapBetterAuthApiErrorToOAuthAuthError = mapBetterAuthApiErrorToCoreAuthError;
export const describeOAuthAuthError = describeCoreAuthError;
