import type { PayloadRequest } from "payload";

export function createRevalidationHook<T extends { id: string }>(
  tagGenerator: ({ doc, req }: { doc: T; req: PayloadRequest }) => string[] | Promise<string[]>,
) {
  return async function revalidateContent({ doc, req }: { doc: T; req: PayloadRequest }) {
    const tags = await tagGenerator({ doc, req });

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
