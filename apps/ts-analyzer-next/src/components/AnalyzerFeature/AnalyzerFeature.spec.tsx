import { render } from '@testing-library/react';

import AnalyzerFeature from './AnalyzerFeature';

describe('AnalyzerFeature', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<AnalyzerFeature />);
    expect(baseElement).toBeTruthy();
  });
  
});
