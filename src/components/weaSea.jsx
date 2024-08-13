import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState('');

  const fetchWeatherData = useCallback((capital) => {
    axios
      .get(`https://ibas.azurewebsites.net/fetch-only`, {
        params: { capital, apikey: '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139' }
      })
      .then((response) => {
        console.log('API response:', response.data);
        const data = response.data;
        setWeatherData({
          temperature: data.temperature || 'N/A',
          humidity: data.humidity || 'N/A',
          pressure: data.pressure || 'N/A',
          windSpeed: data.windSpeed || 'N/A',
          cloudCover: data.cloudCover || 'N/A',
          precipitation: data.precipitation || 'N/A',
        });
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data. Please try again later.');
      });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (location.trim() === '') {
      setError('Please enter a valid capital city.');
      return;
    }
    setError(null); // Clear any previous errors
    fetchWeatherData(location);
  };

  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      const localTimeString = now.toLocaleTimeString();
      setLocalTime(localTimeString);
    };

    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="weather" className="weather-container">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            id="location-input"
            placeholder="Enter capital city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="button" id="search-button" onClick={handleSearch}>
            Search
          </button>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="weather-grid">
        <div className="weather-item">
          <p>Temperature: {weatherData.temperature !== 'N/A' ? `${weatherData.temperature} °C` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Humidity: {weatherData.humidity !== 'N/A' ? `${weatherData.humidity} %` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Pressure: {weatherData.pressure !== 'N/A' ? `${weatherData.pressure} hPa` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Wind Speed: {weatherData.windSpeed !== 'N/A' ? `${weatherData.windSpeed} km/h` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Cloud Cover: {weatherData.cloudCover !== 'N/A' ? `${weatherData.cloudCover} %` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Precipitation: {weatherData.precipitation !== 'N/A' ? `${weatherData.precipitation} mm` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p id="local-time">Local Time: {localTime}</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
