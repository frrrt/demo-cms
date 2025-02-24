import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { isUser, ROLE_ADMIN, ROLE_EDITOR, ROLE_TRANSLATOR } from "@/custom-fields/rbac/roles";
import { validateAlphaNumeric } from "@/validation/validateAlphaNumeric";
import { CollectionConfig } from "payload";

export const UISTRING_SLUG = "ui-strings";

const UIStrings: CollectionConfig = {
  slug: UISTRING_SLUG,
  labels: {
    singular: "UI String",
    plural: "UI Strings",
  },
  access: {
    read: () => true,
    create: rbacHas(ROLE_ADMIN),
    // OR check for editor and translator roles.
    update: rbacHas([ROLE_TRANSLATOR, ROLE_EDITOR]),
    delete: rbacHas(ROLE_ADMIN),
    readVersions: () => true,
  },
  versions: true,
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      unique: true,
      // because we have a custom id field, at least slashes and dots will break payload as they are used in the url
      validate: validateAlphaNumeric("ID"),
    },
    {
      name: "defaultLanguageText",
      type: "ui",
      admin: {
        components: {
          Field: "@/custom-fields/default-language-text/DefaultLanguageTextField",
          Cell: "@/custom-fields/default-language-text/DefaultLanguageTextCell",
        },
      },
    },
    {
      name: "text",
      type: "text",
      label: "Text",
      // Must NOT be required, as we want to be able to have empty strings for some locales.
      // It also helps with certain import/export features.
      required: false,
      localized: true,
      admin: {
        components: {
          Field: "@/custom-fields/translation/TranslateField",
        },
      },
    },
    {
      name: "description",
      label: "Description",
      type: "text",
    },
    {
      name: "context-image",
      label: "Context Image",
      type: "upload",
      relationTo: "ui-string-media",
      access: {
        // The images are only for internal use to help the translators understand the context of the string,
        // so we restrict them with field level access.
        read: isUser,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Remove empty text fields from the data object, otherwise filtering for these
        // items in the admin UI will not work anymore
        if (data.text === "") {
          delete data.text;
        }

        return data;
      },
    ],
  },
  admin: {
    listSearchableFields: ["description", "text"],
  },
};

export default UIStrings;
