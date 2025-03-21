import type { PayloadRequest } from "payload";

export async function getSettings(req: PayloadRequest) {
  return await req.payload.findGlobal({
    slug: "settings",
  });
}
