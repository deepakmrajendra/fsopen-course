import { createSlice } from '@reduxjs/toolkit'

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => Number((100000 * Math.random()).toFixed(0))

// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

// export const vote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: { id }
//   }
// }

// // Helper function to sort anecdotes by votes (descending order)
// const sortByVotes = (anecdotes) => {
//   return anecdotes.slice().sort((a, b) => b.votes - a.votes)
// }

// // const initialState = anecdotesAtStart.map(content => ({
// //   content,
// //   id: getId(),
// //   votes: 0
// // }))

// const initialState = {
//   anecdotes: anecdotesAtStart.map(content => ({
//     id: getId(),
//     content,
//     votes: 0
//   }))
// }

// const initialState = anecdotesAtStart.map(content => ({
//   id: getId(),
//   content,
//   votes: 0
// }))

// const anecdoteReducer = (state = initialState, action) => {
//   switch(action.type) {
//     case 'NEW_ANECDOTE': {
//       // // // return [ ...state, action.payload ]
//       // // return { ...state, anecdotes: [...state.anecdotes, action.payload] }
//       // const updatedAnecdotes = [...state.anecdotes, action.payload]
//       // return { ...state, anecdotes: sortByVotes(updatedAnecdotes) }
//       const updatedAnecdotes = [...state, action.payload]
//       return sortByVotes(updatedAnecdotes)
//     }
//     case 'VOTE': {
//       const id = action.payload.id
//       // // // return state.map(anecdote => anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote)
//       // // return { ...state, anecdotes: state.anecdotes.map(anecdote => anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 }) }
//       // const updatedAnecdotes = state.anecdotes.map(anecdote => anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 })
//       // return { ...state, anecdotes: sortByVotes(updatedAnecdotes) }
//       const updatedAnecdotes = state.map(anecdote => anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 })
//       return sortByVotes(updatedAnecdotes)
//     }
//     default:
//       return state
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: anecdotesAtStart.map(content => ({
    id: getId(),
    content,
    votes: 0
  })),
  reducers: {
    createAnecdote(state, action) {
      const newAnecdote = {
        content: action.payload,
        id: getId(),
        votes: 0
      }
      state.push(newAnecdote)
      // return [...state].sort((a, b) => b.votes - a.votes) // Ensure sorting with a copy
      state.sort((a, b) => b.votes - a.votes) // Mutate state directly, don't return a new array
    },
    vote(state, action) {
      const id = action.payload
      const anecdote = state.find(a => a.id === id)
      if (anecdote) {
        anecdote.votes += 1
      }
      // return [...state].sort((a, b) => b.votes - a.votes) // Ensure sorting with a copy
      state.sort((a, b) => b.votes - a.votes) // Mutate state directly
    }
  }
})

// export default anecdoteReducer
export const { createAnecdote, vote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
