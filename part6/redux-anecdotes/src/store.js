// import { createStore, combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

// const rootReducer = combineReducers({
//   anecdotes: anecdoteReducer,
//   filter: filterReducer
// })

// const store = createStore(rootReducer)

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store