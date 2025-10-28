import type { ReactNode } from 'react';

/**
 * Base schema contract for datagrid records.
 */
export type DatagridSchema = Record<string, unknown>;

/**
 * Represents an immutable record consumed by the datagrid.
 */
export type DatagridRecord<TSchema extends DatagridSchema = DatagridSchema> = Readonly<TSchema>;

/**
 * Minimal descriptor for a normalized cell ready for render.
 */
export interface DatagridCell<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly columnId: string;
	readonly key: string;
	readonly rawValue: unknown;
}

/**
 * Metadata describing a single column.
 */
export interface DatagridColumn<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly id: string;
	readonly header: string;
	readonly accessor: (record: TRecord) => unknown;
}

/**
 * Structured representation of a row after projection.
 */
export interface DatagridRow<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly id: string;
	readonly cells: ReadonlyArray<DatagridCell<TRecord>>;
	readonly original: TRecord;
}

/**
 * Optional callbacks accepted by the datagrid for deriving metadata.
 */
export interface DatagridAccessors<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly rowId?: (record: TRecord, index: number) => string;
	readonly emptyMessage?: string;
	readonly errorMessage?: string;
}

/**
 * Props accepted by the Datagrid component.
 */
export interface DatagridProps<
	TRecord extends DatagridRecord = DatagridRecord,
	TColumn extends DatagridColumn<TRecord> = DatagridColumn<TRecord>
> extends DatagridAccessors<TRecord> {
	readonly data: ReadonlyArray<TRecord>;
	readonly columns?: ReadonlyArray<TColumn>;
	readonly isLoading?: boolean;
	readonly caption?: string;
	readonly emptyState?: ReactNode;
	readonly errorState?: ReactNode;
}

/**
 * Parameters accepted when deriving column metadata from raw props.
 */
export interface DeriveColumnsParams<
	TRecord extends DatagridRecord = DatagridRecord,
	TColumn extends DatagridColumn<TRecord> = DatagridColumn<TRecord>
> {
	readonly initialColumns?: ReadonlyArray<TColumn>;
	readonly records: ReadonlyArray<TRecord>;
}

/**
 * Parameters accepted when projecting rows for render.
 */
export interface ProjectRowsParams<
	TRecord extends DatagridRecord = DatagridRecord,
	TColumn extends DatagridColumn<TRecord> = DatagridColumn<TRecord>
> {
	readonly columns: ReadonlyArray<TColumn>;
	readonly records: ReadonlyArray<TRecord>;
	readonly rowId?: (record: TRecord, index: number) => string;
}

/**
 * Internal factory input for building individual cell descriptors.
 */
export interface DatagridCellFactoryInput<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly column: DatagridColumn<TRecord>;
	readonly record: TRecord;
	readonly rowId: string;
	readonly columnIndex: number;
}

/**
 * Internal factory input for building datagrid rows.
 */
export interface DatagridRowFactoryInput<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly record: TRecord;
	readonly index: number;
	readonly columns: ReadonlyArray<DatagridColumn<TRecord>>;
	readonly rowIdAccessor?: (record: TRecord, index: number) => string;
}
