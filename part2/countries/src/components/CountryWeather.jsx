const CountryWeather = ({ capital, weatherDetails }) => {
    
    return (
      <div>
        <h3>Weather in {capital}</h3>
        <p>Temperature: {weatherDetails.main.temp}°C</p>
        <p>Wind: {weatherDetails.wind.speed} m/s</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`}
          alt={weatherDetails.weather[0].description}
        />
      </div>
    )
  }
  
  export default CountryWeather