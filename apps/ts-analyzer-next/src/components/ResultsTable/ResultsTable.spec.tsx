import { render } from '@testing-library/react';

import ResultsTable from './ResultsTable';

describe('ResultsTable', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<ResultsTable />);
    expect(baseElement).toBeTruthy();
  });
  
});
