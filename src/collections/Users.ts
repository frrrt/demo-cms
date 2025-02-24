import rbacField from "@/custom-fields/rbac/rbacFields";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email added by default
    // Adding roles to user
    rbacField,
  ],
};
