import React from "react";


import { Box, Center, HStack, Image, Text } from "@chakra-ui/react";

export default function TopHeader(){

    const logo_en = require('./gov_gouv_en.png')
    const logo_fr = require('./gov_gouv_fr.png')
   

    return(
        <>
        
        <Box bg='white' w='100%'  color='#202020'>
<Center>
   <Image src={logo_en} alt={'government_canada_logo_en'}  h={'35px'} m={1} />
</Center>

        </Box>
        
        </>
    )
}