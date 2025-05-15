// ===============================
// File: utils.js
// Description: Utility functions for fetching GitHub user information and weather data
// ===============================
import fetch from "node-fetch";

/**
 * Fetches GitHub user information for a given username
 * @param {Array} [userName] - GitHub username to fetch information for
 * @returns {string} JSON string containing user information
 */
export async function getUsersInfo([userName]) {
  try {
    // Construct GitHub API URL
    const url = `https://api.github.com/users/${userName}`;
    console.log("GitHub API URL:", url);

    // Fetch user data from GitHub API
    const response = await fetch(url);
    const data = await response.json();

    // Extract relevant user information
    const userInfo = {
      login: data.login,
      id: data.id,
      name: data.name,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      location: data.location,
      bio: data.bio,
      twitter_username: data.twitter_username,
      created_at: data.created_at,
    };

    return JSON.stringify(userInfo, null, 2);
  } catch (err) {
    console.error("Error in getUsersInfo:", err);
    return JSON.stringify({ error: "Failed to fetch user info." });
  }
}

/**
 * Simulates fetching current weather information for a location
 * Note: This is a mock implementation for testing purposes
 * @param {Array} [location, unit] - Location name and temperature unit (celsius/fahrenheit)
 * @returns {string} JSON string containing weather information
 */
export async function getCurrentWeather([location, unit]) {
  try {
    // Mock weather data for testing
    const weather = {
      location,
      temperature: unit === "celsius" ? "22°C" : "72°F",
      condition: "Partly cloudy",
    };
    return JSON.stringify(weather, null, 2);
  } catch (err) {
    console.error("Error in getCurrentWeather:", err);
    return JSON.stringify({ error: "Failed to fetch weather info." });
  }
}
