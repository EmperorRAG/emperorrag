import * as Match from 'effect/Match';
import { pipe } from 'effect/Function';
import { filter, findFirst, head, map } from 'effect/Array';
import * as Option from 'effect/Option';
import type {
	DatagridCell,
	DatagridCellFactoryInput,
	DatagridColumn,
	DatagridRecord,
	DatagridRow,
	DatagridRowFactoryInput,
	DeriveColumnsParams,
	ProjectRowsParams,
} from './datagrid.types';

/**
 * Determines whether an array contains at least one element.
 *
 * @pure This function is pure and does not have side effects.
 * @description Evaluates the array length using pattern matching, avoiding imperative checks.
 *
 * @fp-pattern Predicate
 *
 * @param items - The array to inspect.
 * @returns {boolean} `true` when the array contains at least one element.
 */
const isNonEmptyArray = <T>(items: ReadonlyArray<T>): boolean =>
	Match.value(items.length).pipe(
		Match.when(0, () => false),
		Match.orElse(() => true)
	);

/**
 * Normalizes a string into kebab-case for reuse as a DOM-friendly identifier.
 *
 * @pure This function is pure and does not have side effects.
 * @description Trims the input, inserts hyphens between word boundaries, collapses repeated
 * hyphens, and lowercases the final result.
 *
 * @fp-pattern Transducer
 *
 * @param value - The string to normalize.
 * @returns {string} The kebab-case representation of the original string.
 */
const toKebabCase = (value: string): string =>
	pipe(
		value,
		(input) => input.trim(),
		(input) => input.replace(/([a-z0-9])([A-Z])/g, '$1-$2'),
		(input) => input.replace(/[\s_]+/g, '-'),
		(input) => input.replace(/-+/g, '-'),
		(input) => input.toLowerCase()
	);

/**
 * Ensures column metadata uses normalized identifiers without mutating the source column.
 *
 * @pure This function is pure and does not have side effects.
 * @description Returns a shallow copy of the column with its identifier transformed to kebab-case.
 *
 * @fp-pattern Functor mapping
 *
 * @param column - The column to normalize.
 * @returns {DatagridColumn} A new column instance with a normalized identifier.
 */
const normalizeColumn = <TRecord extends DatagridRecord>(column: DatagridColumn<TRecord>): DatagridColumn<TRecord> =>
	pipe(column, (current) => ({
		...current,
		id: toKebabCase(current.id),
	}));

/**
 * Applies `normalizeColumn` to every column in the provided collection.
 *
 * @pure This function is pure and does not have side effects.
 * @description Uses `map` to ensure all column identifiers follow the kebab-case convention.
 *
 * @fp-pattern Functor mapping
 *
 * @param columns - The columns to normalize.
 * @returns {ReadonlyArray<DatagridColumn>} A normalized copy of the input columns.
 */
const normalizeColumns = <TRecord extends DatagridRecord>(columns: ReadonlyArray<DatagridColumn<TRecord>>): ReadonlyArray<DatagridColumn<TRecord>> =>
	pipe(
		columns,
		map((column) => normalizeColumn(column))
	);

/**
 * Creates column metadata for a single record key.
 *
 * @pure This function is pure and does not have side effects.
 * @description Produces a column descriptor that reads values from the record using the key.
 *
 * @fp-pattern Constructor
 *
 * @param key - The record key powering the column.
 * @returns {DatagridColumn} Column metadata referencing the supplied key.
 */
const createColumnFromKey = <TRecord extends DatagridRecord>(key: keyof TRecord & string): DatagridColumn<TRecord> =>
	pipe(
		toKebabCase(key),
		(columnId): DatagridColumn<TRecord> => ({
			id: columnId,
			header: key,
			accessor: (record: TRecord) => record[key],
		})
	);

/**
 * Derives columns from the first record when explicit columns are not provided.
 *
 * @pure This function is pure and does not have side effects.
 * @description Returns inferred column descriptors that maintain the original key order.
 *
 * @fp-pattern Accessor
 *
 * @param record - The record used to infer column structure.
 * @returns {ReadonlyArray<DatagridColumn>} Column metadata derived from the record keys.
 */
