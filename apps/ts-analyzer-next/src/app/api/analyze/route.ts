import { NextResponse } from 'next/server';
import { runAnalyzerCli } from '../../../lib/analyzerCli';

export async function POST() {
	try {
		const result = await runAnalyzerCli();
		return NextResponse.json({ success: true, result });
	} catch (error: any) {
		console.error('Analyzer failed:', error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || String(error),
				raw: error.raw,
			},
			{ status: 500 }
		);
	}
}
