const PersonForm = ({addPerson, newName, handleNameChange, newPhone, handlePhoneChange}) => {
    // console.log('Inside Form component', addPerson)
    // console.log('Inside Form component', newName)
    // console.log('Inside Form component', handleNameChange)
    // console.log('Inside Form component', newPhone)
    // console.log('Inside Form component', handlePhoneChange)

    return (
        <form onSubmit={addPerson}> 
            <div>
                <label htmlFor="name">name:</label>
                <input
                    id="name"
                    name="name"
                    value={newName}
                    onChange={handleNameChange}
                    autoComplete="name" // Add the autocomplete attribute
                />
            </div>
            <div>
                <label htmlFor="number">number:</label>
                <input
                    id="number"
                    name="number"
                    value={newPhone}
                    onChange={handlePhoneChange}
                    autoComplete="tel" // Add the autocomplete attribute
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm