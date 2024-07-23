import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import AppErrorFallback from 'src/components/error/AppErrorFallback.tsx';

describe('AppErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetErrorBoundary = jest.fn();

  test('renders the component correctly with all elements and handles language switch', () => {
    const { container } = render(
      <AppErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />,
    );
    const languageButton = screen.getByRole('button', { name: 'Fr' });
    expect(languageButton).toBeInTheDocument();

    const errorTitle = container.querySelector('.error-title');
    const errorAdvice = container.querySelector('.error-advice');
    const homeButton = container.querySelector('a');
    const errorMessage = container.querySelector('.error-message');

    expect(errorTitle).toHaveTextContent(
      'The application crashed unexpectedly',
    );
    expect(errorAdvice).toHaveTextContent(
      'Please contact the developers or go to the home page.',
    );
    expect(homeButton).toHaveTextContent('Go to Home');
    expect(errorMessage).toHaveTextContent(mockError.message);

    expect(homeButton).toHaveAttribute('href', '/');

    // Translate to French
    fireEvent.click(languageButton);

    expect(errorTitle).toHaveTextContent(
      "L'application a planté de manière inattendue",
    );
    expect(errorAdvice).toHaveTextContent(
      "Veuillez contacter les développeurs ou aller à la page d'accueil.",
    );
    expect(homeButton).toHaveTextContent("Aller à l'accueil");
  });
});
