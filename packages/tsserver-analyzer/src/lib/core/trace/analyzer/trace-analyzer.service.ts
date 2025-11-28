import { Effect, Ref, Context } from 'effect';
import { TraceEvent } from '../parser/trace-parser.types.js';
import type { AnalyzerState, PerformanceStat, SlowOperation } from './trace-analyzer.types.js';
import { getResource, isChatBlock, isPathMapped } from './trace-analyzer.utils.js';

export class TraceAnalyzer extends Context.Tag('TraceAnalyzer')<
	TraceAnalyzer,
	{
		processEvent: (event: TraceEvent) => Effect.Effect<void>;
		getStats: Effect.Effect<{
			commandStats: Map<string, PerformanceStat>;
			internalStats: Map<string, PerformanceStat>;
			slowOps: SlowOperation[];
		}>;
		reset: Effect.Effect<void>;
	}
>() {}

const recordStat = (map: Map<string, PerformanceStat>, key: string, name: string, resource: string | undefined, durationMicros: number) => {
	const stat = map.get(key) || { name, resource, count: 0, totalDurationMicros: 0, maxDurationMicros: 0 };
	stat.count++;
	stat.totalDurationMicros += durationMicros;
	stat.maxDurationMicros = Math.max(stat.maxDurationMicros, durationMicros);
	map.set(key, stat);
};

export const make = (pathMappedFiles: string[] = []) => {
	const initialState: AnalyzerState = {
		pendingRequests: new Map(),
		lastChatBlockTimestamp: 0,
		pathMappedFiles: new Set(pathMappedFiles.map((p) => p.toLowerCase().replace(/\\/g, '/'))),
		inferredProjectFiles: new Map(),
		recentFindSourceFiles: [],
		commandStats: new Map(),
		internalStats: new Map(),
		slowOps: [],
	};

	return Ref.make(initialState).pipe(
		Effect.map((stateRef) => ({
			processEvent: (event: TraceEvent) =>
				Ref.update(stateRef, (state) => {
					// Track chat block activity
					if (isChatBlock(event.args)) {
						state.lastChatBlockTimestamp = event.ts;
					}

					// Track files in inferred projects
					if (event.name === 'projectInfo' && event.args?.projectName?.includes('inferredProject')) {
						if (event.args.fileNames && Array.isArray(event.args.fileNames)) {
							state.inferredProjectFiles.set(event.args.projectName, event.args.fileNames);
						}
					}

					// 1. Handle Request/Response Pairs (Latency)
					if (event.name === 'request' && event.args?.seq !== undefined) {
						state.pendingRequests.set(event.args.seq, event.ts);
					} else if (event.name === 'response' && event.args?.seq !== undefined) {
						const reqSeq = event.args.request_seq ?? event.args.seq;

						if (state.pendingRequests.has(reqSeq)) {
							const startTs = state.pendingRequests.get(reqSeq)!;
							const durationMicros = event.ts - startTs;
							const command = event.args.command || 'unknown';
							const resource = getResource(event.args);
							const key = resource ? `${command} (${resource})` : command;

							recordStat(state.commandStats, key, command, resource, durationMicros);

							if (durationMicros > 500000) {
								state.slowOps.push({
									name: `Command: ${command}`,
									resource: getResource(event.args),
									durationMs: durationMicros / 1000,
									timestamp: event.ts,
									args: event.args,
								});
							}
							state.pendingRequests.delete(reqSeq);
						}
					}

					// 2. Handle Internal Trace Events (ph: 'X' has duration)
					if (event.ph === 'X' && event.dur !== undefined) {
						let resource = getResource(event.args);

						// Special handling for updateGraph on Inferred Projects triggered by Chat
						if (event.name === 'updateGraph' && resource?.includes('inferredProject')) {
							if (state.lastChatBlockTimestamp >= event.ts && state.lastChatBlockTimestamp <= event.ts + event.dur) {
								resource += ' (Triggered by Chat Code Block)';
							} else {
								const files = state.inferredProjectFiles.get(resource);
								if (files && files.length > 0) {
									const firstFile = files[0];
									const fileName = firstFile.split('/').pop() || firstFile;
									resource += ` (Contains: ${fileName}${files.length > 1 ? ' + ' + (files.length - 1) + ' more' : ''})`;
								} else {
									const duration = event.dur || 0;
									const containedFiles = state.recentFindSourceFiles
										.filter((f) => f.ts >= event.ts && f.ts <= event.ts + duration)
										.map((f) => f.file);

									if (containedFiles.length > 0) {
										const uniqueFiles = Array.from(new Set(containedFiles));
										const firstFile = uniqueFiles[0];
										const fileName = firstFile.split('/').pop() || firstFile;
										resource += ` (Contains: ${fileName}${uniqueFiles.length > 1 ? ' + ' + (uniqueFiles.length - 1) + ' more' : ''})`;
									}
								}
							}
						}

						// Check if this file is a path-mapped file from tsconfig
						if (event.name === 'findSourceFile' && resource) {
							if (isPathMapped(resource, state.pathMappedFiles)) {
								resource += ' (Triggered by tsconfig paths)';
							}
							state.recentFindSourceFiles.push({ ts: event.ts, file: resource });
							const pruneThreshold = event.ts - 10000000;
							if (state.recentFindSourceFiles.length > 0 && state.recentFindSourceFiles[0].ts < pruneThreshold) {
								state.recentFindSourceFiles = state.recentFindSourceFiles.filter((f) => f.ts >= pruneThreshold);
							}
						}

						const key = resource ? `${event.name} (${resource})` : event.name;

						recordStat(state.internalStats, key, event.name, resource, event.dur);

						if (event.dur > 500000) {
							state.slowOps.push({
								name: `Internal: ${event.name}`,
								resource: resource,
								durationMs: event.dur / 1000,
								timestamp: event.ts,
								args: event.args,
							});
						}
					}
					return state;
				}),
			getStats: Ref.get(stateRef).pipe(
				Effect.map((state) => ({
					commandStats: state.commandStats,
					internalStats: state.internalStats,
					slowOps: state.slowOps,
				}))
			),
			reset: Ref.update(stateRef, (state) => ({
				...state,
				pendingRequests: new Map(),
				lastChatBlockTimestamp: 0,
				inferredProjectFiles: new Map(),
				recentFindSourceFiles: [],
			})),
		}))
	);
};
