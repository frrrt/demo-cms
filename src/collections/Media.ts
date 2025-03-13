import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
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
  upload: true,
};
