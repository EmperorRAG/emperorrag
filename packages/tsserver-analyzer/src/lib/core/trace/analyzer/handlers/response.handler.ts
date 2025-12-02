import { TraceEvent } from '../../parser/trace-parser.types.js';
import type { AnalyzerState } from '../trace-analyzer.types.js';
import { getResource } from '../trace-analyzer.utils.js';
import { recordStat } from '../stats/stats.utils.js';

/**
 * Handles response events by calculating duration and updating statistics.
 */
export const handleResponse =
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
