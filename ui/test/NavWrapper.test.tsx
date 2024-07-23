import '@testing-library/jest-dom';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { Routes, Route, MemoryRouter, Outlet } from 'react-router-dom';

import { messages } from 'src/i18n/locales/en/messages.ts';
import { messages as frMessages } from 'src/i18n/locales/fr/messages.ts';
import NavWrapper from 'src/pages/NavWrapper.tsx';

i18n.load({
  en: messages,
  fr: frMessages,
});

const TestingProvider = ({ children }: any) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
);

jest.mock('@lingui/macro', () => ({
  Trans: function TransMock({ children }: { children: React.ReactNode }) {
    return children;
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: jest.fn(),
}));

jest.mock('../src/components/auth/AuthNavButton.tsx', () => {
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

    act(() => {
      i18n.activate('en');
    });

    render(
      <TestingProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavWrapper />}>
              <Route index element={<div>Fake element</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </TestingProvider>,
    );
    expect(screen.getByText('Fake element')).toBeInTheDocument();
  });

  test('renders Error fallback component', () => {
    act(() => {
      i18n.activate('en');
    });
    (Outlet as jest.Mock).mockImplementation(() => {
      throw new Error('Component failure');
    });
    const { container } = render(
      <TestingProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<NavWrapper />}>
              <Route index element={<div>Fake element</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </TestingProvider>,
    );
    const errorTitle = container.querySelector('.error-title');
    const errorMessage = container.querySelector('.error-message');

    expect(errorTitle).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();

    expect(errorTitle).toHaveTextContent('Something went wrong');
    expect(errorMessage).toHaveTextContent('Component failure');
  });
});
