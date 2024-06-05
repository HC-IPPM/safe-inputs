import type { ButtonProps } from '@chakra-ui/react';
import { Button, Text } from '@chakra-ui/react';

import { useLingui } from '@lingui/react';

// Function for the language Button.
// Button will change the state of the Language from EN/FR.
// TODO: Languages should be initially set by window language detector
export default function LanguageButton(StyleProps: ButtonProps) {
  const { i18n } = useLingui();

  const target_i18n = (() => {
    if (i18n.locale === 'en') {
      return 'fr';
    } else if (i18n.locale === 'fr') {
      return 'en';
    } else {
      throw new Error(`Current locale \`${i18n.locale}\` is not supported`);
    }
  })();

  const button_text = target_i18n[0].toUpperCase() + target_i18n.slice(1);

  const style = {
    w: '20px',
    ...StyleProps,
  };

  return (
    <Button
      {...style}
      defaultValue={i18n.locale}
      onClick={() => i18n.activate(target_i18n)}
      as="button"
    >
      <Text>{button_text}</Text>
    </Button>
  );
}
