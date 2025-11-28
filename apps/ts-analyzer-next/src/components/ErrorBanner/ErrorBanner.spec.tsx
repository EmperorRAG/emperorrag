import { render } from '@testing-library/react';

import ErrorBanner from './ErrorBanner';

describe('ErrorBanner', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<ErrorBanner />);
    expect(baseElement).toBeTruthy();
  });
  
});
