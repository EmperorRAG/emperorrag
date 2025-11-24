export interface TraceEvent {
	name: string;
	cat?: string;
	ph: string; // 'B' | 'E' | 'I' | 'X' | 'M'
	ts: number; // microseconds
	pid: number;
	tid: number;
	dur?: number; // microseconds (for 'X' events)
	args?: any;
}

export interface RequestArgs {
	seq: number;
	command: string;
}

export interface ResponseArgs {
	seq: number;
	command: string;
	success: boolean;
	request_seq?: number;
}

export interface PerformanceStat {
	name: string;
	resource?: string;
	count: number;
	totalDurationMicros: number;
	maxDurationMicros: number;
}

export interface SlowOperation {
	name: string;
	resource?: string;
	durationMs: number;
	timestamp: number;
	args?: any;
}
