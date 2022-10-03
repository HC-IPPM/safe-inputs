import React, { useState } from "react";


import { MinusIcon, AddIcon } from '@chakra-ui/icons'
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, Image, Link, Table, TableCaption, TableContainer, Tr, } from "@chakra-ui/react";

export default function TopHeader() {

    const [language, setLanguage] = useState("en");
    const handleLanguage = (language: React.SetStateAction<string>) => (event: any) => {
        setLanguage(language);
    };


    return (
        <>
            <Box bg='white' w='100%' color='#202020' fontSize='sm'>
                <Flex justify='flex-end' mr={30} color='blue' _hover={{ color: 'purple', textDecor: 'underline' }} >
                    {language === 'en' ? (<><Link onClick={handleLanguage('fr')} > Français</Link></>) : (<><Link onClick={handleLanguage('en')}> English</Link></>)}
                </Flex>
                <Flex justify='Center' > </Flex>

                <Accordion allowToggle  defaultIndex={[0]} fontFamily="Noto Sans" fontSize={'16'} color="#333"> 
                <AccordionItem>
    {({ isExpanded }) => (
      <>
        <h2>
          <AccordionButton>
            
            {isExpanded ? (
              <><Box flex='1' textAlign='left'>
              Show Less 
              </Box> <MinusIcon fontSize='12px' /></>
            ) : (
                <><Box flex='1' textAlign='left'>
                Show More
                </Box> <AddIcon fontSize='12px' /></>
            )}
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} > 
        <TableContainer>
              <Table variant="simple">
                <TableCaption>File properties</TableCaption>
                <Tr>
                    'Application'
                    {language === 'en' ? (<>'Application'</>) : (<> frnech</>)} 
   
                    'SheetNames'
                </Tr>
                <Tr>
                    'AppVersion'
                    'ContentStatus'
                </Tr>
                <Tr>
                    'Title'
                    'Subject'
                </Tr>
                <Tr>
                    'Author'
                    'Manager'
                </Tr>
                <Tr>
                    'Company'
                    'Category'
                </Tr>
                <Tr>
                    'Keywords'
                    'Comments'
                </Tr>
                <Tr>
                    'LastAuthor'
                    'CreatedDate'
                </Tr>
                <Tr>
                    'DocSecurity'
                    'Identifier'
                </Tr>
                <Tr>
                    'SharedDoc'
                    'Language'
                </Tr>
                <Tr>
                    'HyperlinksChanged'
                    'Version'
                </Tr>
                <Tr>
                    'LinksUpToDate'
                    'Revision'
                </Tr>
                <Tr>
                    'ScaleCrop'
                    'LastPrinted'
                </Tr>
                <Tr>
                    'Worksheets'
                    'ModifiedDate'
                </Tr>
              </Table>
            </TableContainer>
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
</Accordion>
            </Box>
        </>
    )
}

