import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { ROLE_ADMIN, ROLE_EDITOR } from "@/custom-fields/rbac/roles";
import { createRevalidationHook } from "@/hooks/createRevalidationHook";
import { Page } from "@/payload-types";
import { validateAlphaNumeric } from "@/validation/validateAlphaNumeric";
import { CollectionConfig } from "payload";

const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    read: () => true,
    // Only editors and admins can create and update pages.
    create: rbacHas(ROLE_EDITOR),
    update: rbacHas(ROLE_EDITOR),
    delete: rbacHas(ROLE_ADMIN),
  },
  admin: {
    useAsTitle: "title",
    listSearchableFields: ["title", "slug"],
    livePreview: {
      url: ({ data, req }) =>
        `${process.env.NEXTJS_FRONTEND_URL}/${req.locale}/page-preview?token=${process.env.PREVIEW_TOKEN}&slug=${data.id}`,
    },
  },
  hooks: {
    afterChange: [createRevalidationHook((doc: Page, locale?: string) => `${locale}-${doc.id}`)],
  },
  fields: [
    {
      name: "id",
      label: "Slug",
      type: "text",
      // Custom ID field, since the ID is used by Payload in the URL, it needs to follow certain rules as not to break the application.
      // / and . obviously dont work for example.
      validate: validateAlphaNumeric("Slug"),
    },
    {
      name: "title",
      label: "Title",
      type: "text",
      localized: true,
      admin: {
        components: {
          Field: "@/custom-fields/translation/TranslateField",
        },
      },
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "text",
      localized: true,
      admin: {
        components: {
          Field: "@/custom-fields/translation/TranslateField",
        },
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: false,
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      localized: true,
    },
  ],
  versions: {
    drafts: true,
  },
};

export default Pages;
