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
 * Extracts primitive-like values from a schema for lightweight formatting.
 */
export type DatagridPrimitive<
	TSchema extends DatagridSchema = DatagridSchema
> = Extract<TSchema[keyof TSchema], string | number | boolean | null | undefined | Date>;

/**
 * Accessor responsible for retrieving column values from a record.
 */
export type DatagridAccessor<
	TRecord extends DatagridRecord,
	TValue
> = (record: TRecord) => TValue;

/**
 * Context passed to cell renderers when computing display output.
 */
export interface DatagridCellRenderContext<
	TRecord extends DatagridRecord,
	TValue
> {
	readonly record: TRecord;
	readonly column: DatagridColumn<TRecord, TValue>;
	readonly rowId: string;
	readonly value: TValue;
}

/**
 * Minimal descriptor for a normalized cell ready for render.
 */
export interface DatagridCell<
	TRecord extends DatagridRecord = DatagridRecord,
	TValue = unknown
> {
	readonly columnId: string;
	readonly key: string;
	readonly rawValue: TValue;
	readonly displayValue?: ReactNode;
	readonly render?: (context: DatagridCellRenderContext<TRecord, TValue>) => ReactNode;
}

/**
 * Metadata describing a single column.
 */
export interface DatagridColumn<
	TRecord extends DatagridRecord = DatagridRecord,
	TValue = unknown
> {
	readonly id: string;
	readonly header: string;
	readonly accessor: DatagridAccessor<TRecord, TValue>;
	readonly width?: string;
	readonly isSortable?: boolean;
	readonly alignment?: 'left' | 'center' | 'right';
	readonly renderCell?: (context: DatagridCellRenderContext<TRecord, TValue>) => ReactNode;
}

/**
 * Structured representation of a row after projection.
 */
export interface DatagridRow<
	TRecord extends DatagridRecord = DatagridRecord
> {
	readonly id: string;
	readonly key: string;
	readonly cells: ReadonlyArray<DatagridCell<TRecord, unknown>>;
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
	TColumn extends DatagridColumn<TRecord, unknown> = DatagridColumn<TRecord, unknown>
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
	TColumn extends DatagridColumn<TRecord, unknown> = DatagridColumn<TRecord, unknown>
> {
	readonly initialColumns?: ReadonlyArray<TColumn>;
	readonly records: ReadonlyArray<TRecord>;
}

/**
 * Parameters accepted when projecting rows for render.
 */
export interface ProjectRowsParams<
	TRecord extends DatagridRecord = DatagridRecord,
	TColumn extends DatagridColumn<TRecord, unknown> = DatagridColumn<TRecord, unknown>
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
	readonly column: DatagridColumn<TRecord, unknown>;
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
	readonly columns: ReadonlyArray<DatagridColumn<TRecord, unknown>>;
	readonly rowIdAccessor?: (record: TRecord, index: number) => string;
}
