import { Effect, Layer } from 'effect';
import { TraceAnalyzer, make } from './tsserver-analyzer.js';
import type { TraceEvent } from './core/trace/parser/trace-parser.types.js';

describe('TraceAnalyzer', () => {
	it('should track command stats', async () => {
		const program = Effect.gen(function* (_) {
			const analyzer = yield* _(TraceAnalyzer);

			const req: TraceEvent = {
				name: 'request',
				ph: 'M',
				ts: 1000,
				pid: 1,
				tid: 1,
				args: { seq: 1, command: 'completion' },
			};

			const res: TraceEvent = {
				name: 'response',
				ph: 'M',
				ts: 2000,
				pid: 1,
				tid: 1,
				args: { seq: 2, request_seq: 1, command: 'completion', success: true },
			};

			yield* _(analyzer.processEvent(req));
			yield* _(analyzer.processEvent(res));

			const stats = yield* _(analyzer.getStats);
			return stats;
		});

		const layer = Layer.effect(TraceAnalyzer, make([]));
		const stats = await Effect.runPromise(program.pipe(Effect.provide(layer)));

		expect(stats.commandStats.size).toBe(1);
		const stat = stats.commandStats.get('completion');
		expect(stat).toBeDefined();
		expect(stat?.count).toBe(1);
		expect(stat?.totalDurationMicros).toBe(1000);
	});
});