const createColumnsFromRecord = <TRecord extends DatagridRecord>(record: TRecord): ReadonlyArray<DatagridColumn<TRecord>> =>
	pipe(
		Object.keys(record) as Array<keyof TRecord & string>,
		map((key) => createColumnFromKey<TRecord>(key))
	);

/**
 * Generates column metadata by inspecting the available records.
 *
 * @pure This function is pure and does not have side effects.
 * @description Utilizes pattern matching to handle empty datasets and falls back to the first
 * record for inference when data is present.
 *
 * @fp-pattern Accessor
 *
 * @param records - The dataset powering the datagrid.
 * @returns {ReadonlyArray<DatagridColumn>} Inferred columns normalized for rendering.
 */
const deriveColumnsFromRecords = <TRecord extends DatagridRecord>(records: ReadonlyArray<TRecord>): ReadonlyArray<DatagridColumn<TRecord>> =>
	Match.value(records).pipe(
		Match.when(
			(items) => !isNonEmptyArray(items),
			() => [] as ReadonlyArray<DatagridColumn<TRecord>>
		),
		Match.orElse(() =>
			pipe(
				records,
				head,
				Option.match({
					onSome: (record) => normalizeColumns(createColumnsFromRecord(record)),
					onNone: () => [] as ReadonlyArray<DatagridColumn<TRecord>>,
				})
			)
		)
	);

/**
 * Appends inferred columns that are missing from a caller-supplied column collection.
 *
 * @pure This function is pure and does not have side effects.
 * @description Ensures caller overrides remain first while preserving inferred coverage.
 *
 * @fp-pattern Reducer
 *
 * @param provided - The normalized caller-supplied columns.
 * @param fallback - The inferred columns derived from the dataset.
 * @returns {ReadonlyArray<DatagridColumn>} Combined column metadata without duplicates.
 */
const appendMissingColumns = <TRecord extends DatagridRecord>(
	provided: ReadonlyArray<DatagridColumn<TRecord>>,
	fallback: ReadonlyArray<DatagridColumn<TRecord>>
): ReadonlyArray<DatagridColumn<TRecord>> =>
	pipe(
		fallback,
		filter((candidate) =>
			pipe(
				provided,
				findFirst((column) => column.id === candidate.id),
				Option.match({
					onSome: () => false,
					onNone: () => true,
				})
			)
		),
		(missing) => [...provided, ...missing]
	);

/**
 * Resolves a row identifier using an optional accessor before falling back to the index.
 *
 * @pure This function is pure and does not have side effects.
 * @description Delegates to the caller-supplied accessor when available to ensure stable keys.
 *
 * @fp-pattern Accessor
 *
 * @param record - The record to identify.
 * @param index - The zero-based index of the record within the dataset.
 * @param rowIdAccessor - Optional accessor for deriving stable identifiers.
 * @returns {string} A stable string identifier for the row.
 */
const resolveRowId = <TRecord extends DatagridRecord>(record: TRecord, index: number, rowIdAccessor?: (record: TRecord, index: number) => string): string =>
	pipe(
		Option.fromNullable(rowIdAccessor),
		Option.match({
			onSome: (deriveId) => deriveId(record, index),
			onNone: () => `row-${index}`,
		})
	);

/**
 * Builds the cell collection for a given record.
 *
 * @pure This function is pure and does not have side effects.
 * @description Maps over the column metadata to create keyed cell descriptors.
 *
 * @fp-pattern Functor mapping
 *
 * @param columns - The columns describing how to read the record.
 * @param record - The source record for the row.
 * @param rowId - The resolved identifier for the row.
 * @returns {ReadonlyArray<DatagridCell>} Cells ready for datagrid rendering.
 */
const createCells = <TRecord extends DatagridRecord>(
	columns: ReadonlyArray<DatagridColumn<TRecord>>,
	record: TRecord,
	rowId: string
): ReadonlyArray<DatagridCell<TRecord>> =>
	pipe(
		columns,
		map((column, columnIndex) =>
			createCell({
				column,
				record,
				rowId,
				columnIndex,
			})
		)
	);

