import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import ExcelUploadForm from "../components/ExcelUploadForm";

import { Trans } from "@lingui/macro";


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
