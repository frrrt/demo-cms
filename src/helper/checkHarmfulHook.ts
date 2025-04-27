import { Comment } from "@/payload-types";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { PayloadRequest } from "payload";
import { z } from "zod";

export const checkHarmfulHook = async ({
  data,
  req,
}: {
  data: Partial<Comment>;
  req: PayloadRequest;
}) => {
  console.log("checkHarmfulHook", data, data.isHarmful);
  // Once isHarmful is set, do not re-validate with AI
  if (data.isHarmful != undefined) {
    return data;
  }

  const settings = await req.payload.findGlobal({
    slug: "settings",
  });

  const openai = new OpenAI();
  const completion = await openai.beta.chat.completions.parse({
    model: settings.chatgptModel,
    messages: [
      {
        role: "system",
        content: settings.harmfulContentPrompt,
      },
      {
        role: "user",
        content: `User: ${data.authorName} Comment: ${data.commentText}`,
      },
    ],
    response_format: zodResponseFormat(
      z.object({
        isHarmful: z.boolean(),
        harmfulReason: z.string(),
      }),
      "isHarmful",
    ),
  });

  if (completion.choices[0]?.message?.parsed?.isHarmful !== undefined) {
    data.isHarmful = completion.choices[0].message.parsed.isHarmful;
    data.harmfulReason = completion.choices[0].message.parsed.harmfulReason;
  } else {
    throw new Error("Unable to determine if the content is harmful");
  }

  return data;
};
