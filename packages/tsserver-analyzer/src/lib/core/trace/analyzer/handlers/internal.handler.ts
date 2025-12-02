import { TraceEvent } from '../../parser/trace-parser.types.js';
import type { AnalyzerState } from '../trace-analyzer.types.js';
import { getResource } from '../trace-analyzer.utils.js';
import { enrichResource } from '../enrichment/enrichment.utils.js';
import { updateRecentFindSourceFiles } from '../state/state.utils.js';
import { recordStat } from '../stats/stats.utils.js';

/**
 * Handles internal trace events (phase 'X') by updating statistics and recent files.
 */
export const handleInternalEvent =
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
