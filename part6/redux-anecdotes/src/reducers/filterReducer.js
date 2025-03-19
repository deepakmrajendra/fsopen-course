import { createSlice } from '@reduxjs/toolkit'

// const initialState = ''

// export const setFilter = (filter) => {
//   return {
//     type: 'SET_FILTER',
//     payload: filter,
//   }
// }

// const filterReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    }
  }
})

// export default filterReducer

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer