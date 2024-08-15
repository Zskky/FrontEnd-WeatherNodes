import React, { useEffect } from 'react';
import axios from 'axios';

function FetchWeather() {
  useEffect(() => {
    const apikey = '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139';
    const capital = 'Singapore'; // Replace with the actual capital city

    const fetchWeatherData = () => {
      axios
        .get(`https://ibas.azurewebsites.net/fetch-store-weather`, {
          params: { capital, apikey }
        })
        .then(response => {
          console.log('Weather data fetched:', response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    };

    // Fetch data immediately on component mount
    fetchWeatherData();

    // Set an interval to fetch data every 12 hours (12 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const intervalId = setInterval(fetchWeatherData, 12 * 60 *  60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <div>Weather data fetcher is running in the background.</div>;
}

export default FetchWeather;
