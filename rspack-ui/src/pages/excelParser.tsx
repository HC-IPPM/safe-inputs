import React from 'react'

import { Box } from "@chakra-ui/react"
import InputForm from '../components/InputForm'

function ExcelParsingPage() {
    return (
        <>
            <Box className="App-header" mb={2}>
                Safe inputs PoC
            </Box>
            <InputForm />
        </>
    )
}

export default ExcelParsingPage