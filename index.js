// ===============================
// File: index.js
// ===============================
import readlineSync from "readline-sync";
import { runConversation } from "./ai.js";

const messages = [
  { role: "system", content: "You are a professional assistant?" },
];

function getInput(promptMessage) {
  return readlineSync.question(promptMessage);
}

async function start() {
  console.log("\n\n----------------------------------");
  console.log("          CHAT WITH AI 🤖   ");
  console.log("----------------------------------\n");
  console.log("\nBot: How can I help you?");

  while (true) {
    const input = getInput("You: ");
    if (input === "x") {
      console.log("Goodbye!");
      process.exit();
    }

    messages.push({ role: "user", content: input });
    const response = await runConversation(messages);
    console.log("Bot:", response.choices[0].message.content);
  }
}

start();