const CountryList = ({ countries, onSelectCountry }) => {
  
    return (
      <div>
        {countries.map(country => (
          <span key={country.name.official}>
            {country.name.common} <button onClick={() => onSelectCountry(country)}>show</button> <br />
          </span>
        ))}
      </div>
    )

  }
  
  export default CountryList