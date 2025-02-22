import { User } from "@/payload-types";
import { PayloadRequest } from "payload";

export const ROLE_ADMIN = 1;
export const ROLE_EDITOR = 2;
export const ROLE_TRANSLATOR = 4;

export type ROLE = typeof ROLE_ADMIN | typeof ROLE_EDITOR | typeof ROLE_TRANSLATOR;

export const ROLES = [
  { label: "Admin", value: ROLE_ADMIN },
  { label: "Editor", value: ROLE_EDITOR },
  { label: "Translator", value: ROLE_TRANSLATOR },
];

export function isAuthenticated(user: User | null | undefined): user is User {
  return !!user && typeof user.id === "string" && Number.isInteger(user.roles);
}

export function isUser({ req }: { req: PayloadRequest }) {
  return isAuthenticated(req.user);
}