/**
 * Constructs a single cell descriptor from column metadata and a record value.
 *
 * @pure This function is pure and does not have side effects.
 * @description Evaluates the column accessor and produces a keyed cell descriptor for rendering.
 *
 * @fp-pattern Constructor
 *
 * @param input - The contextual information required to build the cell.
 * @returns {DatagridCell} A normalized cell descriptor.
 */
const createCell = <TRecord extends DatagridRecord>(input: DatagridCellFactoryInput<TRecord>): DatagridCell<TRecord> =>
	pipe(input.column.accessor(input.record), (rawValue) => ({
		columnId: input.column.id,
		key: `${input.rowId}-${input.column.id}-${input.columnIndex}`,
		rawValue,
	}));

/**
 * Converts a record into a `DatagridRow` using provided column metadata.
 *
 * @pure This function is pure and does not have side effects.
 * @description Resolves the row identifier and projects column values into cell descriptors.
 *
 * @fp-pattern Constructor
 *
 * @param input - The row factory parameters.
 * @returns {DatagridRow} A normalized row descriptor ready for rendering.
 */
const createRow = <TRecord extends DatagridRecord>(input: DatagridRowFactoryInput<TRecord>): DatagridRow<TRecord> =>
	pipe(resolveRowId(input.record, input.index, input.rowIdAccessor), (rowId) => ({
		id: rowId,
		original: input.record,
		cells: createCells(input.columns, input.record, rowId),
	}));

/**
 * Derives normalized column metadata for the datagrid component.
 *
 * @pure This function is pure and does not have side effects.
 * @description Prefers caller-supplied column metadata, falling back to inference from the first
 * record while ensuring identifiers remain stable.
 *
 * @fp-pattern Accessor
 * @composition
 *   - `pipe(params.initialColumns, Option.fromNullable, Option.filter(isNonEmptyArray))`
 *   - `Match.value(records)` for empty dataset handling
 *
 * @param params - Parameters containing raw records and optional predefined columns.
 * @returns {ReadonlyArray<DatagridColumn>} Derived metadata used to render headers and cells.
 *
 * @example
 * const columns = deriveColumns({ records: [{ id: 1, name: 'Ada' }] });
 * // => [{ id: 'id', header: 'id', accessor: [Function] }, { id: 'name', header: 'name', accessor: [Function] }]
 */
export const deriveColumns = <TRecord extends DatagridRecord>(params: DeriveColumnsParams<TRecord>): ReadonlyArray<DatagridColumn<TRecord>> => {
	const inferredColumns = deriveColumnsFromRecords(params.records);
	return pipe(
		Option.fromNullable(params.initialColumns),
		Option.filter(isNonEmptyArray),
		Option.map((columns) => normalizeColumns(columns)),
		Option.match({
			onSome: (provided) => appendMissingColumns(provided, inferredColumns),
			onNone: () => inferredColumns,
		})
	);
};

/**
 * Projects raw records into ordered row descriptors suitable for `<tbody>` rendering.
 *
 * @pure This function is pure and does not have side effects.
 * @description Applies the column accessors to every record while generating stable row keys.
 *
 * @fp-pattern Functor mapping
 * @composition
 *   - `pipe(params.records, map(createRow))`
 *
 * @param params - Parameters containing the columns, records, and optional row id getter.
 * @returns {ReadonlyArray<DatagridRow>} Projected rows ready for datagrid rendering.
 *
 * @example
 * const rows = projectRows({ columns: deriveColumns({ records }), records });
 * // => [{ id: 'row-0', cells: [...], original: { ... } }, ...]
 */
export const projectRows = <TRecord extends DatagridRecord>(params: ProjectRowsParams<TRecord>): ReadonlyArray<DatagridRow<TRecord>> =>
	pipe(
		params.records,
		map((record, index) =>
			createRow({
				record,
				index,
				columns: params.columns,
				rowIdAccessor: params.rowId,
			})
		)
	);
