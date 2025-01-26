const CountryDetails = ({ countryDetails }) => {
  
    return (
      <div>
        <h2>{countryDetails.name.common}</h2>
        <p>Capital {countryDetails.capital}</p>
        <p>Area {countryDetails.area} km²</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(countryDetails.languages).map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
        <img
          src={countryDetails.flags.png}
          alt={`Flag of ${countryDetails.name.common}`}
          style={{ width: '150px', height: 'auto' }}
        />
      </div>
    )
  }
  
  export default CountryDetails