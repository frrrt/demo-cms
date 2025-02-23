import { toolsDefinition } from "./toolsDefinition";
import { openai } from "./translateString";

export async function generateChatCompletion(
  askChatgptPrompt: string,
  locale: string,
  context: string,
  model: string,
  term: string,
) {
  let chatCompletion;

  const replacements = {
    "{locale}": locale.toString(),
    "{context}": context,
    "{term}": term,
  };

  const regex = new RegExp(Object.keys(replacements).join("|"), "g");

  try {
    chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: askChatgptPrompt.replace(regex, (match) => replacements[match as keyof typeof replacements]),
        },
      ],
      model,
      tools: toolsDefinition,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: Math.max(256, Math.round(((term as string).length / 2.3) * 5)), // 5 is the number of options
      top_p: 1,
    });
  } catch (error) {
    console.error("Error fetching translations:", error);
  }

  return chatCompletion;
}
