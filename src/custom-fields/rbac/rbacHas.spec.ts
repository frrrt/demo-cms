import { ROLE, ROLE_ADMIN, ROLE_EDITOR, ROLE_TRANSLATOR } from "./roles";
import { rbacHas } from "./rbacHas";
import { PayloadRequest } from "payload";

// Helper function to create properly typed test objects
const createPayloadRequest = (user?: { id: string; roles: number }): { req: PayloadRequest } => ({
  req: {
    user,
  } as PayloadRequest,
});

describe("rbacHas", () => {
  describe("authentication checks", () => {
    it("should return false when user is not authenticated", () => {
      const checkAccess = rbacHas(ROLE_EDITOR);
      expect(checkAccess(createPayloadRequest())).toBe(false);
      expect(checkAccess(createPayloadRequest(undefined))).toBe(false);
      // @ts-expect-error Testing edge case
      expect(checkAccess(createPayloadRequest(null))).toBe(false);
    });

    it("should return false when user exists but roles is not an integer", () => {
      const checkAccess = rbacHas(ROLE_EDITOR);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: "not-a-number" as unknown as number,
          }),
        ),
      ).toBe(false);
    });
  });

  describe("single role checks", () => {
    it("should return true when user has the exact role", () => {
      const checkEditor = rbacHas(ROLE_EDITOR);
      const checkTranslator = rbacHas(ROLE_TRANSLATOR);

      expect(
        checkEditor(
          createPayloadRequest({
            id: "1",
            roles: ROLE_EDITOR,
          }),
        ),
      ).toBe(true);

      expect(
        checkTranslator(
          createPayloadRequest({
            id: "1",
            roles: ROLE_TRANSLATOR,
          }),
        ),
      ).toBe(true);
    });

    it("should return true when user has admin role", () => {
      const checkEditor = rbacHas(ROLE_EDITOR);
      const checkTranslator = rbacHas(ROLE_TRANSLATOR);

      const adminRequest = createPayloadRequest({
        id: "1",
        roles: ROLE_ADMIN,
      });

      expect(checkEditor(adminRequest)).toBe(true);
      expect(checkTranslator(adminRequest)).toBe(true);
    });

    it("should return false when user does not have the required role", () => {
      const checkEditor = rbacHas(ROLE_EDITOR);
      expect(
        checkEditor(
          createPayloadRequest({
            id: "1",
            roles: ROLE_TRANSLATOR,
          }),
        ),
      ).toBe(false);
    });
  });

  describe("multiple role checks", () => {
    it("should return true when user has any of the required roles", () => {
      const checkAccess = rbacHas([ROLE_EDITOR, ROLE_TRANSLATOR]);

      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: ROLE_EDITOR,
          }),
        ),
      ).toBe(true);

      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: ROLE_TRANSLATOR,
          }),
        ),
      ).toBe(true);
    });

    it("should return true when user has admin role", () => {
      const checkAccess = rbacHas([ROLE_EDITOR, ROLE_TRANSLATOR]);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: ROLE_ADMIN,
          }),
        ),
      ).toBe(true);
    });

    it("should return true when user has multiple roles including any required role", () => {
      const checkAccess = rbacHas([ROLE_EDITOR, ROLE_TRANSLATOR]);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: ROLE_EDITOR | ROLE_TRANSLATOR,
          }),
        ),
      ).toBe(true);
    });

    it("should return false when user has none of the required roles", () => {
      const checkAccess = rbacHas([ROLE_EDITOR, ROLE_TRANSLATOR]);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: 8,
          }),
        ),
      ).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty array of roles", () => {
      const checkAccess = rbacHas([]);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: ROLE_EDITOR,
          }),
        ),
      ).toBe(false);
    });

    it("should handle zero as role value", () => {
      const checkAccess = rbacHas(0 as ROLE);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: ROLE_EDITOR,
          }),
        ),
      ).toBe(false);
    });

    it("should handle user with no roles", () => {
      const checkAccess = rbacHas(ROLE_EDITOR);
      expect(
        checkAccess(
          createPayloadRequest({
            id: "1",
            roles: 0,
          }),
        ),
      ).toBe(false);
    });
  });
});
