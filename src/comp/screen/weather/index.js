import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = (props) => {
  // State to hold weather data and user's current location
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // API URL and API key
  const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?'; // Replace with the API URL you are using
  const apiKey = process.env.REACT_APP_WEATHER_API; // Replace with your actual API key


  // Fetch user's current location using geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not available on this device.');
    }
  }, []);

  // Fetch weather data for the user's current location
  useEffect(() => {
    if (currentLocation) {
      axios
        .get(weatherApiUrl, { params: { appid: apiKey, lat: currentLocation.lat, lon: currentLocation.lon,units:'metric' } })
        .then(response => {
          setWeatherData(response.data);
          props.updateLiveLocation([currentLocation.lat,currentLocation.lon]);
        })
        .catch(error => {
          console.error('Error fetching weather data for current location:', error);
        });
    }
  }, [currentLocation]);

  

  useEffect(() => {
    if(props.placeName){
      axios
      .get(weatherApiUrl, { params: { appid: apiKey,lat:props.latitude,lon:props.longitude,units:'metric' } })
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data for the specified city:', error);
      });
    }
  }, [props.placeName])

  // JSX to display the weather information
  return (
    <div>
      {weatherData ? (
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <div>
          <h2>{placeName(props.placeName, weatherData.name)}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
        <div>
          <img style={{height:"75px",width:"75px"}} src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather"/>
        </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

const placeName = (propLocation, weatherLocation) => {
    if(propLocation == null){
        return weatherLocation;
    }
    else{
        return propLocation;
    }
}

export default Weather;