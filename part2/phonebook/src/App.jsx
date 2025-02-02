import {useState, useEffect} from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import Notification from './components/Notification'

import personServices from './services/persons' 

// import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const hook = () => {
    // console.log('effect')
    personServices
      .getAll()
      .then(initialPersons => {
        // console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }
  
  useEffect(hook, [])

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      // If the number also matches, alert the user and exit
      if (existingPerson.number === newPhone) {
        alert(`${newName} and their phone ${newPhone} is already added to phonebook`)
        return
      }

      // If the number is different, update the person's number
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newPhone }
        personServices
        .updatePerson(updatedPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          setNewName('')
          setNewPhone('')
          setMessage(`${returnedPerson.name}'s new phone number '${returnedPerson.number}' has been updated`)
          setMessageType('notice')
          setTimeout(() => {setMessage(null)}, 5000)
        })
        .catch(error => {
          // console.log('I am inside updatePerson catch error section')
          if (error.response.status === 400) {
            // Validation error (invalid phone number)
            setMessage(error.response.data.error)
          } else if (error.response.status === 404) {
            // Person not found (already removed from server)
            setMessage(`Information of '${updatedPerson.name}' has already been removed from server`)
            // Remove person from UI since it no longer exists in the backend
            setPersons(persons.filter(person => person.id !== updatedPerson.id))
          } else {
            // Generic error message for unexpected issues
            setMessage('Something went wrong. Please try again.')
          }
          setMessageType('error')
          setTimeout(() => { setMessage(null) }, 5000)
        })

        return
      }
    }

    // If the name does not exist, add the person as usual
    const personObject = {
      name: newName, 
      number: newPhone
    }

    personServices
      .createPerson(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhone('')
        setMessage(`Added '${returnedPerson.name}' added to phonebook`)
        setMessageType('notice')
        setTimeout(() => {setMessage(null)}, 5000)
      })
      .catch(error => {
        setMessage(`${error.response.data.error}`)
        setMessageType('error')
        setTimeout(() => {setMessage(null)}, 5000)
      })
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    // console.log(event.target.value)
    setNewPhone(event.target.value)
  }

  const handleSearchChange = (event) => {
    // console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

  const deletePersonOf = id => {

    const deletePerson = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${deletePerson.name}?`)) {

      personServices
      .deletePerson(id)
      .then(returnedPerson => {
        setPersons(persons.filter(p => p.id !== id))
        setMessage(`'${returnedPerson.name}' deleted from phonebook`)
        setMessageType('notice')
        setTimeout(() => {setMessage(null)}, 5000)
      })
      .catch(error => {
        // console.log('I am inside deletePerson catch error')
        // alert(`Person '${deletePerson.name}' was already removed from server`)
        setMessage(`Information of '${deletePerson.name}' has already been removed from server`)
        setMessageType('error')
        setTimeout(() => {setMessage(null)}, 5000)
        setPersons(persons.filter(p => p.id !== id))
      })

    }

    // console.log(`After axios.put method - notes length is ${notes.length}`)

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <h3>Numbers</h3>
      <div>
        {filteredPersons.map(person => 
          <Person
            key={person.id} 
            person={person}
            deletePerson={() => deletePersonOf(person.id)}
          />
        )}
      </div>
    </div>
  )
}

export default App