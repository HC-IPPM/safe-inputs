import React from "react";

import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
} from "@chakra-ui/react";

import { FcMinus, FcPlus } from 'react-icons/fc';

import { WorkBook } from "xlsx";
import DataTable from "./DataTable";


interface SheetData {
    sheetName: string
    data: any[]
}

interface ParserData {
    sheets: SheetData[];
    workbook: WorkBook;
}

interface ExcelFileOutputProps {
    shouldDisplayComponent: boolean;
    parserData: ParserData | null;
}

const ExcelFileOutput: React.FC<ExcelFileOutputProps> = ({ shouldDisplayComponent, parserData }) => {
    const p = (parserData && parserData.workbook && parserData.workbook.Props);
    return (
        <>
            {shouldDisplayComponent && p && parserData.sheets.map((sheet: SheetData, sheetNumber: number) => (
                sheet.data && sheet.data.length && (
                    <Accordion
                        key={sheetNumber}
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
                                                    {`Hide ${sheet.sheetName} content`}
                                                </Box>{' '}
                                                <FcMinus fontSize="12px" />
                                            </>
                                        ) : (
                                            <>
                                                <Box flex="1" textAlign="left">
                                                    {`Show ${sheet.sheetName} content`}
                                                </Box>{' '}
                                                <FcPlus fontSize="12px" />
                                            </>
                                        )}
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                        <DataTable initialData={sheet.data} />
                                    </AccordionPanel>
                                </>
                            )}
                        </AccordionItem>
                    </Accordion>
                )
            ))}

        </>
    );
};

export default ExcelFileOutput;
