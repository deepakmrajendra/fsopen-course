import Anecdotes from "./components/Anecdotes"
import NewAnecdote from "./components/NewAnecdote"
import Filter from "./components/Filter"
import Notification from "./components/Notification"

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <h2>Create New Anecdote</h2>
      <NewAnecdote />
    </div>
  )
}

export default App