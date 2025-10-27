import type { ReactNode } from 'react';

/**
 * Represents a single JSON record accepted by the datagrid.
 *
 * TODO: Enforce stronger typing via a generic (e.g., DatagridRecord<TSchema>) when the
 *       downstream API supports schema inference. For now we accept unknown values so the
 *       helpers can coerce data safely.
 */
export type DatagridRecord = Record<string, unknown>;

/**
 * TODO: Replace the placeholder union for primitive cell values with a schema-aware type.
 *       This will make it easier to render formatted values (dates, currency, etc.).
 */
export type DatagridPrimitive = string | number | boolean | null | undefined | Date;

/**
 * Minimal descriptor for a normalized cell ready for render.
 *
 * TODO: Expand `displayValue` to support richer cell renderers (icons, badges) once the
 *       component exposes render prop overrides.
 */
export interface DatagridCell {
	readonly columnId: string;
	readonly key: string;
	readonly rawValue: unknown;
	readonly displayValue?: ReactNode;
}

/**
 * Metadata describing a single column.
 *
 * TODO: Confirm whether `unknown` is sufficient once formatting helpers land; if not,
 *       introduce a refined return type during the implementation pass.
 */
export interface DatagridColumn {
	readonly id: string;
	readonly header: string;
	readonly accessor: (record: DatagridRecord) => unknown;
	readonly width?: string;
	readonly isSortable?: boolean;
	readonly alignment?: 'left' | 'center' | 'right';
}

/**
 * Structured representation of a row after projection.
 *
 * TODO: Add memoized `key` derivation (vs. exposing a string literal) once the row projection
 *       helper ensures stable keys independent of render order.
 */
export interface DatagridRow {
	readonly id: string;
	readonly cells: ReadonlyArray<DatagridCell>;
	readonly original: DatagridRecord;
}

/**
 * Optional callbacks accepted by the datagrid for deriving metadata.
 *
 * TODO: Keep these callbacks lightweight; avoid over-complicating the contract unless future
 *       requirements demand richer data structures.
 */
export interface DatagridAccessors {
	readonly rowId?: (record: DatagridRecord, index: number) => string;
	readonly emptyMessage?: string;
	readonly errorMessage?: string;
}

/**
 * Props accepted by the Datagrid component.
 *
 * TODO: Promote `columns` to a generic type parameter so downstream consumers can enforce
 *       stronger compile-time guarantees for accessor keys.
 */
export interface DatagridProps extends DatagridAccessors {
	readonly data: ReadonlyArray<DatagridRecord>;
	readonly columns?: ReadonlyArray<DatagridColumn>;
	readonly isLoading?: boolean;
	readonly caption?: string;
	readonly emptyState?: ReactNode;
	readonly errorState?: ReactNode;
}

/**
 * Parameters accepted when deriving column metadata from raw props.
 *
 * TODO: Consider swapping `initialColumns` for a discriminated union if optional cases grow.
 */
export interface DeriveColumnsParams {
	readonly initialColumns?: ReadonlyArray<DatagridColumn>;
	readonly records: ReadonlyArray<DatagridRecord>;
}

/**
 * Parameters accepted when projecting rows for render.
 *
 * TODO: Keep the parameter surface focused on projection concerns; new behaviours can extend
 *       the shape as features evolve.
 */
export interface ProjectRowsParams {
	readonly columns: ReadonlyArray<DatagridColumn>;
	readonly records: ReadonlyArray<DatagridRecord>;
	readonly rowId?: (record: DatagridRecord, index: number) => string;
}
