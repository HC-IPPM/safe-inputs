import React from "react";

import { Button, Text } from '@chakra-ui/react';
import { useLingui } from '@lingui/react';

const LanguageButtonStyle = {
    w: '20px',
    h: '30px',
    margin: '2',
    bg: 'transparent',
    outline: 'varient',
    color: '#333333',
    border: '1px',
    borderColor: '#333333',
    _hover: {
        color: '#FFFFFF',
        bg: '#26374A',
        textDecor: 'underline',
        borderColor: '#FFFFFF',
    },
}

// Function for the language Button.
// Button will change the state of the Language from EN/FR.
// TODO: Languages should be initially set by window language detector
export default function LanguageButton() {
    const { i18n } = useLingui();

    return (
        <>
            {i18n.locale === 'en' ? (
                <>
                    <Button
                        {...LanguageButtonStyle}
                        defaultValue={i18n.locale}
                        onClick={() => i18n.activate('fr')}
                        as="button"
                    >
                        <Text>Fr</Text>
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        {...LanguageButtonStyle}
                        defaultValue={i18n.locale}
                        onClick={() => i18n.activate('en')}
                        as="button"
                    >
                        <Text>En</Text>
                    </Button>
                </>
            )}
        </>
    )
}
