// ===============================
// File: ai.js
// ===============================
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { getCurrentWeather } from "./utils.js";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function runConversation(messages) {
  const tools = [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string", description: "City and state" },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ];

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

    const availableFunctions = {
      get_current_weather: getCurrentWeather,
    };

    messages.push(responseMessage);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = await functionToCall(
        functionArgs.location,
        functionArgs.unit
      );

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