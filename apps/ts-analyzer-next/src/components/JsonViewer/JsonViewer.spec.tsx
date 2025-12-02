import { render } from '@testing-library/react';

import JsonViewer from './JsonViewer';

describe('JsonViewer', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<JsonViewer />);
    expect(baseElement).toBeTruthy();
  });
  
});
