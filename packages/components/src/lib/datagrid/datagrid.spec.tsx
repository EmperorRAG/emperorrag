import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import Datagrid from './datagrid';
import type { DatagridColumn } from './datagrid.types';

describe('Datagrid', () => {
  it('renders column headers inferred from record keys', () => {
    render(
      <Datagrid
        caption="Pioneer directory"
        data={[
          {
            id: 'row-1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
          },
        ]}
      />
    );

    expect(
      screen.getByRole('columnheader', {
        name: 'id',
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('columnheader', {
        name: 'firstName',
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('columnheader', {
        name: 'lastName',
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('columnheader', {
        name: 'email',
      })
    ).toBeTruthy();
  });

  it('displays loading fallback row while data is loading', () => {
    render(
      <Datagrid
        data={[
          {
            id: 'row-1',
            label: 'Pending row',
          },
        ]}
        isLoading
      />
    );

  expect(screen.getByText('Loading...')).toBeTruthy();
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
  });

  it('renders empty state messaging when no records are available', () => {
    render(
      <Datagrid
        data={[]}
        emptyMessage="No entries found"
        columns={[]}
      />
    );

  expect(screen.getByText('No entries found')).toBeTruthy();
  });

  it('prioritises error messaging over empty state content', () => {
    render(
      <Datagrid
        data={[]}
        emptyMessage="No entries found"
        errorMessage="Unable to load data"
      />
    );

  expect(screen.getByText('Unable to load data')).toBeTruthy();
  expect(screen.queryByText('No entries found')).toBeNull();
  });

  it('renders primitive and JSX cell values consistently', () => {
    const contentCell = <span>Rendered content</span>;

    type SampleRow = {
      id: number;
      active: boolean;
      content: ReactElement;
    };

    const columns: ReadonlyArray<DatagridColumn<SampleRow>> = [
      {
        id: 'identifier',
        header: 'Identifier',
        accessor: (row) => row.id,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.active,
      },
      {
        id: 'content',
        header: 'Content',
        accessor: (row) => row.content,
      },
    ];

    render(
      <Datagrid
        data={[
          {
            id: 42,
            active: true,
            content: contentCell,
          },
        ]}
        columns={columns}
      />
    );

  expect(screen.getByRole('cell', { name: '42' })).toBeTruthy();
  expect(screen.getByRole('cell', { name: 'True' })).toBeTruthy();
  expect(screen.getByText('Rendered content')).toBeTruthy();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Datagrid
        data={[]}
        columns={[]}
        emptyMessage="No rows yet"
        errorMessage="Something went wrong"
      />,
    );
    expect(baseElement).toBeTruthy();
  });

});
