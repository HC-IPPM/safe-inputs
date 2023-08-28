import React, { useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import ExcelUploadForm from "../components/ExcelUploadForm";

import TableOutput from "../components/TableOutput";

import { Trans } from "@lingui/macro";

interface WorkBook {
    sheets: object | null;
}

const ExcelParsingPage: React.FC = () => {

    const handleFileUpload = (file: File) => {
        console.log("file is ", file);
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'file', file });
        }
    };

    // TODO: these components should maybe be decoupled from excelParser.tsx
    const [displayComponent, setDisplayComponent] = useState(false);
    const [parserData, setParserData] = useState<WorkBook | null>(null);

    // Function to handle the data received from the service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
        const workbookData = event.data;

        // Handle the data returned from the service worker
        console.log('Data returned from service worker:', workbookData);
        // Set workbook data from parser to react state
        setParserData(workbookData);
        // Render the display component after receiving service worker message.
        setDisplayComponent(true);
    };

    // Add a message event listener to listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);




    return (
        <>
            <Box className="App-header" mb={2}>
                <Trans>
                    Safe Inputs PoC
                </Trans>
            </Box>
            <Container>
                <ExcelUploadForm onSubmit={handleFileUpload} />
                <TableOutput parserData={parserData} shouldDisplayComponent={displayComponent} />
            </Container>

        </>
    );
};

export default ExcelParsingPage;
