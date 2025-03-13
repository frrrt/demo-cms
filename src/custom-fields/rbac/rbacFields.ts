import { ROLE_ADMIN } from "./roles";
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
      Field: "@/custom-fields/rbac/RolesField",
      Cell: "@/custom-fields/rbac/RolesCell",
    },
  },
  // Create and read access need to be set to true here!
  // a) Users should be able to see all roles by other users as well.
  //    The user collection has the access read restricted to only users
  //    so it also applies to roles which thereby are not exposed via the
  //    APIs.
  // b) For initial setup, the user needs to be able to create roles for
  //    the first user. As a payload quirk, this is possible for default
  //    fields but not the roles. Hence, this needs to be true, the user
  //    collection itself again will restrict any creation of users to
  //    Admins anyway.
  access: {
    create: () => true,
    read: () => true,
    update: rbacHas(ROLE_ADMIN),
  },
};

export default rbacField;
