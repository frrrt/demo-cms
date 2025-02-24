import rbacField from "@/custom-fields/rbac/rbacFields";
import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { ROLE_ADMIN } from "@/custom-fields/rbac/roles";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      unique: true,
      access: {
        read: () => true,
        create: rbacHas(ROLE_ADMIN),
        update: rbacHas(ROLE_ADMIN),
      },
    },
    // Adding roles to user
    rbacField,
  ],
};
