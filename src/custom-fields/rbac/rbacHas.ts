import { PayloadRequest } from "payload";
import { ROLE, isAuthenticated, ROLE_ADMIN } from "./roles";

// This can either take a role or an array of roles to check against as argument.
// Needs to be payload user. Admin is always allowed. Performs and OR check, aka
// if user has any of the roles or is an admin.
export function rbacHas(roles: ROLE | ROLE[]) {
  // Convert input roles to a single combined bitmap
  const combinedRoles = Array.isArray(roles) ? roles.reduce((acc, role) => acc | role, 0) : roles;

  return ({ req: { user } }: { req: PayloadRequest }) => {
    if (!isAuthenticated(user)) {
      return false;
    }

    // Admin always has access
    if ((user.roles & ROLE_ADMIN) === ROLE_ADMIN) {
      return true;
    }

    return (user.roles & combinedRoles) !== 0;
  };
}
