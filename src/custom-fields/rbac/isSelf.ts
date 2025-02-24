import { PayloadRequest } from "payload";
import { rbacHas } from "./rbacHas";
import { isUser, ROLE_ADMIN } from "./roles";

export function isSelf({ req }: { req: PayloadRequest }) {
  if (isUser({ req }) && req.user?.email === req.data?.email) {
    return true;
  }

  return rbacHas(ROLE_ADMIN)({ req });
}
