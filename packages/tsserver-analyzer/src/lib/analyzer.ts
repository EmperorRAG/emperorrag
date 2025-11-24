import { TraceEvent, PerformanceStat, SlowOperation } from './types.js';

export class Analyzer {
	// Map request seq -> start timestamp (micros)
	private pendingRequests = new Map<number, number>();

	public commandStats = new Map<string, PerformanceStat>();
	public internalStats = new Map<string, PerformanceStat>();
	public slowOps: SlowOperation[] = [];

	processEvent(event: TraceEvent) {
		// 1. Handle Request/Response Pairs (Latency)
		if (event.name === 'request' && event.args?.seq !== undefined) {
			this.pendingRequests.set(event.args.seq, event.ts);
		} else if (event.name === 'response' && event.args?.seq !== undefined) {
			// Note: response args usually have 'seq' (its own) and 'request_seq' (the match)
			// But in some traces, the 'seq' in args IS the request seq.
			// We check 'request_seq' first, then fallback to 'seq' if it matches a pending request.
			const reqSeq = event.args.request_seq ?? event.args.seq;

			if (this.pendingRequests.has(reqSeq)) {
				const startTs = this.pendingRequests.get(reqSeq)!;
				const durationMicros = event.ts - startTs;
				const command = event.args.command || 'unknown';
				const resource = this.getResource(event.args);
				const key = resource ? `${command} (${resource})` : command;

				this.recordStat(this.commandStats, key, command, resource, durationMicros);

				if (durationMicros > 500000) {
					// > 500ms
					this.slowOps.push({
						name: `Command: ${command}`,
						resource: this.getResource(event.args),
						durationMs: durationMicros / 1000,
						timestamp: event.ts,
						args: event.args,
					});
				}
				this.pendingRequests.delete(reqSeq);
			}
		}

		// 2. Handle Internal Trace Events (ph: 'X' has duration)
		if (event.ph === 'X' && event.dur !== undefined) {
			const resource = this.getResource(event.args);
			const key = resource ? `${event.name} (${resource})` : event.name;

			this.recordStat(this.internalStats, key, event.name, resource, event.dur);

			if (event.dur > 500000) {
				// > 500ms
				this.slowOps.push({
					name: `Internal: ${event.name}`,
					resource: this.getResource(event.args),
					durationMs: event.dur / 1000,
					timestamp: event.ts,
					args: event.args,
				});
			}
		}
	}

	private getResource(args: any): string | undefined {
		if (!args) return undefined;
		if (typeof args.name === 'string') return args.name;
		if (typeof args.file === 'string') return args.file;
		if (typeof args.fileName === 'string') return args.fileName;
		if (typeof args.path === 'string') return args.path;
		if (typeof args.projectName === 'string') return args.projectName;
		return undefined;
	}

	private recordStat(map: Map<string, PerformanceStat>, key: string, name: string, resource: string | undefined, durationMicros: number) {
		const stat = map.get(key) || { name, resource, count: 0, totalDurationMicros: 0, maxDurationMicros: 0 };
		stat.count++;
		stat.totalDurationMicros += durationMicros;
		stat.maxDurationMicros = Math.max(stat.maxDurationMicros, durationMicros);
		map.set(key, stat);
	}
}
