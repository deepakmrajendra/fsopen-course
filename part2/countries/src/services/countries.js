import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const getAllCountries = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getCountryDetails = countryName => {
    // console.log(`Fetching details for country: ${countryName}`)
    const request = axios.get(`${baseUrl}/name/${countryName}`)
    return request.then(response => response.data)
}

const getWeatherDetails = capital => {
    // console.log(`Fetching country capital: ${capital}`)
    const request = axios.get(`${weatherBaseUrl}?q=${capital}&units=metric&appid=${apiKey}`)
    return request.then(response => response.data)
  }

export default { getAllCountries, getCountryDetails, getWeatherDetails }