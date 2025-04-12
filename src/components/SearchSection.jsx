import React from 'react'

const SearchSection = ({getWeatherDetails, searchInputRef}) => {
    let API_KEY = import.meta.env.VITE_API_KEY;

    // handles city search from submission
    const handleCitySearch = (e) => {
        e.preventDefault();
        const searchInput = e.target.querySelector(".search-input");
        // const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchInput.value}`;
        const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${"28392799ecf241c4a14123046250303"}&q=${searchInput.value}&days=2`;
        getWeatherDetails(API_URL);  // fetches weather details for the entered city
    };

    const handleLocationSearch = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                // console.log(position);
                const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${"28392799ecf241c4a14123046250303"}&q=${latitude},${longitude}&days=2`;
                getWeatherDetails(API_URL);
                window.innerWidth >= 768 && searchInputRef.current.focus();
            },
            () => {
                alert("Location access denied. Please enable permission to use this feature.")
            }
        )
    }

    return (
        <div className="search-section" onSubmit={handleCitySearch}>
            <form action="#" className="search-form">
                <span className="material-symbols-rounded">search</span>
            <input type="search" placeholder='Enter a city name' ref={searchInputRef} className="search-input" required/>
            </form>
            <button className="location-button" onClick={handleLocationSearch}>
            <span className="material-symbols-rounded">my_location</span>
            </button>
        </div>
  )
}

export default SearchSection
