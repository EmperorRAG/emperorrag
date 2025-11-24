import { TraceEvent } from './types.js';

export function parseTraceLine(line: string): TraceEvent | null {
    const trimmed = line.trim();
    // Skip start/end of array
    if (trimmed === '[' || trimmed === ']') return null;
    
    // Remove trailing comma if present
    const jsonString = trimmed.endsWith(',') ? trimmed.slice(0, -1) : trimmed;
    
    try {
        return JSON.parse(jsonString) as TraceEvent;
    } catch (e) {
        return null;
    }
}
