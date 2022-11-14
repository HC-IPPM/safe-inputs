/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'

import { gql, useQuery } from '@apollo/client'
import { Box, Button } from '@chakra-ui/react'

export default function PageSeven() {
//   const Get_Hello = gql`
//     query {
//       hello
//     }
//   `
//   const { data } = useQuery(Get_Hello)
//   const [testSheetVar, setTestSheetVar] = useState('')

//   const TestSheet = 'data'
//   const ParserJsonConst = TestSheet

const testSheet = [
{
    "A": "id", "B": "q1", "C": "q2", "D": "q3", "E": "q4", "F": "q5", "G": "q6"
  },
  {
    "A": 124, "B": "r", "C": 1, "D": 67, "E": "a", "F": 3, "G": "free form answer"
  },
];


// const [mutation, { loading, error, data }] = useMutation(Get_Data)
const Get_Hello = gql`{ hello }`
const { loading, error, data } = useQuery(Get_Hello)

// useEffect(() => {
//   mutation({ variables: { testSheet } })
// }, [mutation]);

return (
  <>
    <Box className="App" >
      <br />
      <p className="App-header">PAGE SIX </p>
      <br />
      <br />
<Box>
      {/* {data ? (<> <pre>
        {JSON.stringify(data.verifyJsonFormat, null, 2)}
      </pre>
      </>) : null} */}
{JSON.stringify(data.hello, null, 2)}
      {data ? (<> 
      </>) : (<>1</>)}
      <br /></Box>

    </Box >
  </>
)
}