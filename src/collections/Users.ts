import rbacField from "@/custom-fields/rbac/rbacFields";
import { rbacHas } from "@/custom-fields/rbac/rbacHas";
import { isUser, ROLE_ADMIN } from "@/custom-fields/rbac/roles";
import { isSelf } from "@/custom-fields/rbac/isSelf";
import type { CollectionConfig } from "payload";

const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    read: isUser,
    create: rbacHas(ROLE_ADMIN),
    update: isSelf,
    delete: rbacHas(ROLE_ADMIN),
    unlock: rbacHas(ROLE_ADMIN),
  },
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

export default Users;
