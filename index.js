// ===============================
// File: index.js
// Description: Main application entry point that handles user interaction
// and manages the chat interface
// ===============================
import readlineSync from "readline-sync";
import { runConversation } from "./ai.js";

// Initialize conversation with system message
const messages = [
  { role: "system", content: "You are a helpful assistant." },
];

/**
 * Helper function to get user input with a prompt
 * @param {string} promptMessage - Message to display to the user
 * @returns {string} User's input
 */
function getInput(promptMessage) {
  return readlineSync.question(promptMessage);
}

/**
 * Main application function that runs the chat interface
 * Handles user input and AI responses in a continuous loop
 */
async function start() {
  // Display welcome message and interface
  console.log("\n\n----------------------------------");
  console.log("          CHAT WITH AI 🤖         ");
  console.log("----------------------------------\n");
  console.log("Bot: How can I help you?");

  // Main chat loop
  while (true) {
    // Get user input
    const input = getInput("You: ");
    
    // Check for exit command
    if (input.toLowerCase() === "x") {
      console.log("Goodbye!");
      process.exit();
    }

    // Add user message to conversation history
    messages.push({ role: "user", content: input });
    
    // Get AI response and display it
    const response = await runConversation(messages);
    console.log("Bot:", response.choices[0].message.content);
  }
}

// Start the application
start();
