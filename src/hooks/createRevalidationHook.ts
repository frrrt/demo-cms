import { DEFAULT_LOCALE } from "@/const/locales";
import { PayloadRequest } from "payload";

export function createRevalidationHook<T extends { id: string }>(
  tagGenerator: (doc: T, locale?: string) => string[],
) {
  return async function revalidateContent({ doc, req }: { doc: T; req: PayloadRequest }) {
    const tags = tagGenerator(doc, req.locale || DEFAULT_LOCALE);

    try {
      const response = await fetch(`${process.env.NEXTJS_FRONTEND_URL}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: process.env.REVALIDATION_TOKEN,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }
    } catch (error) {
      req.payload.logger.error(
        `Error revalidating tags: '${tags.join(", ")}' for document: '${doc.id}'.`,
        error,
      );
    }
  };
}
