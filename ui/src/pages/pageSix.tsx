import React, { useRef, useState, useEffect } from 'react'

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import { Box, Button, Input, FormControl, FormLabel, InputGroup, FormErrorMessage, Icon, Spinner, Table, Tr, Th, Td, TableCaption, TableContainer, Switch, Accordion, AccordionButton, AccordionItem, AccordionPanel, InputLeftElement, InputRightElement, } from '@chakra-ui/react'
import { useTranslation } from "react-i18next";
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

export default function PageFive({ parseWorker }: { parseWorker: ParseWorker }) {
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


  const { t } = useTranslation()
  function Parser() {

    return (
      <>
        <Box className="pageMarginSetting" id='pageMarginSetting' mt={8}>
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
                onClick={() => inFile && inFile.current && inFile.current.click()}
                readOnly
                value={filename}
              />
              <InputRightElement w='auto'>
                <Button
                  disabled={file === null || (parserStatus && parserStatus.state === 'LOADING')} onClick={() => file && parseWorker.parse(file)}>
                  {t('safeInputs.analyze')}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{invalid}</FormErrorMessage>
          </FormControl>
          <br />

export default function PageSix() {
    const [ mutation , { loading, error, data }] = useMutation(Get_Data)

    useEffect(() => {
        mutation({ variables: {testSheet}}) 
    },[mutation]);

    return (
        <>
            <Box className="App" >
            <br />
                <p className="App-header">PAGE SIX </p>
                <br />
                <br />
                
                {data ? (<> <pre> 
                    {JSON.stringify(data.verifyJsonFormat, null ,2)}                 
                    </pre> 
                    </>) : null}
                <br />

            </Box >
        </>
    )
}




