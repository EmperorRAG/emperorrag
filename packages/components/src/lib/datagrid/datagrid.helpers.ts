import { Match, pipe } from 'effect';
import * as Array from 'effect/Array';
import * as Option from 'effect/Option';
import type {
  DatagridCell,
  DatagridColumn,
  DatagridRecord,
  DatagridRow,
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
const normalizeColumn = (column: DatagridColumn): DatagridColumn =>
  pipe(
    column,
    (current) => ({
      ...current,
      id: toKebabCase(current.id),
    })
  );

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
const normalizeColumns = (
  columns: ReadonlyArray<DatagridColumn>
): ReadonlyArray<DatagridColumn> =>
  pipe(
    columns,
    (list) => list.map(normalizeColumn)
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
const createColumnFromKey = (key: string): DatagridColumn =>
  pipe(
    toKebabCase(key),
    (columnId): DatagridColumn => ({
      id: columnId,
      header: key,
      accessor: (record: DatagridRecord) => record[key],
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
const createColumnsFromRecord = (
  record: DatagridRecord
): ReadonlyArray<DatagridColumn> =>
  pipe(
    Object.keys(record),
    (keys) => keys.map(createColumnFromKey)
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
const deriveColumnsFromRecords = (
  records: ReadonlyArray<DatagridRecord>
): ReadonlyArray<DatagridColumn> =>
  Match.value(records).pipe(
    Match.when((items) => !isNonEmptyArray(items), () => []),
    Match.orElse(() =>
      pipe(
        records,
        Array.head,
        Option.match({
          onSome: (record) => normalizeColumns(createColumnsFromRecord(record)),
          onNone: () => [] as ReadonlyArray<DatagridColumn>,
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
const appendMissingColumns = (
  provided: ReadonlyArray<DatagridColumn>,
  fallback: ReadonlyArray<DatagridColumn>
): ReadonlyArray<DatagridColumn> =>
  pipe(
    fallback,
    (candidates) =>
      candidates.filter((candidate) =>
        pipe(
          Option.fromNullable(
            provided.find((column) => column.id === candidate.id)
          ),
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
const resolveRowId = (
  record: DatagridRecord,
  index: number,
  rowIdAccessor?: (record: DatagridRecord, index: number) => string
): string =>
  pipe(
    Option.fromNullable(rowIdAccessor),
    Option.match({
      onSome: (deriveId) => deriveId(record, index),
      onNone: () => `row-${index}`,
    })
  );

type RowFactoryInput = {
  readonly record: DatagridRecord;
  readonly index: number;
  readonly columns: ReadonlyArray<DatagridColumn>;
  readonly rowIdAccessor?: (record: DatagridRecord, index: number) => string;
};

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
const createCells = (
  columns: ReadonlyArray<DatagridColumn>,
  record: DatagridRecord,
  rowId: string
): ReadonlyArray<DatagridCell> =>
  pipe(
    columns,
    (columnList) =>
      columnList.map((column, columnIndex) =>
        createCell({
          column,
          record,
          rowId,
          columnIndex,
        })
      )
  );

type CellFactoryInput = {
  readonly column: DatagridColumn;
  readonly record: DatagridRecord;
  readonly rowId: string;
  readonly columnIndex: number;
};

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
const createCell = (input: CellFactoryInput): DatagridCell =>
  pipe(
    input.column.accessor(input.record),
    (rawValue) => ({
      columnId: input.column.id,
      key: `${input.rowId}-${input.column.id}-${input.columnIndex}`,
      rawValue,
    })
  );

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
const createRow = (input: RowFactoryInput): DatagridRow =>
  pipe(
    resolveRowId(input.record, input.index, input.rowIdAccessor),
    (rowId) => ({
      id: rowId,
      original: input.record,
      cells: createCells(input.columns, input.record, rowId),
    })
  );

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
export const deriveColumns = (
  params: DeriveColumnsParams
): ReadonlyArray<DatagridColumn> => {
  const inferredColumns = deriveColumnsFromRecords(params.records);
  return pipe(
    Option.fromNullable(params.initialColumns),
    Option.filter(isNonEmptyArray),
    Option.map(normalizeColumns),
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
export const projectRows = (
  params: ProjectRowsParams
): ReadonlyArray<DatagridRow> =>
  pipe(
    params.records,
    (records) =>
      records.map((record, index) =>
        createRow({
          record,
          index,
          columns: params.columns,
          rowIdAccessor: params.rowId,
        })
      )
  );
