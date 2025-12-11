import type { OperationCodes } from '../../enums/operationCodes.enum';

/**
 * Detailed input validation error with source tracing.
 *
 * @pure
 * @description Contains structured information about input validation failures,
 * including the source of the error, field-level details, and the original cause.
 */

export interface CoreInputValidationDetails {
	readonly source: OperationCodes;
	readonly operation: string;
	readonly fieldErrors?: ReadonlyArray<{ path: string; message: string }>;
}
