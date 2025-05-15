// ===============================
// File: config.js
// Description: Configuration file that handles environment variables
// and API keys for the application
// ===============================
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Export API keys from environment variables
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const WEATHER_API_KEY = process.env.WEATHER_API_KEY;