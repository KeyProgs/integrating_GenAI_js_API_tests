/**
 * Converts temperature from Kelvin to Celsius
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} Temperature in Celsius, rounded to nearest integer
 */
export function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
  }
  
/**
 * Converts a location name to coordinates
 * Note: This is a dummy implementation that returns fixed coordinates for Prague
 * In a real application, this would use a geocoding API
 * @param {string} location - Location name to geocode
 * @returns {Promise<{lat: number, lon: number}>} Object containing latitude and longitude
 */
export async function geoCode(location) {
    // Dummy coordinates (replace with real API)
    return {
      lat: 50.0755,
      lon: 14.4378,
    };
  }
  