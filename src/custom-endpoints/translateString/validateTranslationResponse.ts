import OpenAI from "openai";
import { array, object, parse, string, InferOutput } from "valibot";

const TranslationResponseSchema = object({
  translations: array(string()),
});

type TranslationResponse = InferOutput<typeof TranslationResponseSchema>;

export function validateTranslationResponse(
  chatCompletion: (OpenAI.Chat.Completions.ChatCompletion & { _request_id?: string | null }) | undefined,
) {
  let result: TranslationResponse["translations"] = [];

  if (chatCompletion) {
    try {
      const rawResponse = JSON.parse(chatCompletion.choices[0].message.tool_calls?.[0].function.arguments ?? "");

      const validatedResponse = parse(TranslationResponseSchema, rawResponse);

      if (validatedResponse.translations.length > 0) {
        result = validatedResponse.translations;
      } else {
        console.error("Empty translations array from ChatGPT");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error processing response:", error.message);
      } else {
        console.error("Unknown error processing response");
      }
    }
  }

  return result;
}
