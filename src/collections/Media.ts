import { createRevalidationHook } from "@/hooks/createRevalidationHook";
import type { Media } from "@/payload-types";
import type { CollectionConfig } from "payload";

const Media: CollectionConfig = {
  slug: "media",
  access: {
    // These are public images, so access is always granted.
    read: () => true,
    // Other operations like create, update, and delete are not allowed by default.
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      admin: {
        components: {
          Field: "@/custom-fields/alt-text/AltTextField",
        },
      },
    },
  ],
  hooks: {
    afterChange: [
      createRevalidationHook<Media>(async ({ doc, req }) => {
        const pages = await req.payload.find({
          collection: "pages",
          where: {
            image: {
              equals: doc.id,
            },
          },
          depth: 0,
        });

        return pages.docs.map((page) => `page-${page.id}`);
      }),
    ],
  },
  upload: true,
};

export default Media;
