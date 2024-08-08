import '@testing-library/jest-dom';
import { fireEvent, render, within } from '@testing-library/react';

import { TestProviders, i18nInstance } from 'src/test_utils/TestProviders.tsx';

import LanguageButton from './LanguageButton.tsx';

describe('<LanguageButton />', () => {
  it('Renders a button which displays the inverse of the active lang option', () => {
    const { container: container_en } = render(
      <TestProviders i18n_lang="en">
        <LanguageButton />
      </TestProviders>,
    );

    expect(i18nInstance.locale).toEqual('en');

    const button_en = within(container_en).getByRole('button');
    expect(button_en).toHaveTextContent(/fr/i);

    const { container: container_fr } = render(
      <TestProviders i18n_lang="fr">
        <LanguageButton />
      </TestProviders>,
    );

    expect(i18nInstance.locale).toEqual('fr');

    const button_fr = within(container_fr).getByRole('button');
    expect(button_fr).toHaveTextContent(/en/i);
  });

  it('On click, toggles the app language', () => {
    const { container } = render(
      <TestProviders i18n_lang="en">
        <LanguageButton />
      </TestProviders>,
    );

    expect(i18nInstance.locale).toEqual('en');

    const button = within(container).getByRole('button');
    expect(button).toHaveTextContent(/fr/i);

    fireEvent.click(button);

    expect(i18nInstance.locale).toEqual('fr');
    expect(button).toHaveTextContent(/en/i);
  });
});
