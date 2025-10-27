import { render } from '@testing-library/react';

import Datagrid from './datagrid';

describe('Datagrid', () => {

  it('should render successfully', () => {
    const { baseElement } = render(<Datagrid />);
    expect(baseElement).toBeTruthy();
  });

});
