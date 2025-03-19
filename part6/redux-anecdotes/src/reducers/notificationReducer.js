import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

// Action creator to handle auto-clear after 5 seconds
export const showNotification = (message, duration = 5000) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, duration)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer