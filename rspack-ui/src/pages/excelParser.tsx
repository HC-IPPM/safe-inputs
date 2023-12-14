import React, { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import { Trans } from "@lingui/macro";
import { WorkBook } from "xlsx";

import ExcelUploadForm from "../components/ExcelUploadForm";
import ExcelFileOutput from "../components/ExcelFileOutput";

interface Sheet { sheetName: string; data: any }

interface ParserData {
    sheets: Sheet[];
    workbook: WorkBook;
}

const ExcelParsingPage: React.FC = () => {
    const parserWorker = new Worker("/worker.js");
    const handleFileUpload = (file: File) => {
        parserWorker.postMessage({ type: 'file', file });
    };

    // TODO: these components should maybe be decoupled from excelParser.tsx
    const [displayComponent, setDisplayComponent] = useState(false);
    const [parserData, setParserData] = useState<ParserData | null>(null);

    // Register callback on myWorker
    parserWorker.addEventListener("message", (event: MessageEvent<ParserData>) => {
        const workbookData = event.data;

        // Handle the data returned from the service worker
        console.log('Data returned from service worker:', workbookData);
        // Set workbook data from parser to react state
        setParserData(workbookData);
        // Render the display component after receiving service worker message.
        setDisplayComponent(true);
    })

    return (
        <>
            <Box className="App-header" mb={2}>
                <Trans>
                    Safe Inputs PoC
                </Trans>
            </Box>
            <Container maxW="7xl" px={{ base: 5, md: 10 }} mt={8} minH="63vh">
                <ExcelUploadForm onSubmit={handleFileUpload} />
                <ExcelFileOutput parserData={parserData} shouldDisplayComponent={displayComponent} />
            </Container>

        </>
    );
};

export default ExcelParsingPage;
