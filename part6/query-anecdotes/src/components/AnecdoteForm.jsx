import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import useNotification from '../hooks/useNotification'

const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      dispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote '${newAnecdote.content}' added` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: `Error: ${error.response?.data?.error || 'Failed to add anecdote'}` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
