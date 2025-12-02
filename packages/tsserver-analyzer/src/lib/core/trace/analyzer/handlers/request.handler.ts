import { TraceEvent } from '../../parser/trace-parser.types.js';
import type { AnalyzerState } from '../trace-analyzer.types.js';

/**
 * Handles request events by updating the pending requests map.
 */
export const handleRequest =
	(event: TraceEvent) =>
	(state: AnalyzerState): AnalyzerState =>
		event.name === 'request' && event.args?.seq !== undefined
			? { ...state, pendingRequests: new Map(state.pendingRequests).set(event.args.seq, event.ts) }
			: state;
