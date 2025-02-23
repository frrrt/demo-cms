import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { isUser, ROLE_ADMIN, ROLE_TRANSLATOR } from "@/custom-fields/rbac/roles";
import { CollectionConfig } from "payload";

export const UiStringMedia: CollectionConfig = {
  slug: "ui-string-media",
  labels: {
    singular: "UI String Media",
    plural: "UI String Media",
  },
  access: {
    read: isUser,
    create: rbacHas(ROLE_TRANSLATOR),
    update: rbacHas(ROLE_TRANSLATOR),
    delete: rbacHas(ROLE_ADMIN),
  },
  fields: [],
  upload: true,
};
