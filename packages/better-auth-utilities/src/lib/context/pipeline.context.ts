import * as Context from 'effect/Context';
import type { AuthServerApiEndpoints } from '../enums/authServerApiEndpoints.enum';
import type { OperationCodes } from '../enums/operationCodes.enum';

export interface PipelineContext {
	readonly endpoint: AuthServerApiEndpoints;
	readonly operationCode?: OperationCodes;
}

export const PipelineContext = Context.GenericTag<PipelineContext>('PipelineContext');
