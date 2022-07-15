import App from '../App.js'
import { MockedProvider } from '@apollo/client/testing'
import { screen, render } from '@testing-library/react'
import { SAY_HELLO } from '../graphql.js'

describe('<App/>', () => {
  it('displays a hello world message using data from the api', async () => {
    const mocks = [
      {
        request: {
          query: SAY_HELLO,
        },
        result: {
          data: {
            hello: 'world',
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>,
    )

    const items = await screen.findAllByText(/world/)
    expect(items).toHaveLength(1)
  })

})
