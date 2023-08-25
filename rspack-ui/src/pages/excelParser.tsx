import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import ExcelUploadForm from "../components/ExcelUploadForm";

import { Trans } from "@lingui/macro";


const App: React.FC = () => {
    const handleFileUpload = (file: File) => {
        // Handle the file upload logic here
        console.log("File uploaded:", file);
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
