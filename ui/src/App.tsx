import React, { useRef, useState, useEffect } from 'react'

import { MinusIcon, AddIcon } from '@chakra-ui/icons'
import { Image, Box, Flex, Button, Input, FormControl, FormLabel, InputGroup, InputLeftElement, FormErrorMessage, Icon, Spinner, Table, Tr, Th, Td, TableCaption, TableContainer, Switch, Accordion, Link, AccordionButton, AccordionItem, AccordionPanel, } from '@chakra-ui/react'
import { FcDataSheet } from 'react-icons/fc'
import { FullProperties } from 'xlsx'


import { ParseWorker } from './serviceWorker'
import { ParseEvent } from './worker'
import './App.css'
// import { useQuery } from '@apollo/client'
// import { SAY_HELLO } from './graphql.js'

function DeferredRender({
  children,
  idleTimeout,
}: {
  children: JSX.Element
  idleTimeout: number
}) {
  const [render, setRender] = React.useState(false)

  React.useEffect(() => {
    if (render) setRender(false)
    const id = requestIdleCallback(() => setRender(true), {
      timeout: idleTimeout,
    })

    return () => cancelIdleCallback(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleTimeout])

  if (!render) return <Spinner />

  return children
}

const dateToStr = (d: Date | undefined) => {
  if (!d) return 'N/A'
  return `${d.toLocaleDateString(navigator.language)} - ${d.toLocaleTimeString(
    navigator.language,
  )}`
}

const getColVal = (properties: FullProperties, prop: keyof FullProperties) => {
  const d = properties[prop]
  if (prop === 'LastPrinted' && d && typeof d === 'string')
    return dateToStr(new Date(d))
  if (prop === 'CreatedDate' || prop === 'ModifiedDate')
    return dateToStr(properties[prop])
  return properties[prop] || 'N/A'
}

const col = (
  properties: FullProperties,
  prop: keyof FullProperties,
  title?: string,
) => {
  const v = getColVal(properties, prop)
  return (
    <>
      <Th>{title || prop}</Th>
      <Td>{v}</Td>
    </>
  )
}

function App({ parseWorker }: { parseWorker: ParseWorker }) {
  // const { loading, error, data } = useQuery(SAY_HELLO)

  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Oh no... {error.message}</p>

  const inFile = useRef<HTMLInputElement>(null)
  const [filename, setFilename] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [parserStatus, setParserStatus] = useState<ParseEvent>()
  const [preview, setPreview] = useState(false)

  const handleMessages = (msg: any) => {
    if (typeof msg.data === 'object' && msg.data.type === 'ParseEvent') {
      setParserStatus(msg.data)
    }
  }
  useEffect(() => {
    parseWorker.addEventListener('message', handleMessages)

    return () => {
      parseWorker.removeEventListener('message', handleMessages)
    }
  }, [parseWorker])

  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParserStatus(undefined);
    setPreview(false);
    if (e.target.files && e.target.files.length === 1) {
      setFile(e.target.files[0])
      setFilename(e.target.files[0].name)
    } else {
      setFile(null)
      setFilename('')
    }
  }

  const invalid = false

  const p =
    (parserStatus &&
      parserStatus.state === 'DONE' &&
      parserStatus.workbook.Props) ||
    undefined


  const [language, setLanguage] = useState("en");
  const handleLanguage = (language: React.SetStateAction<string>) => (event: any) => {
    setLanguage(language);
  };

  const LangEn = {
    analyze: "Analyze",
    file_props: "File Properties",
    image: require('./components/gov_gouv_en.png'),
    input_bar: "Choose a spreadsheet to analyze",
    preview: "Show Preview",
    safe_input_poc: "Safe Inputs PoC",
    show_less: "Show Less",
    show_more: "Show More",

    Application: "Application ",
    AppVersion: "AppVersion ",
    Author: "Author",
    Category: "Category",
    Comments: "Comments ",
    Company: "Company ",
    ContentStatus: "ContentStatus ",
    CreatedDate: "CreatedDate ",
    DocSecurity: "DocSecurity ",
    HyperlinksChanged: "HyperlinksChanged ",
    Identifier: "Identifier ",
    Keywords: "Keywords ",
    Language: "Language ",
    LastAuthor: "LastAuthor ",
    LastPrinted: "LastPrinted ",
    LinksUpToDate: "LinksUpToDate ",
    Manager: "Manager ",
    ModifiedDate: "ModifiedDate ",
    Revision: "Revision ",
    ScaleCrop: "ScaleCrop ",
    SharedDoc: "SharedDoc ",
    SheetNames: "SheetNames ",
    Subject: "Subject ",
    Title: "Title ",
    Version: "Version ",
    Worksheets: "Worksheets ",
  }
  // {language === 'en' ? (`${LangEn.<Vairable here>}`):(`${LangFr.<Vairable here>}`)}
  const LangFr = {
    analyze: "Analyser",
    file_props: "Propriétés du fichier",
    image: require('./components/gov_gouv_fr.png'),
    input_bar: "Choisissez une feuille de calcul à analyser",
    preview: "Prévisualisation",
    safe_input_poc: "Entrées Sécurisées PoC",
    show_less: "Afficher moins",
    show_more: "Afficher plus",

    Application: "Application",
    AppVersion: "VersionD'Application ",
    Author: "Auteur",
    Category: "Catégorie",
    Comments: "Commentaires",
    Company: "Entreprise",
    ContentStatus: "ÉtatDuContenu ",
    CreatedDate: "DateCréée",
    DocSecurity: "SécuritéDesDocuments",
    HyperlinksChanged: "ModificationDesHyperliens",
    Identifier: "Identifiant",
    Keywords: "Mots-clés ",
    Language: "Langue",
    LastAuthor: "DernierAuteur",
    LastPrinted: "DernierImprimé",
    LinksUpToDate: "LiensÀJour ",
    Manager: "Directeur",
    ModifiedDate: "DateDeModification",
    Revision: "Revision",
    ScaleCrop: "ScaleCrop",
    SharedDoc: "DocPartagé",
    SheetNames: "NomsDesFeuilles",
    Subject: "Sujet",
    Title: "Titre",
    Version: "Version",
    Worksheets: "FeuillesDeTravail",
  }

  return (
    <div className="App">
      <Box bg='white' w='100%' color='#202020' fontSize='sm'>
        <Flex justify='flex-end' mr={30} color='blue' _hover={{ color: 'purple', textDecor: 'underline' }} >
          {language === 'en' ? (<><Link onClick={handleLanguage('fr')} > Français</Link></>) : (<><Link onClick={handleLanguage('en')}> English</Link></>)}
        </Flex>
        <Flex justify='Center' >
          {language === 'en' ? (<><Image src={LangEn.image} alt={'government_canada_logo_en'} h={'35px'} m={1} /></>) : (<><Image src={LangFr.image} alt={'government_canada_logo_fr'} h={'35px'} m={1} /></>)}
        </Flex>
      </Box>

      <header className="App-header">
        {/* {language === 'en' ? (`${LangEn.safe_input_poc}`):(`${LangFr.safe_input_poc}`) } */}
        <p>Safe inputs PoC</p>
      </header>

      <main>
        <FormControl
          isInvalid={Boolean(invalid)}
          isRequired={false}
          isDisabled={parserStatus && parserStatus.state === 'LOADING'}
        >
          <FormLabel htmlFor="writeUpFile"></FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={FcDataSheet} />}
            />
            <input
              type="file"
              ref={inFile}
              onChange={onFileChanged}
              accept="
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
application/vnd.ms-excel,
.xlsb,
.ods
"
              style={{ display: 'none' }}
            />
            <Input
              placeholder={language === 'en' ? (`${LangEn.input_bar}`) : (`${LangFr.input_bar}`)}
              onClick={() => inFile && inFile.current && inFile.current.click()}
              readOnly
              value={filename}
            />
          </InputGroup>
          <FormErrorMessage>{invalid}</FormErrorMessage>
        </FormControl>
        <br />
        <br />
        <Button
          disabled={
            file === null || (parserStatus && parserStatus.state === 'LOADING')
          }
          onClick={() => file && parseWorker.parse(file)}
        >
          {language === 'en' ? (`${LangEn.analyze}`) : (`${LangFr.analyze}`)}
        </Button>
        <br />
        <br />
        {parserStatus && parserStatus.state === 'LOADING' && <Spinner />}
        {parserStatus && parserStatus.state === 'DONE' && p && (
          <div>
            <Accordion allowToggle defaultIndex={[0]} fontFamily="Noto Sans" fontSize={'16'} color="#333">
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton>
                        {isExpanded ? (<><Box flex='1' textAlign='left'>{language === 'en' ? (`${LangEn.show_less}`) : (`${LangFr.show_less}`)}</Box> <MinusIcon fontSize='12px' /></>) : (<><Box flex='1' textAlign='left'>{language === 'en' ? (`${LangEn.show_more}`) : (`${LangFr.show_more}`)}</Box> <AddIcon fontSize='12px' /></>)}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} >
                      <TableContainer>
                        <Table variant="simple">
                          <TableCaption>{language === 'en' ? (`${LangEn.show_less}`) : (`${LangFr.show_less}`)}</TableCaption>
                          <Tr>
                            {col(p, 'Application')}
                            {col(p, 'SheetNames')}
                          </Tr>
                          <Tr>
                            {col(p, 'AppVersion')}
                            {col(p, 'ContentStatus')}
                          </Tr>
                          <Tr>
                            {col(p, 'Title')}
                            {col(p, 'Subject')}
                          </Tr>
                          <Tr>
                            {col(p, 'Author')}
                            {col(p, 'Manager')}
                          </Tr>
                          <Tr>
                            {col(p, 'Company')}
                            {col(p, 'Category')}
                          </Tr>
                          <Tr>
                            {col(p, 'Keywords')}
                            {col(p, 'Comments')}
                          </Tr>
                          <Tr>
                            {col(p, 'LastAuthor')}
                            {col(p, 'CreatedDate')}
                          </Tr>
                          <Tr>
                            {col(p, 'DocSecurity')}
                            {col(p, 'Identifier')}
                          </Tr>
                          <Tr>
                            {col(p, 'SharedDoc')}
                            {col(p, 'Language')}
                          </Tr>
                          <Tr>
                            {col(p, 'HyperlinksChanged')}
                            {col(p, 'Version')}
                          </Tr>
                          <Tr>
                            {col(p, 'LinksUpToDate')}
                            {col(p, 'Revision')}
                          </Tr>
                          <Tr>
                            {col(p, 'ScaleCrop')}
                            {col(p, 'LastPrinted')}
                          </Tr>
                          <Tr>
                            {col(p, 'Worksheets')}
                            {col(p, 'ModifiedDate')}
                          </Tr>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Accordion>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="show-preview" mb="0">
                {language === 'en' ? (`${LangEn.preview}`) : (`${LangFr.preview}`)} ?
              </FormLabel>
              <Switch
                id="show-preview"
                isChecked={preview}
                onChange={(e) => setPreview(e.target.checked)}
              />
            </FormControl>
            {preview && (
              <DeferredRender idleTimeout={1000}>
                <pre className="docPreview">
                  {JSON.stringify(parserStatus.sheets, null, 2)}
                </pre>
              </DeferredRender>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App


