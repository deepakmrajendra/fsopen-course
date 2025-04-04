import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    })
  }, [baseUrl])

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setResources(resources.concat(response.data))
  }

  return [resources, { create }]
}

export const useField = (type) => {
  const [value, setValue] = useState('')  

  const onChange = (event) => {
    setValue(event.target.value)
  }  

  return {
    type,
    value,
    onChange
  }
}
  

export default useResource