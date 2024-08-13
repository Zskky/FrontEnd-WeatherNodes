import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState('');

  const fetchWeatherData = useCallback((lat, lon) => {
    axios
      .get(`https://ibas.azurewebsites.net/get-weather`, {
        params: { lat, lon },
      })
      .then((response) => {
        console.log('API response:', response.data);
        const data = response.data;
        setWeatherData({
          country: data.sys.country,
          temp_c: data.main.temp - 273.15, // Convert Kelvin to Celsius
          lat: data.coord.lat,
          lon: data.coord.lon,
          name: data.name,
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          wind_kph: data.wind.speed * 3.6, // Convert m/s to km/h
          icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        });
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data. Please try again later.');
      });
  }, []);

  const handleSearch = () => {
    // Use a geocoding API or your own backend to convert the location to lat/lon
    axios
      .get('https://geocoding-api.com/api/v1/capital', {
        params: { capital: location },
      })
      .then((response) => {
        const { lat, lon } = response.data; // Assuming the API returns lat/lon
        fetchWeatherData(lat, lon);
      })
      .catch((error) => {
        console.error('Error fetching geocoding data:', error);
        setError('Failed to fetch geocoding data. Please try again later.');
      });
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
        <input
          type="text"
          id="location-input"
          placeholder="Enter capital city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button id="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="weather-grid">
        <div className="weather-item">
          <p>Country: {weatherData.country || 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Temperature: {weatherData.temp_c !== undefined ? `${weatherData.temp_c} °C` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Latitude: {weatherData.lat || 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Longitude: {weatherData.lon || 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Location Name: {weatherData.name || 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Condition: {weatherData.condition || 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Humidity: {weatherData.humidity || 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Wind Speed: {weatherData.wind_kph !== undefined ? `${weatherData.wind_kph} kph` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <img src={weatherData.icon} alt="Weather Icon" />
        </div>
        <div className="weather-item">
          <p id="local-time">Local Time: {localTime}</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
