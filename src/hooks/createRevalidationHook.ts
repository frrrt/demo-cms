import { PayloadRequest } from "payload";

export function createRevalidationHook<T extends { id: string }>(
  tagGenerator: (doc: T) => string[],
) {
  return async function revalidateContent({ doc, req }: { doc: T; req: PayloadRequest }) {
    const tags = tagGenerator(doc);

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
