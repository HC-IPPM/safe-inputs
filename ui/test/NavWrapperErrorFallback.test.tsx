import { render } from '@testing-library/react';

import NavWrapperErrorFallBack from 'src/components/error/NavWrapperErrorFallback.tsx';
import '@testing-library/jest-dom';

jest.mock('@lingui/macro', () => ({
  Trans: function TransMock({ children }: { children: React.ReactNode }) {
    return children;
  },
}));

describe('NavWrapperErrorFallBack', () => {
  const mockError = new Error('Test error message');
  const mockResetErrorBoundary = jest.fn();

  test('renders the component correctly with all elements', () => {
    const { container } = render(
      <NavWrapperErrorFallBack
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />,
    );

    const errorTitle = container.querySelector('.error-title');
    const errorAdvice = container.querySelector('.error-advice');
    const homeButton = container.querySelector('a');
    const errorMessage = container.querySelector('.error-message');

    expect(errorTitle).toHaveTextContent('Something went wrong');
    expect(errorAdvice).toHaveTextContent(
      'Please contact the developers or go to the home page.',
    );
    expect(homeButton).toHaveTextContent('Go to Home');
    expect(errorMessage).toHaveTextContent(mockError.message);

    expect(homeButton).toHaveAttribute('href', '/');
  });
});
