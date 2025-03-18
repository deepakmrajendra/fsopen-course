import { useState } from 'react'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

//   return {
//     type,
//     value,
//     onChange,
//     reset
//   }

  return {
    inputProps: { type, value, onChange },  // Separate valid input attributes
    reset,                                  // Reset remains separate
  }
}

export default useField