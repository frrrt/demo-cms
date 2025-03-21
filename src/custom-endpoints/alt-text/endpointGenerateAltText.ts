import type { Endpoint, PayloadRequest } from "payload";
import { ROUTE_ALT_TEXT } from "@/const/routes";
import OpenAI from "openai";
import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { ROLE_EDITOR } from "@/custom-fields/rbac/roles";
import { getSettings } from "../translateString/getSettings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const endpointGenerateAltText: Endpoint = {
  path: ROUTE_ALT_TEXT,
  method: "post",
  handler: async (req: PayloadRequest) => {
    if (!rbacHas(ROLE_EDITOR)({ req })) {
      return Response.json({ error: "Not authorized" }, { status: 403 });
    }

    try {
      const text = await req.text?.();
      let requestData;

      try {
        if (!text) {
          throw new Error("No request body provided");
        }

        requestData = JSON.parse(text);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
      }

      const { imageUrl, locale } = requestData;

      if (!imageUrl) {
        return Response.json({ error: "No image URL provided" }, { status: 400 });
      }

      const imageResponse = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}${imageUrl}`);

      if (!imageResponse.ok) {
        return Response.json(
          {
            error: `Failed to fetch image from ${`${process.env.PAYLOAD_PUBLIC_SERVER_URL}${imageUrl}`}`,
          },
          { status: 500 },
        );
      }

      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageArrayBuffer).toString("base64");

      const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

      const { altTextPrompt } = await getSettings(req);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: altTextPrompt.replace("{locale}", locale),
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${contentType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0,
      });

      const altText = response.choices[0]?.message?.content || "No description generated";

      return Response.json({ altText });
    } catch (error) {
      console.error("Error generating alt text:", error);
      return Response.json(
        { error: error instanceof Error ? error.message : "Failed to generate alt text" },
        { status: 500 },
      );
    }
  },
};
