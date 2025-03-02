import OpenAI from "openai";
import { toolsDefinition } from "./toolsDefinition";

const openai = new OpenAI();

const ESTIMATED_AVERAGE_CHARS_PER_TOKEN = 2.3;
const MAX_OPTIONS = 5;

export async function generateChatCompletion(
  askChatgptPrompt: string,
  locale: string,
  context: string,
  model: string,
  term: string,
) {
  let chatCompletion;

  try {
    chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: replaceTemplateVariables(locale, context, term, askChatgptPrompt),
        },
      ],
      model,
      tools: toolsDefinition,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: estimateTokenCount(term),
      top_p: 1,
    });
  } catch (error) {
    console.error("Error fetching translations:", error);
  }

  return chatCompletion;
}

function replaceTemplateVariables(
  locale: string,
  context: string,
  term: string,
  askChatgptPrompt: string,
) {
  const replacements = {
    "{locale}": locale.toString(),
    "{context}": context,
    "{term}": term,
  };

  const regex = new RegExp(Object.keys(replacements).join("|"), "g");

  return askChatgptPrompt.replace(
    regex,
    (match) => replacements[match as keyof typeof replacements],
  );
}

// Generates a rough estimation, typically about 20% higher than needed to give the model some flexibility.
function estimateTokenCount(term: string) {
  return Math.max(256, Math.round((term.length / ESTIMATED_AVERAGE_CHARS_PER_TOKEN) * MAX_OPTIONS));
}
