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
