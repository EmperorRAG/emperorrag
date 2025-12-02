import { TraceEvent } from '../parser/trace-parser.types.js';
import type { AnalyzerState } from './trace-analyzer.types.js';
import { handleInternalEvent } from './handlers/internal.handler.js';
import { handleRequest } from './handlers/request.handler.js';
import { handleResponse } from './handlers/response.handler.js';
import { updateChatBlockTimestamp, updateInferredProjectFiles } from './state/state.utils.js';

/**
 * Creates the initial state for the Trace Analyzer.
 *
 * @param pathMappedFiles - A list of file paths that are mapped via tsconfig paths.
 * @returns The initial AnalyzerState.
 */
export const createInitialState = (pathMappedFiles: string[] = []): AnalyzerState => ({
	pendingRequests: new Map(),
	lastChatBlockTimestamp: 0,
	pathMappedFiles: new Set(pathMappedFiles.map((p) => p.toLowerCase().replace(/\\/g, '/'))),
	inferredProjectFiles: new Map(),
	recentFindSourceFiles: [],
	commandStats: new Map(),
	internalStats: new Map(),
	slowOps: [],
});

/**
 * Processes a single trace event and returns the updated state.
 *
 * @param event - The trace event to process.
 * @returns A function that takes the current state and returns the updated state.
 */
export const processEvent =
	(event: TraceEvent) =>
	(state: AnalyzerState): AnalyzerState =>
		((stateWithMeta) =>
			((stateAfterRequest) => ((stateAfterResponse) => handleInternalEvent(event)(stateAfterResponse))(handleResponse(event)(stateAfterRequest)))(
				handleRequest(event)(stateWithMeta)
			))({
			...state,
			lastChatBlockTimestamp: updateChatBlockTimestamp(event)(state),
			inferredProjectFiles: updateInferredProjectFiles(event)(state),
		});

/**
 * Resets the file-specific state of the analyzer.
 *
 * @param state - The current state.
 * @returns The reset state.
 */
export const reset = (state: AnalyzerState): AnalyzerState => ({
	...state,
	pendingRequests: new Map(),
	lastChatBlockTimestamp: 0,
	inferredProjectFiles: new Map(),
	recentFindSourceFiles: [],
});
