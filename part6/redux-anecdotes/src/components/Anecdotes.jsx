import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  // const anecdotes = useSelector(state => state)
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  // Handle cases where state is undefined
  if (!anecdotes) return null 

  // Filter anecdotes based on filter input (case-insensitive)
  const filteredAnecdotes = anecdotes
    .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      {filteredAnecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(vote(anecdote.id))
            dispatch(showNotification(`You voted '${anecdote.content}'`, 5000))
          }}
        />
      ))}
    </div>
  )
}

export default Anecdotes