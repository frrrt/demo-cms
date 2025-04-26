import { User } from "@/payload-types";
import { PayloadRequest } from "payload";

// Roles are stored as a bitmap. This allows for easy checking of multiple roles
// at once. For example, if a user has both ROLE_ADMIN and ROLE_EDITOR, the roles
// field would be ROLE_ADMIN | ROLE_EDITOR.
// It is also very fast, although string based roles should generally work equally
// well for most use cases. Bitmaps are restricted to less roles, but it would
// likely be a mistake to have too many roles anyway.
//
// Bitmaps are more of a amusement than a necessity in this case.
export const ROLE_ADMIN = 1;
export const ROLE_EDITOR = 2;
export const ROLE_TRANSLATOR = 4;
export const ROLE_MODERATOR = 4;

export type ROLE =
  | typeof ROLE_ADMIN
  | typeof ROLE_EDITOR
  | typeof ROLE_TRANSLATOR
  | typeof ROLE_MODERATOR;

export const ROLES = [
  { label: "Admin", value: ROLE_ADMIN },
  { label: "Editor", value: ROLE_EDITOR },
  { label: "Translator", value: ROLE_TRANSLATOR },
  { label: "Moderator", value: ROLE_MODERATOR },
];

export function isAuthenticated(user: User | null | undefined): user is User {
  return !!user && typeof user.id === "string" && Number.isInteger(user.roles);
}

// Authentication actually happens payload internal, BUT if a user object is on the
// request object, the user is authenticated.
export function isUser({ req }: { req: PayloadRequest }) {
  return isAuthenticated(req.user);
}
