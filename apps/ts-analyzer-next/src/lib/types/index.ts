export interface ColumnSpec {
	key: string;
	label: string;
	sortable?: boolean;
	width?: string | number;
}

export type TableRow = Record<string, any>;

export interface TableResult {
	columns: ColumnSpec[];
	rows: TableRow[];
	total?: number;
}

export interface AnalysisResult {
	id?: string;
	summary?: Record<string, any>;
	tables?: Record<string, TableResult>;
	raw?: any;
	timestamp?: string;
}
