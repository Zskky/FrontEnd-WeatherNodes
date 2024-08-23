import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Weather = () => {
  const [capital] = useState('Singapore'); // Hard-coded capital
  const [weatherData, setWeatherData] = useState({});
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState('');

  // Function to initialize the map
  useEffect(() => {
    const lat = 1.3521; // Latitude for Singapore
    const lon = 103.8198; // Longitude for Singapore
    const newMap = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(newMap);
    const newMarker = L.marker([lat, lon]).addTo(newMap);
    setMap(newMap);
    setMarker(newMarker);
  }, []);

  // Function to fetch weather data from the API
  const fetchWeatherData = useCallback(() => {
    axios
      .get(`https://ibas.azurewebsites.net/fetch-only`, {
        params: { capital, apikey: '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139' }
      })
      .then((response) => {
        console.log('API response:', response.data); // Log the entire response for debugging
        
        if (response.data.valid) {  // Check if the response is valid
          const data = response.data.averages;  // Access the averages object

          // Update state with the relevant fields from the API response
          setWeatherData({
            temperature: data.temperature || 'N/A',
            humidity: data.humidity || 'N/A',
            pressure: data.pressure || 'N/A',
            windSpeed: data.windSpeed || 'N/A',
            cloudCover: data.cloudCover || 'N/A',
            precipitation: data.precipitation || 'N/A',
          });

          // Update the map marker position if necessary
          if (marker) {
            marker.setLatLng([1.3521, 103.8198]).update();
            map.setView([1.3521, 103.8198]);
          }
        } else {
          setError('Invalid weather data response.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data. Please try again later.');
      });
  }, [capital, marker, map]);

  useEffect(() => {
    // Fetch weather data when the component mounts
    fetchWeatherData();

    const updateLocalTime = () => {
      const now = new Date();
      const localTimeString = now.toLocaleTimeString();
      setLocalTime(localTimeString);
    };

    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 1000);

    return () => clearInterval(intervalId);
  }, [fetchWeatherData]);

  return (
    <div id="weather" className="weather-container">
      <h2> Weather </h2>
      <div className="map-container" id="map-container">
        <div id="map" className="map"></div>
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
