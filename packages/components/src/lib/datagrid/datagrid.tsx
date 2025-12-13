import * as Match from 'effect/Match';
import { pipe } from 'effect/Function';
import { isValidElement, ReactNode, useMemo } from 'react';

import styles from './datagrid.module.css';
import { deriveColumns, projectRows } from './datagrid.helpers';
import type { DatagridProps, DatagridRecord } from './datagrid.types';

const toRenderableValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined) {
    return '';
  }

  if (isValidElement(value)) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return value as ReactNode;
  }

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (typeof value === 'function') {
    return 'Function';
  }

  return pipe(
    value,
    (input) => {
      try {
        const serialized = JSON.stringify(input);
        return serialized === undefined ? String(input) : serialized;
      } catch {
        return String(input);
      }
    }
  );
};

export const Datagrid = <
  TRecord extends DatagridRecord = DatagridRecord
>(props: DatagridProps<TRecord>) => {
  const columns = useMemo(
    () =>
      deriveColumns({
        initialColumns: props.columns,
        records: props.data,
      }),
    [props.columns, props.data]
  );

  const rows = useMemo(
    () =>
      projectRows({
        columns,
        records: props.data,
        rowId: props.rowId,
      }),
    [columns, props.data, props.rowId]
  );

  const columnCount = Math.max(columns.length, 1);
  const gridState = useMemo(() => {
    if (props.isLoading) {
      return 'loading' as const;
    }

    if (props.errorState || props.errorMessage) {
      return 'error' as const;
    }

    if (rows.length === 0) {
      return 'empty' as const;
    }

    return 'ready' as const;
  }, [props.isLoading, props.errorState, props.errorMessage, rows.length]);

  const renderFallbackRow = (key: string, content: ReactNode) => (
    <tr key={key} className={styles['bodyRow']}>
      <td colSpan={columnCount}>{content}</td>
    </tr>
  );

  const bodyRows = useMemo<ReadonlyArray<ReactNode>>(
    () =>
      Match.value(gridState).pipe(
        Match.when('loading', () => [renderFallbackRow('loading', 'Loading...')]),
        Match.when('error', () => [
          renderFallbackRow(
            'error',
            props.errorState ?? props.errorMessage ?? 'Something went wrong.'
          ),
        ]),
        Match.when('empty', () => [
          renderFallbackRow('empty', props.emptyState ?? props.emptyMessage ?? 'No data available.'),
        ]),
        Match.orElse(() =>
          rows.map((row) => (
            <tr key={row.id} className={styles['bodyRow']}>
              {row.cells.map((cell) => (
                <td key={cell.key} data-column-id={cell.columnId}>
                  {toRenderableValue(cell.rawValue)}
                </td>
              ))}
            </tr>
          ))
        )
      ),
    [gridState, columnCount, props.emptyMessage, props.emptyState, props.errorMessage, props.errorState, rows]
  );

  return (
    <div className={styles['container']}>
      <table className={styles['table']}>
        {props.caption ? <caption>{props.caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={styles['headerCell']}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{bodyRows}</tbody>
      </table>
    </div>
  );
};
