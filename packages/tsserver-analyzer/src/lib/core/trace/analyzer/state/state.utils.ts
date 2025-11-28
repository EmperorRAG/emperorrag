import { TraceEvent } from '../../parser/trace-parser.types.js';
import type { AnalyzerState } from '../trace-analyzer.types.js';
import { isChatBlock } from '../trace-analyzer.utils.js';

/**
 * Updates the last chat block timestamp if the event is a chat block.
 */
export const updateChatBlockTimestamp =
	(event: TraceEvent) =>
	(state: AnalyzerState): number =>
		isChatBlock(event.args) ? event.ts : state.lastChatBlockTimestamp;

/**
 * Updates the inferred project files map if the event is a projectInfo event for an inferred project.
 */
export const updateInferredProjectFiles =
	(event: TraceEvent) =>
	(state: AnalyzerState): Map<string, string[]> =>
		event.name === 'projectInfo' && event.args?.projectName?.includes('inferredProject') && event.args.fileNames && Array.isArray(event.args.fileNames)
			? new Map(state.inferredProjectFiles).set(event.args.projectName, event.args.fileNames)
			: state.inferredProjectFiles;

/**
 * Updates the list of recent findSourceFile events.
 */
export const updateRecentFindSourceFiles =
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
