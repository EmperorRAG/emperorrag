import * as Layer from 'effect/Layer';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';

export { AuthServerTag };

/**
 * @deprecated Use AuthServerLayer from '../../../server.service' instead.
 */
export const EmailAuthServerLayer = <T extends AuthServerFor>(authServer: T) => Layer.succeed(AuthServerTag, authServer);
