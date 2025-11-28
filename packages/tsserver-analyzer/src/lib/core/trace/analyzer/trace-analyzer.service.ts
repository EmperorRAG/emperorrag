import { TraceEvent } from '../parser/trace-parser.types.js';
import type { AnalyzerState, PerformanceStat } from './trace-analyzer.types.js';
import { getResource, isChatBlock, isPathMapped } from './trace-analyzer.utils.js';

/**
 * Helper function to record performance statistics into a map.
 * Updates count, total duration, and max duration for a given operation key.
 */
const recordStat =
	(key: string) =>
	(name: string) =>
	(resource: string | undefined) =>
	(durationMicros: number) =>
	(map: Map<string, PerformanceStat>): Map<string, PerformanceStat> => {
		const stat = map.get(key) || { name, resource, count: 0, totalDurationMicros: 0, maxDurationMicros: 0 };
		return new Map(map).set(key, {
			...stat,
			count: stat.count + 1,
			totalDurationMicros: stat.totalDurationMicros + durationMicros,
			maxDurationMicros: Math.max(stat.maxDurationMicros, durationMicros),
		});
	};

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
 * Updates the last chat block timestamp if the event is a chat block.
 */
const updateChatBlockTimestamp =
	(event: TraceEvent) =>
	(state: AnalyzerState): number =>
		isChatBlock(event.args) ? event.ts : state.lastChatBlockTimestamp;

/**
 * Updates the inferred project files map if the event is a projectInfo event for an inferred project.
 */
const updateInferredProjectFiles =
	(event: TraceEvent) =>
	(state: AnalyzerState): Map<string, string[]> =>
		event.name === 'projectInfo' && event.args?.projectName?.includes('inferredProject') && event.args.fileNames && Array.isArray(event.args.fileNames)
			? new Map(state.inferredProjectFiles).set(event.args.projectName, event.args.fileNames)
			: state.inferredProjectFiles;

/**
 * Handles request events by updating the pending requests map.
 */
const handleRequest =
	(event: TraceEvent) =>
	(state: AnalyzerState): AnalyzerState =>
		event.name === 'request' && event.args?.seq !== undefined
			? { ...state, pendingRequests: new Map(state.pendingRequests).set(event.args.seq, event.ts) }
			: state;

/**
 * Handles response events by calculating duration and updating statistics.
 */
const handleResponse =
	(event: TraceEvent) =>
	(state: AnalyzerState): AnalyzerState =>
		event.name !== 'response' || event.args?.seq === undefined
			? state
			: ((reqSeq) =>
					!state.pendingRequests.has(reqSeq)
						? state
						: ((startTs) =>
								((durationMicros) =>
									((command) =>
										((resource) =>
											((key) =>
												((commandStats) =>
													((slowOps) =>
														((pendingRequests) => ({
															...state,
															commandStats,
															slowOps,
															pendingRequests,
														}))(new Map(Array.from(state.pendingRequests.entries()).filter(([k]) => k !== reqSeq))))(
														durationMicros > 500000
															? [
																	...state.slowOps,
																	{
																		name: `Command: ${command}`,
																		resource: getResource(event.args),
																		durationMs: durationMicros / 1000,
																		timestamp: event.ts,
																		args: event.args,
																	},
																]
															: state.slowOps
													))(recordStat(key)(command)(resource)(durationMicros)(state.commandStats)))(
												resource ? `${command} (${resource})` : command
											))(getResource(event.args)))(event.args.command || 'unknown'))(event.ts - startTs))(
								state.pendingRequests.get(reqSeq)!
							))(event.args.request_seq ?? event.args.seq);

/**
 * Enriches the resource string with context from chat blocks.
 */
const enrichWithChatContext =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		state.lastChatBlockTimestamp >= event.ts && state.lastChatBlockTimestamp <= event.ts + (event.dur || 0)
			? resource + ' (Triggered by Chat Code Block)'
			: resource;

/**
 * Enriches the resource string with context from inferred project files.
 */
const enrichWithInferredFiles =
	(state: AnalyzerState) =>
	(resource: string): string =>
		((files) =>
			files && files.length > 0
				? resource + ` (Contains: ${files[0].split('/').pop() || files[0]}${files.length > 1 ? ' + ' + (files.length - 1) + ' more' : ''})`
				: resource)(state.inferredProjectFiles.get(resource));

/**
 * Enriches the resource string with context from recent findSourceFile events.
 */
const enrichWithRecentFiles =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		state.inferredProjectFiles.has(resource)
			? resource
			: ((containedFiles) =>
					containedFiles.length === 0
						? resource
						: ((uniqueFiles) =>
								resource +
								` (Contains: ${uniqueFiles[0].split('/').pop() || uniqueFiles[0]}${uniqueFiles.length > 1 ? ' + ' + (uniqueFiles.length - 1) + ' more' : ''})`)(
								Array.from(new Set(containedFiles))
							))(state.recentFindSourceFiles.filter((f) => f.ts >= event.ts && f.ts <= event.ts + (event.dur || 0)).map((f) => f.file));

/**
 * Enriches the resource string with context from path mappings.
 */
const enrichWithPathMapping =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		event.name === 'findSourceFile' && isPathMapped(state.pathMappedFiles)(resource) ? resource + ' (Triggered by tsconfig paths)' : resource;

/**
 * Applies all enrichment logic to the resource string.
 */
const enrichResource =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		event.name === 'updateGraph' && resource?.includes('inferredProject')
			? ((chatEnriched) =>
					chatEnriched !== resource
						? chatEnriched
						: ((inferredEnriched) => (inferredEnriched !== resource ? inferredEnriched : enrichWithRecentFiles(event)(state)(resource)))(
								enrichWithInferredFiles(state)(resource)
							))(enrichWithChatContext(event)(state)(resource))
			: enrichWithPathMapping(event)(state)(resource);

/**
 * Updates the list of recent findSourceFile events.
 */
const updateRecentFindSourceFiles =
	(event: TraceEvent) =>
	(resource: string) =>
	(state: AnalyzerState): { ts: number; file: string }[] =>
		event.name !== 'findSourceFile' || !resource
			? state.recentFindSourceFiles
			: ((newRecent) =>
					((pruneThreshold) =>
						newRecent.length > 0 && newRecent[0].ts < pruneThreshold ? newRecent.filter((f) => f.ts >= pruneThreshold) : newRecent)(
						event.ts - 10000000
					))([...state.recentFindSourceFiles, { ts: event.ts, file: resource }]);

/**
 * Handles internal trace events (phase 'X') by updating statistics and recent files.
 */
const handleInternalEvent =
	(event: TraceEvent) =>
	(state: AnalyzerState): AnalyzerState =>
		event.ph !== 'X' || event.dur === undefined
			? state
			: ((rawResource) =>
					((resource) =>
						((key) =>
							((internalStats) =>
								((slowOps) =>
									((recentFindSourceFiles) => ({
										...state,
										internalStats,
										slowOps,
										recentFindSourceFiles,
									}))(resource ? updateRecentFindSourceFiles(event)(resource)(state) : state.recentFindSourceFiles))(
									event.dur! > 500000
										? [
												...state.slowOps,
												{
													name: `Internal: ${event.name}`,
													resource: resource,
													durationMs: event.dur! / 1000,
													timestamp: event.ts,
													args: event.args,
												},
											]
										: state.slowOps
								))(recordStat(key)(event.name)(resource)(event.dur!)(state.internalStats)))(
							resource ? `${event.name} (${resource})` : event.name
						))(rawResource ? enrichResource(event)(state)(rawResource) : undefined))(getResource(event.args));

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
