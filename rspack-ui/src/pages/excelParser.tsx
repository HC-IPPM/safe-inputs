import React, { useState } from "react";
import { ChakraProvider, Box, Table } from "@chakra-ui/react";
import ExcelUploadForm from "../components/ExcelUploadForm";

import TableOutput from "../components/TableOutput";

import { Trans } from "@lingui/macro";

const App: React.FC = () => {
    const handleFileUpload = (file: File) => {
        console.log("file is ", file);
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'file', file });
        }
    };

    // TODO: these components should maybe be decoupled from excelParser.tsx
    const [displayComponent, setDisplayComponent] = useState(false);
    // Function to handle the data received from the service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
        const workbook = event.data.workbook;
        const sheets = event.data.sheets;

        // Handle the data returned from the service worker
        console.log('Data returned from service worker:', workbook);
        // render the display component after receiving service worker message.
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
            <ChakraProvider>
                <ExcelUploadForm onSubmit={handleFileUpload} />
                <TableOutput shouldDisplayComponent={displayComponent} />
            </ChakraProvider>

        </>
    );
};

export default App;
