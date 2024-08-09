import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import AppErrorFallback from './AppErrorFallback.tsx';

describe('AppErrorFallback component', () => {
  const mockError = new Error('Test error message');

  it('renders AppErrorFallback component', () => {
    const { container } = render(
      <AppErrorFallback error={mockError} resetErrorBoundary={() => {}} />,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/.+/);

    const homeButton = container.querySelector('a');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveAttribute('href', '/');

    const errorMessage = screen.getByText(mockError.message);
    expect(errorMessage).toBeInTheDocument();
  });
});
