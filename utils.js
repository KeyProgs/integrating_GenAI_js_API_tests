// ===============================
// File: utils.js
// ===============================
import fetch from "node-fetch";
import { WEATHER_API_KEY } from "./config.js";

export function kelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

export async function geoCode(location) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${WEATHER_API_KEY}`
    );
    const data = await response.json();
    const lat = data[0]?.lat;
    const lon = data[0]?.lon;
    return { lat, lon };
  } catch (err) {
    console.error("Error in geoCode:", err);
    return {};
  }
}

export async function getCurrentWeather(location, unit) {
  const loc = location.split(",")[0];
  const { lat, lon } = await geoCode(loc);
  if (!lat || !lon) return "Location not found.";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );
    const json = await response.json();

    const weatherInfo = {
      location: location,
      temperature: kelvinToCelsius(json.main.temp),
      unit: unit,
      forecast: json.weather[0].description,
    };
    return JSON.stringify(weatherInfo);
  } catch (error) {
    console.error("Error in getCurrentWeather:", error);
    return "Could not retrieve weather data.";
  }
}