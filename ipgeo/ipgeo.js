
// ===============================
// File: ipgeo/usData.js
// ===============================

export const tool = {
    type: "function",
    function: {
      name: "get_geo_by_ip",
      description: "Get Geo DATA  by IP",
      parameters: {
        type: "object",
        properties: {
          ip: { type: "string", description: "ip" },
        },
        required: ["ip"],
      },
    },
  };
  
  export default async function getGeoByIp({ ip }) {
    try {
      const url = `https://ipinfo.io/${ip}/geo`;
      const response = await fetch(url);
      const data = await response.json();
      return JSON.stringify({
        city: data.city,
       
      });
    } catch (err) {
      console.error("Error fetching Geo DATA info:", err);
      return JSON.stringify({ error: "Failed to fetch Geo DATA" });
    }
  }