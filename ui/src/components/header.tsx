import React from "react";


import { Box, Center, Image } from "@chakra-ui/react";

export default function TopHeader(){

   
    return(
        <>
        
        <Box bg='white' w='100%'  color='#202020'>
<Center>
   <Image src={require('./government_canada_logo_en.png')}  w='15%' />
</Center>

        </Box>
        
        </>
    )
}