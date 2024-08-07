import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState('');

  const apiKey = "06d432944c8b2429b0cec5fd03b4d6db"; // Replace with your actual API key

  const initializeMap = useCallback((lat, lon) => {
    if (!map) {
      const newMap = L.map('map').setView([lat, lon], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(newMap)

      const newMarker = L.marker([lat, lon]).addTo(newMap);
      setMap(newMap);
      setMarker(newMarker);
    }
  }, [map]);

  const fetchWeatherData = useCallback((lat, lon) => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then((response) => {
        console.log('API response:', response.data);
        const data = response.data;
        setWeatherData({
          country: data.sys.country,
          temp_c: data.main.temp,
          lat: data.coord.lat,
          lon: data.coord.lon,
          name: data.name,
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          wind_kph: data.wind.speed,
          icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        });

        if (marker) {
          marker.setLatLng([data.coord.lat, data.coord.lon]).update();
          map.setView([data.coord.lat, data.coord.lon]);
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data. Please try again later.');
      });
  }, [apiKey, map, marker]);

  useEffect(() => {
    const showPosition = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      fetchWeatherData(lat, lon);
      initializeMap(lat, lon);
    };

    const showError = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
        default:
          alert("An unknown error occurred.");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
 
    const updateLocalTime = () => {
      const now = new Date();
      const localTimeString = now.toLocaleTimeString();
      setLocalTime(localTimeString);
    };

    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 1000);

    return () => clearInterval(intervalId);
    }, [fetchWeatherData, initializeMap]);

    //const handleSearch = () => {
      // You can use a geocoding API to convert the location name to lat/lon before fetching weather data
      //fetchWeatherData(location);
  //};

  return (
    <div id="weather" className="weather-container">
      <div className="map-container" id="map-container">
        <div id="map" className="map"></div>
      </div>
      <div className="search-container">
        <input
          type="hidden"
          id="location-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {/*<button id="search-button" onClick={handleSearch}>
          Search
        </button>*/}
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
