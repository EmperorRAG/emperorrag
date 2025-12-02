import { render } from '@testing-library/react';

import RunAnalyzerForm from './RunAnalyzerForm';

describe('RunAnalyzerForm', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<RunAnalyzerForm />);
    expect(baseElement).toBeTruthy();
  });
  
});
