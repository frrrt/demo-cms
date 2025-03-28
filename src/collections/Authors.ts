import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { ROLE_ADMIN, ROLE_EDITOR } from "@/custom-fields/rbac/roles";
import { CollectionConfig } from "payload";

const Authors: CollectionConfig = {
  slug: "authors",
  access: {
    read: () => true,
    create: rbacHas(ROLE_ADMIN),
    update: rbacHas(ROLE_EDITOR),
    delete: rbacHas(ROLE_ADMIN),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      admin: {
        description: "Author's email address (must be unique)",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      label: "Profile Picture",
    },
    {
      name: "bio",
      type: "richText",
      label: "Biography",
    },
    {
      name: "expertise",
      type: "array",
      label: "Areas of Expertise",
      fields: [
        {
          name: "topic",
          type: "text",
          required: true,
        },
      ],
      admin: {
        description: "Add topics this author specializes in",
      },
    },
  ],
  admin: {
    useAsTitle: "name",
  },
};

export default Authors;
