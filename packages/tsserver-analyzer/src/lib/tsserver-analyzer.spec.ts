import { createInitialState, processEvent } from './core/trace/analyzer/trace-analyzer.service.js';
import type { TraceEvent } from './core/trace/parser/trace-parser.types.js';

describe('TraceAnalyzer', () => {
	it('should track command stats', () => {
		const initialState = createInitialState([]);

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

		const stateAfterReq = processEvent(req)(initialState);
		const finalState = processEvent(res)(stateAfterReq);

		expect(finalState.commandStats.size).toBe(1);
		const stat = finalState.commandStats.get('completion');
		expect(stat).toBeDefined();
		expect(stat?.count).toBe(1);
		expect(stat?.totalDurationMicros).toBe(1000);
	});
});
