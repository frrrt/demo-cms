import { isUser, ROLE_ADMIN } from "./roles";
import { rbacHas } from "./rbacHas";
import { Field } from "payload";

const rbacField: Field = {
  name: "roles",
  label: "Roles",
  type: "number",
  defaultValue: 0,
  saveToJWT: true,
  required: true,
  admin: {
    components: {
      Field: "@/custom-fields/rbac/InputField",
      Cell: "@/custom-fields/rbac/Cell",
    },
  },
  // Field level access control. In this case, only admins can create and update the roles.
  access: {
    create: rbacHas(ROLE_ADMIN),
    read: isUser,
    update: rbacHas(ROLE_ADMIN),
  },
};

export default rbacField;
