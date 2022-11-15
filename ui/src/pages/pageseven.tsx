/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Box, Button } from '@chakra-ui/react'

export default function PageSeven() {
  //   const Get_Hello = gql` query { hello } `
  //   const { data } = useQuery(Get_Hello)
  //   const [testSheetVar, setTestSheetVar] = useState('')

  //   const TestSheet = 'data'
  //   const ParserJsonConst = TestSheet

  // const [mutation, { loading, error, data }] = useMutation(Get_Data)
  const Get_Data = gql`
    {
      hello
    }
  `

  const [testSheetVar, setTestSheetVar] = useState('not set')

  const TestSheet = 'set'
  const ParserJsonConst = TestSheet
  // const [mutation, { loading, error, data }] = useMutation(Get_Data)
  const { loading, error, data } = useQuery(Get_Data)

  

  // useEffect(() => {
  //   mutation({ variables: { testSheet } })
  // }, [mutation]);

  return (
    <>
      <Box className="App">
        <br />
        <p className="App-header">PAGE Seven </p>
        <br />
        <br />
        <Box>
          {/* {data ? (<> <pre>
        {JSON.stringify(data.verifyJsonFormat, null, 2)}
      </pre>
      </>) : null} */}

          <Button onClick={() => setTestSheetVar(ParserJsonConst)}>{ParserJsonConst}</Button>

          {data !== null ? <></> : <>1</>}
          <br />
        </Box>
      </Box>
    </>
  )
}
