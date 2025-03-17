import Anecdotes from "./components/Anecdotes"
import NewAnecdote from "./components/NewAnecdote"

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Anecdotes />
      <h2>Create New Anecdote</h2>
      <NewAnecdote />
    </div>
  )
}

export default App