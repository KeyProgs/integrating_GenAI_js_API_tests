// ===============================
// File: ai.js
// Description: Main AI integration file that handles OpenAI API interactions
// and function calling capabilities
// ===============================

// Import required dependencies
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { getCurrentWeather, getUsersInfo } from "./utils.js";

// Initialize OpenAI client with API key
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Define available tools/functions that can be called by the AI
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
  {
    type: "function",
    function: {
      name: "get_github_user_info",
      description: "Get GitHub user information by username",
      parameters: {
        type: "object",
        properties: {
          userName: { type: "string", description: "GitHub username" },
        },
        required: ["userName"],
      },
    },
  },
];

// Map of function names to their actual implementations
const availableFunctions = {
  get_current_weather: getCurrentWeather,
  get_github_user_info: getUsersInfo,
};

// Map of function names to their argument mapping functions
// This helps transform the AI's arguments into the format expected by our functions
const functionArgMaps = {
  get_current_weather: (args) => [args.location, args.unit],
  get_github_user_info: (args) => [args.userName],
};

/**
 * Main conversation handler that processes messages and manages function calls
 * @param {Array} messages - Array of conversation messages
 * @returns {Object} - Response from OpenAI API
 */
export async function runConversation(messages) {
  try {
    // Initial API call to get AI's response
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      tools,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    // If no function calls are needed, return the response directly
    if (!toolCalls) return response;

    // Add the AI's response to the conversation history
    messages.push(responseMessage);

    // Process each function call
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      // Get the appropriate function and map its arguments
      const functionToCall = availableFunctions[functionName];
      const mappedArgs = functionArgMaps[functionName](args);

      // Execute the function and get its response
      const functionResponse = await functionToCall(mappedArgs);

      // Add the function response to the conversation history
      messages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: functionResponse,
      });
    }

    // Make a final API call with the updated conversation history
    const secondResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
    });

    return secondResponse;
  } catch (error) {
    // Error handling
    console.error("Error in runConversation:", error);
    return { choices: [{ message: { content: "An error occurred." } }] };
  }
}
