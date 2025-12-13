import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Ref from 'effect/Ref';
import { createInitialState, processEvent, reset } from './core/trace/analyzer/trace-analyzer.service.js';
import type { PerformanceStat, SlowOperation } from './core/trace/analyzer/trace-analyzer.types.js';
import type { TraceEvent } from './core/trace/parser/trace-parser.types.js';

export * from './core/index.js';

export interface TraceAnalyzer {
	readonly processEvent: (event: TraceEvent) => Effect.Effect<void>;
	readonly getStats: Effect.Effect<{
		commandStats: Map<string, PerformanceStat>;
		internalStats: Map<string, PerformanceStat>;
		slowOps: SlowOperation[];
	}>;
	readonly reset: Effect.Effect<void>;
}

export const TraceAnalyzer = Context.GenericTag<TraceAnalyzer>('@emperorrag/tsserver-analyzer/TraceAnalyzer');

export const make = (pathMappedFiles: string[]) =>
	Effect.gen(function* (_) {
		const stateRef = yield* _(Ref.make(createInitialState(pathMappedFiles)));

		return {
			processEvent: (event: TraceEvent) => Ref.update(stateRef, (state) => processEvent(event)(state)),
			getStats: Ref.get(stateRef).pipe(
				Effect.map((state) => ({
					commandStats: state.commandStats,
					internalStats: state.internalStats,
					slowOps: state.slowOps,
				}))
			),
			reset: Ref.update(stateRef, (state) => reset(state)),
		};
	});
