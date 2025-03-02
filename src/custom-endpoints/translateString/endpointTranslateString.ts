import type { Endpoint, PayloadRequest } from "payload";
import { getSettings } from "./getSettings";
import { validateTranslationResponse } from "./validateTranslationResponse";
import { generateChatCompletion } from "./generateChatCompletion";
import { validateQueryParams } from "./validateQueryParams";
import { ROUTE_TRANSLATION_STRING } from "@/const/routes";

// The endpoint takes a term, a target locale, and a context as query parameters.
// Apart from some validation both for the input as well as the output, the endpoint
// also gets some configuration from the Settings global and then uses the ChatGPT API
// to generate a translation for the term.
//
// The response is a short array containing about 3-5 translation options.
// The endpoint is protected and requires the user to be authenticated. Very important
// as the ChatGPT API is a paid service. Costs are about 0.1 - 1 cent per request.
export const endpointTranslateString: Endpoint = {
  path: ROUTE_TRANSLATION_STRING,
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

    const chatCompletion = await generateChatCompletion(
      askChatgptPrompt,
      locale,
      context,
      model,
      term,
    );

    const result = validateTranslationResponse(chatCompletion);

    return Response.json(result);
  },
};
