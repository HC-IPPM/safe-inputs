import React from "react";

import { Flex,Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function DoesNotExistPage() {
    const { t } = useTranslation()
    return (
        <>
            <Flex justify={'center'} align={'center'} h='100Vh' w='100Vw' bg='gray.100'>
                <Text> {t("doesNotExist.message")} </Text>
            </Flex>
        </>
    )
}