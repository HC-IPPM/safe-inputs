import React, { useRef, useState, useEffect } from 'react'

import {
  Button,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
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
} from '@chakra-ui/react'
import { FcDataSheet } from 'react-icons/fc'
import { FullProperties } from 'xlsx'

import TopHeader from './components/header'
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

  return (
    
    <div className="App">
      <TopHeader />
      <header className="App-header">
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
              placeholder="Choose a spreadsheet to analyze"
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
          Analyze
        </Button>
        <br />
        <br />
        {parserStatus && parserStatus.state === 'LOADING' && <Spinner />}
        {parserStatus && parserStatus.state === 'DONE' && p && (
          <div>
            <TableContainer>
              <Table variant="simple">
                <TableCaption>File properties</TableCaption>
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
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="show-preview" mb="0">
                Show preview?
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
