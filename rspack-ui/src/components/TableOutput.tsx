import React from "react";

import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    TableContainer,
    Table,
    TableCaption,
    Tr,
} from "@chakra-ui/react";

import { FcMinus, FcPlus } from 'react-icons/fc';

import { Trans } from '@lingui/macro';


interface WorkBook {
    sheets: object | null;
}

interface MyComponentProps {
    shouldDisplayComponent: boolean;
    parserData: WorkBook | null;
}


const TableOutput: React.FC<MyComponentProps> = ({ shouldDisplayComponent, parserData }) => {
    return (
        <>
            {shouldDisplayComponent &&
                <Accordion
                    allowToggle
                    defaultIndex={[0]}
                    fontFamily="Noto Sans"
                    fontSize={'16'}
                    color="#333"
                >
                    <AccordionItem>
                        {({ isExpanded }) => (
                            <>
                                <AccordionButton>
                                    {isExpanded ? (
                                        <>
                                            <Box flex="1" textAlign="left">
                                                <Trans>
                                                    Show Less
                                                </Trans>
                                            </Box>{' '}
                                            <FcMinus fontSize="12px" />
                                        </>
                                    ) : (
                                        <>
                                            <Box flex="1" textAlign="left">
                                                <Trans>
                                                    Show More
                                                </Trans>
                                            </Box>{' '}
                                            <FcPlus fontSize="12px" />
                                        </>
                                    )}
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    <TableContainer>
                                        <Table variant="simple">
                                            <TableCaption>
                                                <Trans>
                                                    File Properties
                                                </Trans>

                                            </TableCaption>
                                        </Table>
                                    </TableContainer>
                                </AccordionPanel>
                                <Box>
                                    <Trans>
                                        Data Preview
                                    </Trans>
                                    <pre>{JSON.stringify(parserData?.sheets, null, 2)}</pre>
                                </Box>
                            </>
                        )}
                    </AccordionItem>
                </Accordion>
            }

        </>
    );
};

export default TableOutput;
