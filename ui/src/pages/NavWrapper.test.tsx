import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { Routes, Route, MemoryRouter, Outlet } from 'react-router-dom';

import { TestProviders } from 'src/test_utils/TestProviders.tsx';

import NavWrapper from './NavWrapper.tsx';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(),
}));

jest.mock('../components/auth/AuthNavButton.tsx', () => {
  const MockAuthNavButton = () => <div>Button</div>;
  return MockAuthNavButton;
});

describe('NavWrapper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders header, footer, and outlet without error', () => {
    const actualOutlet = jest.requireActual('react-router-dom').Outlet;
    (Outlet as jest.Mock).mockImplementation(actualOutlet);

    const { container } = render(
      <TestProviders i18n_lang="en">
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavWrapper />}>
              <Route
                index
                element={<div data-testid="outlet-content">Fake element</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </TestProviders>,
    );
    expect(container.querySelectorAll('header')).toHaveLength(1);
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
    expect(container.querySelectorAll('footer')).toHaveLength(1);
  });

  test('renders Error fallback component', () => {
    const mockError = new Error('Component Failure');

    (Outlet as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    render(
      <TestProviders>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavWrapper />}>
              <Route index element={<div>Fake element</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </TestProviders>,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/.+/);

    const errorMessage = screen.getByText(mockError.message);

    expect(errorMessage).toBeInTheDocument();
  });
});
