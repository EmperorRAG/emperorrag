/**
 * Represents the arguments for a request event in the trace.
 */
export interface RequestArgs {
	/** The sequence number of the request. */
	seq: number;
	/** The command name being requested (e.g., 'completion', 'quickinfo'). */
	command: string;
}

/**
 * Represents the arguments for a response event in the trace.
 */
export interface ResponseArgs {
	/** The sequence number of the response. */
	seq: number;
	/** The command name corresponding to the response. */
	command: string;
	/** Whether the request was successful. */
	success: boolean;
	/** The sequence number of the request this response corresponds to. */
	request_seq?: number;
}

/**
 * Aggregated performance statistics for a specific operation or command.
 */
export interface PerformanceStat {
	/** The name of the operation or command. */
	name: string;
	/** The resource (file or project) associated with the operation, if any. */
	resource?: string;
	/** The number of times this operation occurred. */
	count: number;
	/** The total duration of all occurrences in microseconds. */
	totalDurationMicros: number;
	/** The maximum duration of a single occurrence in microseconds. */
	maxDurationMicros: number;
}

/**
 * Details about a single operation that exceeded the slow threshold.
 */
export interface SlowOperation {
	/** The name of the operation. */
	name: string;
	/** The resource associated with the operation. */
	resource?: string;
	/** The duration of the operation in milliseconds. */
	durationMs: number;
	/** The timestamp when the operation occurred (in microseconds). */
	timestamp: number;
	/** Additional arguments associated with the event. */
	args?: any;
}

/**
 * The internal state of the Trace Analyzer.
 */
export interface AnalyzerState {
	/** Map of request sequence numbers to their start timestamps (in microseconds). */
	pendingRequests: Map<number, number>;
	/** Timestamp of the last detected chat code block activity. */
	lastChatBlockTimestamp: number;
	/** Set of file paths that are mapped via tsconfig paths. */
	pathMappedFiles: Set<string>;
	/** Map of inferred project names to the list of files they contain. */
	inferredProjectFiles: Map<string, string[]>;
	/** List of recent `findSourceFile` events to correlate with `updateGraph`. */
	recentFindSourceFiles: { ts: number; file: string }[];
	/** Aggregated statistics for client commands (request/response pairs). */
	commandStats: Map<string, PerformanceStat>;
	/** Aggregated statistics for internal compiler operations. */
	internalStats: Map<string, PerformanceStat>;
	/** List of operations that were flagged as slow. */
	slowOps: SlowOperation[];
}
