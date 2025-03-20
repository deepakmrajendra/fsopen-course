import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { NotificationProvider } from './contexts/NotificationContext'
import useNotification from './hooks/useNotification'

const App = () => {

  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const updateAnecdoteMutation = useMutation({ 
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => 
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      ))
      dispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote '${updatedAnecdote.content}' voted` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
  })

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updateAnecdoteMutation.mutate(updatedAnecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1, // Optional: Retry only once
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div style={{ color: 'red', fontSize: '24px', padding: '20px' }}>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
