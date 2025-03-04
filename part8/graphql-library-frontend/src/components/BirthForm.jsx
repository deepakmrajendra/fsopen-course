import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { EDIT_BIRTH, ALL_AUTHORS } from '../queries'

const BirthForm = ({ authors }) => {

    const [selectedAuthor, setSelectedAuthor] = useState(null)
    const [born, setborn] = useState('')

    const [ changeBirth ] = useMutation(EDIT_BIRTH, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })
    
    const submit = (event) => {
      event.preventDefault()

      if (!selectedAuthor) return

      changeBirth({ variables: { name: selectedAuthor.value, setBornTo: Number(born) } })

      setSelectedAuthor(null)
      setborn('')
    }

    const authorOptions = authors.map(author => ({
      value: author.name,
      label: author.name
    }))

    return (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              <Select
                value={selectedAuthor}
                onChange={setSelectedAuthor}
                options={authorOptions}
                placeholder="Select author"
              />
            </div>
            <div>
              born <input
                type="number"
                value={born}
                onChange={({ target }) => setborn(target.value)}
              />
            </div>
            <button type='submit' disabled={!selectedAuthor || !born}>update author</button>
          </form>
        </div>
    )

}

export default BirthForm