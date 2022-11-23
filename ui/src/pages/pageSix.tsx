import React, { useRef, useState, useEffect } from 'react'

import { gql, useMutation } from '@apollo/client'
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  FormErrorMessage,
  Icon,
  Spinner,
  Table,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Switch,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  InputLeftElement,
  InputRightElement,
  Tooltip,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FcDataSheet, FcMinus, FcPlus } from 'react-icons/fc'
import { FullProperties } from 'xlsx'

import { ParseWorker } from '../serviceWorker'
import { ParseEvent } from '../worker'
import '../App.css'
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

export default function PageFive({
  parseWorker,
}: {
  parseWorker: ParseWorker
}) {
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
    setParserStatus(undefined)
    setPreview(false)
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

  const { t } = useTranslation()


  //
  // Function for the API call -> useMutation
  //
  function GQL() {
    const Get_Data = gql`
      mutation verifyJsonFormat($testSheet: JSON!) {
        verifyJsonFormat(sheetData: $testSheet)
      }
    `
    const [mutation, { loading, error, data }] = useMutation(Get_Data)
    const testSheet = parserStatus
    // const sheetPreview = {parserStatus.sheets}
    //  const testSheet = (data.verifyJsonFormat) //does not work, breaks page
    // const testSheet = preview
    // const testSheet = filename 
    useEffect(() => {
      mutation({ variables: { testSheet } })
    }, [mutation, testSheet])

    if (data)
      return (
        <>
          {/* Uncomment to view the data */}
          {/* <pre>{JSON.stringify(data.verifyJsonFormat, null, 2)} </pre> */}

        </>
      )

      if (loading) return <> {'Submitting...'}</>
      if (error) return <> {`Submission error! ${error.message}`}</>
    else return <></>
  }

  return (
    <>
      <Box className="App">
        <Box className="App-header" mb={2}>
          Safe inputs PoC
        </Box>
        <Box className="pageMarginSetting" id="pageMarginSetting" mt={8}>
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
                placeholder={t('safeInputs.inputBar')}
                onClick={() =>
                  inFile && inFile.current && inFile.current.click()
                }
                readOnly
                value={filename}
              />
              <InputRightElement w="auto"></InputRightElement>
            </InputGroup>
            <FormErrorMessage>{invalid}</FormErrorMessage>
          </FormControl>
          <br />

          {file === null ? (
            <Tooltip
              hasArrow
              label={t('safeInputs.inputBar')}
              aria-label="A tooltip"
            >
              <Button
                cursor={'not-allowed'}
                color="#FFFFFF"
                bg="#3232FF"
                _hover={{ bg: '#1616FF99' }}
                as="button"
              >
                {t('safeInputs.upload')}
              </Button>
            </Tooltip>
          ) : (
            <Button
              bg="#3232FF"
              color="#FFFFFF"
              _hover={{ bg: '#0000DD' }}
              onClick={() => {
                file && parseWorker.parse(file)
                console.log('')
              }}
            >
              {t('safeInputs.upload')}
            </Button>
          )}

          {parserStatus && parserStatus.state === 'LOADING' && <Spinner />}
          {parserStatus && parserStatus.state === 'DONE' && p && (
            <Box>
              <br />
              <Accordion
                allowToggle
                defaultIndex={[0]}
                fontFamily="Noto Sans"
                fontSize={'16'}
                color="#333"
              >
                <AccordionItem>
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton>
                          {isExpanded ? (
                            <>
                              <Box flex="1" textAlign="left">
                                {t('safeInputs.showLess')}
                              </Box>{' '}
                              <FcMinus fontSize="12px" />
                            </>
                          ) : (
                            <>
                              <Box flex="1" textAlign="left">
                                {t('safeInputs.showMore')}
                              </Box>{' '}
                              <FcPlus fontSize="12px" />
                            </>
                          )}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <TableContainer>
                          <Table variant="simple">
                            <TableCaption>
                              {t('safeInputs.fileProps')}{' '}
                            </TableCaption>
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
              <br />
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="show-preview" mb="0">
                  {t('safeInputs.preview')}
                </FormLabel>

                <Switch
                  id="show-preview"
                  isChecked={preview}
                  onChange={(e) => setPreview(e.target.checked)}
                />
              </FormControl>
              {preview === true ? (
                <>
                  {' '}
                  <Box h="510px" overflowY={'auto'}>
                    {' '}
                    {preview && (
                      <DeferredRender idleTimeout={1000}>
                        <pre className="docPreview">
                          {JSON.stringify(parserStatus.sheets, null, 2)}
                        </pre>
                      </DeferredRender>
                    )}{' '}
                  </Box>{' '}
                </>
              ) : (
                <></>
              )}

              <Box h="315px" overflowY={'auto'}>
                <br />
                <GQL />
                <br />
              </Box>
              <br />
              <br />
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
