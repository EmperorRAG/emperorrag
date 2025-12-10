import * as Option from 'effect/Option';
import type { TraceEvent } from './trace-parser.types.ts';

/**
 * Parses a single line from the trace log.
 * @pure
 */
export const parseTraceLine = (line: string): Option.Option<TraceEvent> => {
	const trimmed = line.trim();
	// Skip start/end of array
	if (trimmed === '[' || trimmed === ']') return Option.none();

	// Remove trailing comma if present
	const jsonString = trimmed.endsWith(',') ? trimmed.slice(0, -1) : trimmed;

	try {
		const event = JSON.parse(jsonString) as TraceEvent;
		return Option.some(event);
	} catch (e) {
		return Option.none();
	}
};
