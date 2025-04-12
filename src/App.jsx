import React, { useEffect, useRef, useState } from 'react'
import SearchSection from './components/SearchSection'
import CurrentWeather from './components/CurrentWeather'
import HourlyWeatherItem   from './components/HourlyWeatherItem'
import {weatherCodes} from "./constants";
import NoResultsDiv from './components/NoResultsDiv';

const App = () => {
  let API_KEY = import.meta.env.VITE_API_KEY;

  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, seHasNoResults] = useState(false);
  const searchInputRef = useRef(null);

  const filterHourlyForecast = (hourlyData) => {
      const currentHour = new Date().setMinutes(0, 0, 0);
      const next24Hours = currentHour + 24 * 60 * 60 * 1000;
      const next24HoursData = hourlyData.filter(({time}) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hours;
      });

      setHourlyForecasts(next24HoursData);
  };

  // fetches weather details based on the api url
  const getWeatherDetails = async (API_URL) => {
      seHasNoResults(false);
      window.innerWidth <= 768 && searchInputRef.current.focus();

      try {
        const response = await fetch(API_URL);
        if(!response.ok) throw new Error();
        const data = await response.json();

        console.log(data);

        //  Extract current weather data
        const temperature =  Math.floor(data.current.temp_c);
        const description =  data.current.condition.text;
        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));

        setCurrentWeather({ temperature, description, weatherIcon });
        console.log(temperature, description, weatherIcon);

        // combine hourly data from both forecast days
        const combinedHourlyData = [...data.forecast.forecastday[0].hour,...data.forecast.forecastday[1].hour];

        searchInputRef.current.value = data.location.name;
        filterHourlyForecast(combinedHourlyData);

      } catch {
        seHasNoResults(true);
      }
  };

  useEffect(() => {
    const defaultCity = "surat";
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${"28392799ecf241c4a14123046250303"}&q=${defaultCity}&days=2`;
        getWeatherDetails(API_URL);
  },[]);

  return (

    <div className='container'>
      {/* search section */}
      <SearchSection getWeatherDetails={getWeatherDetails} searchInputRef={searchInputRef} />

      {hasNoResults ? (
        <NoResultsDiv />
      ) : (
            <div className="weather-section">
              <CurrentWeather currentWeather={currentWeather}/>

              {/* Hourly weather forecast list */}
              <div className="hourly-forecast">
                <ul className="weather-list">
                  {hourlyForecasts.map(hourlyWeather =>   (
                    <HourlyWeatherItem key={hourlyWeather.time_epoch} hourlyWeather={hourlyWeather}/>

                  ))}
                </ul>
              </div>
            </div>
      )}

    </div>
  )
}

export default App
