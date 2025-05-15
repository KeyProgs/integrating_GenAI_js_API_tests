
// ===============================
// File: us/usData.js
// ===============================

export const tool = {
  type: "function",
  function: {
    name: "get_us_data_by_year",
    description: "Get US DATA info by Year",
    parameters: {
      type: "object",
      properties: {
        year: { type: "string", description: "Year" },
      },
      required: ["year"],
    },
  },
};

export default async function getUsersInfo({ year }) {
  try {
    const url = `https://datausa.io/api/data?measures=Population`;
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify({
      Population: data.Population,
     
    });
  } catch (err) {
    console.error("Error fetching US DATA info:", err);
    return JSON.stringify({ error: "Failed to fetch us DATA" });
  }
}