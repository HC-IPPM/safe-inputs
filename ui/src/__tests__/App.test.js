import { screen, render } from '@testing-library/react'

import App from '../App'
// import { MockedProvider } from '@apollo/client/testing'
// import { SAY_HELLO } from '../graphql'

const parseWorker = {
  addEventListener: () => {},
  removeEventListener: () => {},
}

describe('<App/>', () => {
  it('displays the application title', async () => {
    // const mocks = [
    //   {
    //     request: {
    //       query: SAY_HELLO,
    //     },
    //     result: {
    //       data: {
    //         hello: 'world',
    //       },
    //     },
    //   },
    // ]

    render(
      // <MockedProvider mocks={mocks} addTypename={false}>
      <App parseWorker={parseWorker} />,
      // </MockedProvider>,
    )

    const items = await screen.findAllByText(/Safe inputs PoC/)
    expect(items).toHaveLength(1)
  })
})
