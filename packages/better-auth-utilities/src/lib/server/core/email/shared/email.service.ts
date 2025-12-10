import * as Layer from 'effect/Layer';
import * as Context from 'effect/Context';
import type { EmailAuthServerService, EmailAuthServerServiceFor } from './email.types';
import type { AuthServerFor } from '../../../server.types';

/**
 * @deprecated Use AuthServerTag from '../../../server.service' instead.
 */
export const EmailAuthServerServiceTag = Context.GenericTag<EmailAuthServerService>('@app/EmailAuthServerService');

/**
 * @deprecated Use AuthServerLayer from '../../../server.service' instead.
 */
export const EmailAuthServerLayer = <T extends AuthServerFor>(authServer: T) =>
	Layer.succeed(EmailAuthServerServiceTag, { authServer } satisfies EmailAuthServerServiceFor<T>);
