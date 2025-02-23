import type { PayloadRequest } from "payload";

export async function getSettings(req: PayloadRequest) {
  const settings = await req.payload.findGlobal({
    slug: "settings",
  });

  const model = settings.chatgptModel ?? "gpt-4-turbo-preview";
  const askChatgptPrompt = settings.askChatgptPrompt ?? "";
  return { askChatgptPrompt, model };
}
