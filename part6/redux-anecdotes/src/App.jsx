import { useEffect } from 'react'
import Anecdotes from "./components/Anecdotes"
import NewAnecdote from "./components/NewAnecdote"
import Filter from "./components/Filter"
import Notification from "./components/Notification"
// import anecdoteService from './services/anecdotes'
// import { setAnecdotes } from './reducers/anecdoteReducer'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {

  const dispatch = useDispatch()
  // useEffect(() => {
  //   anecdoteService
  //     .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  // }, [dispatch])
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

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