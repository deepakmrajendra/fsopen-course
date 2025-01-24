const Filter = ({searchTerm, handleSearchChange}) => {
    // console.log('Inside Search component', searchTerm)
    // console.log('Inside Search component', handleSearchChange)

    return (
        <div>
            filter shown with <input
                                id="search"
                                name="search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
        </div>
    )
}

export default Filter