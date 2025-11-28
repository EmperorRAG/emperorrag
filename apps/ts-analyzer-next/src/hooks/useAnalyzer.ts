import { useState } from 'react';
import { AnalysisResult } from '../lib/types';

export type AnalyzerStatus = 'idle' | 'loading' | 'success' | 'error';

export function useAnalyzer() {
	const [status, setStatus] = useState<AnalyzerStatus>('idle');
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [rawError, setRawError] = useState<string | null>(null);

	const runAnalysis = async () => {
		setStatus('loading');
		setError(null);
		setRawError(null);
		setResult(null);

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
			});

			const data = await response.json();

			if (!response.ok) {
				// Attach raw error if available in the response body
				const errorObj = new Error(data.error || 'Failed to run analysis');
				(errorObj as any).raw = data.raw;
				throw errorObj;
			}

			if (data.success) {
				setResult(data.result);
				setStatus('success');
			} else {
				const errorObj = new Error(data.error || 'Unknown error occurred');
				(errorObj as any).raw = data.raw;
				throw errorObj;
			}
		} catch (err: any) {
			setStatus('error');
			setError(err.message || 'An unexpected error occurred');
			if (err.raw) {
				setRawError(err.raw);
			}
		}
	};

	return { status, result, error, rawError, runAnalysis };
}
