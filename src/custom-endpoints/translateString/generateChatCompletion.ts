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
  cookieString: string,
  imageUrl?: string,
) {
  let chatCompletion;

  try {
    const baseContent = replaceTemplateVariables(locale, context, term, askChatgptPrompt);

    const messages = [];

    if (imageUrl) {
      const imageResponse = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}${imageUrl}`, {
        headers: {
          Cookie: cookieString,
        },
        credentials: "include",
      });

      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch image from ${imageUrl}: ${imageResponse.status} ${imageResponse.statusText}`,
        );
      }

      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageArrayBuffer).toString("base64");
      const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: baseContent,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${contentType};base64,${base64Image}`,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: baseContent,
      });
    }

    chatCompletion = await openai.chat.completions.create({
      // @ts-expect-error Still works, but the type definition is not up-to-date
      messages,
      model,
      tools: toolsDefinition,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: estimateTokenCount(term),
      top_p: 1,
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    throw error;
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
