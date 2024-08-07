import React, { useState } from 'react';
import axios from 'axios';
//import './weather.css'; // Ensure you create this CSS file

const WeaHist = () => {
  // State variables to store start date, end date, forecast data, and error message
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const apiKey = "your_actual_api_key"; // Replace with your actual API key

  // Function to handle the search action when the search button is clicked
  const searchForecast = async () => {
    if (!startDate || !endDate) {
      // Alert if either start date or end date is not selected
      alert('Please select both start and end dates.');
      return;
    }

    // Call the function to get weather data for the specified date range
    try {
      const data = await getWeatherTimeLine(startDate, endDate);
      setForecastData(data);
    } catch (err) {
      setError('Failed to fetch forecast data. Please try again later.');
    }
  };

  // Function to fetch historical weather data from the API
  const getWeatherTimeLine = async (start, end) => {
    const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=Panadura&dt=${start}&end_dt=${end}`;
    
    // Log the request URL for debugging
    console.log('Request URL:', url);
    
    try {
      const response = await axios.get(url);
      return response.data.forecast.forecastday;
    } catch (error) {
      // Log the full error response for debugging
      console.error('Error fetching forecast data:', error.response || error.message);
      throw new Error('Failed to fetch forecast data.');
    }
  };

  return (
    <div className="weather-container">
      {/* Date range selection inputs and search button */}
      <div className="date-range-container">
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={searchForecast}>Search Forecast</button>
      </div>
      
      {/* Display error message if there is any */}
      {error && <div className="error">{error}</div>}
      
      {/* Display fetched forecast data in a grid format */}
      <div className="forecast-grid">
        {forecastData.map((forecast, index) => (
          <div key={index} className="forecast-item">
            <p>Date: {forecast.date}</p>
            <p>Condition: {forecast.day.condition.text}</p>
            <img src={forecast.day.condition.icon} alt="Weather Icon" />
            <p>Max Temp: {forecast.day.maxtemp_c} °C</p>
            <p>Min Temp: {forecast.day.mintemp_c} °C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaHist;
