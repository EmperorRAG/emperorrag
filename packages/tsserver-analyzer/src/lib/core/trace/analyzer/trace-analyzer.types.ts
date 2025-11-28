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

export interface AnalyzerState {
	pendingRequests: Map<number, number>;
	lastChatBlockTimestamp: number;
	pathMappedFiles: Set<string>;
	inferredProjectFiles: Map<string, string[]>;
	recentFindSourceFiles: { ts: number; file: string }[];
	commandStats: Map<string, PerformanceStat>;
	internalStats: Map<string, PerformanceStat>;
	slowOps: SlowOperation[];
}
