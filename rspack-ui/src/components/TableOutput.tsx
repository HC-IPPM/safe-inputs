import React from "react";

import { ChakraProvider, Box } from "@chakra-ui/react";

interface MyComponentProps {
    shouldDisplayComponent: boolean;
}


const TableOutput: React.FC<MyComponentProps> = ({ shouldDisplayComponent }) => {
    return (
        <div>
            {shouldDisplayComponent && <Box>This is the Chakra UI component</Box>}
        </div>
    );
};

export default TableOutput;
