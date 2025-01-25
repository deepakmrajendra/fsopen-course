import {useState, useEffect} from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'

import personServices from './services/persons' 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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
        .updatePerson(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          setNewName('')
          setNewPhone('')
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
      .then(() => setPersons(persons.filter(p => p.id !== id)))
      .catch(error => {
        alert(`Person '${deletePerson.name}' was already removed from server`)
        setPersons(persons.filter(p => p.id !== id))
      })

    }

    // console.log(`After axios.put method - notes length is ${notes.length}`)

  }

  return (
    <div>
      <h2>Phonebook</h2>
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