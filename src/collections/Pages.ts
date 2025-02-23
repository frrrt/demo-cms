import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { ROLE_ADMIN, ROLE_EDITOR } from "@/custom-fields/rbac/roles";
import { validateAlphaNumeric } from "@/validation/validateAlphaNumeric";
import { CollectionConfig } from "payload";

const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    read: () => true,
    create: rbacHas(ROLE_EDITOR),
    update: rbacHas(ROLE_EDITOR),
    delete: rbacHas(ROLE_ADMIN),
    readVersions: () => true,
  },
  admin: {
    useAsTitle: "title",
    listSearchableFields: ["title", "slug"],
    // livePreview: createLivePreview(
    //   ({ host, data, locale }) =>
    //     `${host}/${locale.code}/preview/page-preview?token=iwhef9823rh24r2hfsfh89234rlajkcvmni45r&pageSlug=${data.id}`,
    // ),
  },
  fields: [
    {
      name: "id",
      label: "Slug",
      type: "text",
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
