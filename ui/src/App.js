import './App.css'
import { useQuery } from '@apollo/client'
import { SAY_HELLO } from './graphql.js'

function App() {
  const { loading, error, data } = useQuery(SAY_HELLO)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <div className="App">
      <header className="App-header">
        <p>Safe inputs PoC</p>
      </header>
      <main>
				<p>Hello: {data.hello}</p>
      </main>
    </div>
  )
}

export default App
