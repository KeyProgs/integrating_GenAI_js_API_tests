// ===============================
// File: config.js
// ===============================
import dotenv from "dotenv";
dotenv.config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const WEATHER_API_KEY = process.env.WEATHER_API_KEY;