// ===============================
// File: ai.js
// ===============================

import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import getCurrentWeather, { tool as weatherTool } from "./weather/getCurrentWeather.js";
import getUsersInfo, { tool as githubTool } from "./github/getUsersInfo.js";
// import getUsData, { tool as usTool } from "./us/usData.js";
import getGeoByIp, { tool as geoTool } from "./ipgeo/ipgeo.js";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const tools = [weatherTool, githubTool, geoTool];

const availableFunctions = {
  get_current_weather: getCurrentWeather,
  get_github_user_info: getUsersInfo,
  // get_us_data_by_year: getUsData,
  get_geo_by_ip: getGeoByIp,
};

export async function runConversation(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (!toolCalls) return response;

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);

      // Debug logging
      console.log("Requested function name:", functionName);
      console.log("Available functions:", Object.keys(availableFunctions));

      if (typeof functionToCall !== "function") {
        console.error(`Function not found for name: ${functionName}`);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify({ error: `Function not found for name: ${functionName}` }),
        });
        continue;
      }

      const functionResponse = await functionToCall(functionArgs);

      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: functionResponse,
      });

      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages,
      });
      return secondResponse;
    }
  } catch (e) {
    console.error("Error in runConversation:", e);
  }
}