import React, { useEffect } from 'react';
import axios from 'axios';

function FetchWeather() {
  useEffect(() => {
    const apikey = '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139';
    const capital = 'Singapore'; // Replace with the actual capital city
    const fetchInterval = 1 * 60 * 60 * 1000; // 12 hours

    const fetchWeatherData = () => {
      axios
        .get(`https://ibas.azurewebsites.net/fetch-store-weather`, {
          params: { capital, apikey }
        })
        .then(response => {
          console.log('Weather data fetched:', response.data);
          // Store the timestamp of the last fetch in localStorage
          localStorage.setItem('lastFetchTime', Date.now().toString());
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
        });
    };

    // Check the last fetch time from localStorage
    const lastFetchTime = parseInt(localStorage.getItem('lastFetchTime'), 10);
    const currentTime = Date.now();

    // Calculate the time until the next fetch based on the last fetch time
    let timeUntilNextFetch = fetchInterval;

    if (lastFetchTime && currentTime - lastFetchTime < fetchInterval) {
      timeUntilNextFetch = fetchInterval - (currentTime - lastFetchTime);
    }

    // Set a timeout to fetch data at the calculated time
    const timeoutId = setTimeout(() => {
      fetchWeatherData();
      // After the initial timeout, set the regular interval
      const intervalId = setInterval(fetchWeatherData, fetchInterval);
      // Clear the interval if the component unmounts
      return () => clearInterval(intervalId);
    }, timeUntilNextFetch);

    // Clean up the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  return <div>Weather data fetcher is running in the background.</div>;
}

export default FetchWeather;
