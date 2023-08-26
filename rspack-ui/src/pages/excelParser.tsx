import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import ExcelUploadForm from "../components/ExcelUploadForm";

import { Trans } from "@lingui/macro";

// TODO: these components should be decoupled from excelParser.tsx

// Function to handle the data received from the service worker
const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data as { type: string; data: any };

    // Handle the data returned from the service worker
    console.log('Data returned from service worker:', data);
    // Perform further actions with the data
};

// Add a message event listener to listen for messages from the service worker
navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);


const App: React.FC = () => {
    const handleFileUpload = (file: File) => {
        console.log("file is ", file);
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'file', file });
        }
    };

    return (
        <>
            <Box className="App-header" mb={2}>
                <Trans>
                    Safe Inputs PoC
                </Trans>
            </Box>
            <ChakraProvider>
                <ExcelUploadForm onSubmit={handleFileUpload} />
            </ChakraProvider>

        </>
    );
};

export default App;
