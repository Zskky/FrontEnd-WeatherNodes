import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherHistory = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);

  const fetchHistoricalData = useCallback(() => {
    axios
      .get(`https://ibas.azurewebsites.net/get-historical-data`, {
        params: { apikey: '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139' }
      })
      .then((response) => {
        console.log('API response:', response.data);
        
        if (response.data.historical_data) {
          const formattedData = response.data.historical_data.map((item) => ({
            timestamp: new Date(item.timestamp).toLocaleString(),
            temperature: item.decrypted_data.temperature,
            humidity: item.decrypted_data.humidity,
            pressure: item.decrypted_data.pressure,
            windSpeed: item.decrypted_data.windSpeed,
            cloudCover: item.decrypted_data.cloudCover,
            precipitation: item.decrypted_data.precipitation,
          }));
          setHistoricalData(formattedData);
        } else {
          setError('No historical data available.');
        }
      })
      .catch((error) => {
        console.error('Error fetching historical data:', error);
        setError('Failed to fetch historical data. Please try again later.');
      });
  }, []);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  const limitedData = historicalData.slice(-10); // Limit to last 20 data points

  return (
    <div id="weaHis" className="weaHis-container">
        <h2>Weather History</h2>
      {error && <div className="error">{error}</div>}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={limitedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickCount={5} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
          <Line type="monotone" dataKey="pressure" stroke="#ffc658" />
          <Line type="monotone" dataKey="windSpeed" stroke="#ff7300" />
          <Line type="monotone" dataKey="cloudCover" stroke="#00C49F" />
          <Line type="monotone" dataKey="precipitation" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherHistory;
