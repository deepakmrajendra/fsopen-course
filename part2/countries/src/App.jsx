import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'
import CountryWeather from './components/CountryWeather'

import countryServices from './services/countries' 

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryDetails, setCountryDetails] = useState(null)
  const [weatherDetails, setWeatherDetails] = useState(null)

  // Fetch all countries when the app mounts
  useEffect(() => {
    // console.log('effect run to fetch all country names using getAllCountries')
    countryServices
      .getAllCountries()
      .then(returnedCountries => {
        // console.log('Inside the getAllCountries event handler')
        setAllCountries(returnedCountries)
      })
      .catch(error => console.log('Error fetching initial all countries:', error))
  }, [])

  // console.log(`First render of the App component - length of allCountries is ${allCountries.length}`)

  // Filter countries whenever searchTerm or allCountries changes
  useEffect(() => {
    const results = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCountries(results)

    if (results.length === 1) {
      setSelectedCountry(results[0]) // Automatically set selectedCountry if only one result exists
      // console.log('I am here', selectedCountry)
    } else {
      setSelectedCountry(null) // Reset selectedCountry if multiple results or no match
      setCountryDetails(null) // Clear country details
      setWeatherDetails(null) // Clear weather details
    }
  }, [searchTerm, allCountries])

  // Fetch country details when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      countryServices
        .getCountryDetails(selectedCountry.name.common)
        .then(details => {
          setCountryDetails(details)
          // console.log('Country details fetched:', details)
          if (details.capital) {
            // Fetch weather details for the capital city
            countryServices
              .getWeatherDetails(details.capital)
              .then(weather => setWeatherDetails(weather))
              .catch(error => console.error('Error fetching weather details:', error))
          }
        })
        .catch(error => console.error('Error fetching country details:', error))
    }
  }, [selectedCountry])

  const handleSearchChange = event => setSearchTerm(event.target.value)

  const handleCountrySelection = country => setSelectedCountry(country)

  return (
    <div>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      {searchTerm && filteredCountries.length > 10 && (
          <span>Too many matches, specify another filter</span>
      )}
      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <CountryList
          countries={filteredCountries}
          onSelectCountry={handleCountrySelection}
        />
      )}
      {countryDetails && (
        <>
          <CountryDetails countryDetails={countryDetails} />
          {weatherDetails && (
            <CountryWeather
              capital={countryDetails.capital[0]}
              weatherDetails={weatherDetails}
            />
          )} 
        </>
      )}
    </div>
  )
}

export default App