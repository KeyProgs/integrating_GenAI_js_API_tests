import fetch from "node-fetch";
import { geoCode, kelvinToCelsius } from "./utils.js";

// Default export of the getCurrentWeather function
export default async function getCurrentWeather(args) {
  try {
    // Extract location and unit from args object
    const { location, unit = "celsius" } = args;
    
    if (!location) {
      throw new Error("Location is required");
    }

    const loc = location.split(",")[0];
    const { lat, lon } = await geoCode(loc);

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(url);
    const json = await response.json();

    const currentTemp = json.main.temp;
    const description = json.weather[0].description;

    const weatherInfo = {
      location,
      temperature: unit === "celsius" ? kelvinToCelsius(currentTemp) : currentTemp,
      unit,
      forecast: description,
    };

    return JSON.stringify(weatherInfo);
  } catch (err) {
    console.error("Error in getCurrentWeather:", err);
    return JSON.stringify({ error: "Failed to get weather data" });
  }
}

// Named export of the tool definition
export const tool = {
  type: "function",
  function: {
    name: "get_current_weather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City and state, e.g., 'Prague, Czech Republic'",
        },
        unit: {
          type: "string",
          enum: ["celsius", "kelvin"],
          default: "celsius",
        },
      },
      required: ["location"],
    },
  },
};
