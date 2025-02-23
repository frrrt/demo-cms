import OpenAI from "openai";
import type { Endpoint, PayloadRequest } from "payload";
import { getSettings } from "./getSettings";
import { validateTranslationResponse } from "./validateTranslationResponse";
import { generateChatCompletion } from "./generateChatCompletion";
import { validateQueryParams } from "./validateQueryParams";

export const openai = new OpenAI();

export const translateString: Endpoint = {
  path: "/translate-string",
  method: "get",
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const validated = validateQueryParams(req);

    if (!validated) {
      return Response.json({ error: "Query parameters could not be validated" }, { status: 400 });
    }

    const { locale, term, context } = validated;

    const { askChatgptPrompt, model } = await getSettings(req);

    const chatCompletion = await generateChatCompletion(askChatgptPrompt, locale, context, model, term);

    const result = validateTranslationResponse(chatCompletion);

    return Response.json(result);
  },
};
