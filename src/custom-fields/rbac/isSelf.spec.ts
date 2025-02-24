import { isSelf } from "./isSelf";
import { rbacHas } from "./rbacHas";
import { isUser, ROLE_ADMIN, ROLE_EDITOR } from "./roles";
import { PayloadRequest } from "payload";

jest.mock("./rbacHas", () => ({
  rbacHas: jest.fn(),
}));

jest.mock("./roles", () => ({
  isUser: jest.fn(),
  ROLE_ADMIN: 1,
}));

describe("isSelf", () => {
  const createMockRequest = (
    user?: { email?: string; id?: string; roles?: number },
    data?: { email?: string },
  ): PayloadRequest =>
    ({
      user,
      data,
    }) as PayloadRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    (isUser as jest.Mock).mockImplementation(() => false);
    (rbacHas as jest.Mock).mockImplementation(() => () => false);
  });

  describe("self-check functionality", () => {
    it("should return true when the request is from the same user (emails match)", () => {
      (isUser as jest.Mock).mockReturnValue(true);

      const userEmail = "test@example.com";
      const req = createMockRequest({ email: userEmail, id: "123" }, { email: userEmail });

      const result = isSelf({ req });

      expect(result).toBe(true);
      expect(isUser).toHaveBeenCalledWith({ req });
      expect(rbacHas).not.toHaveBeenCalled();
    });

    it("should return false when emails do not match", () => {
      (isUser as jest.Mock).mockReturnValue(true);
      (rbacHas as jest.Mock).mockImplementation(() => () => false);

      const req = createMockRequest({ email: "user@example.com", id: "123" }, { email: "different@example.com" });

      const result = isSelf({ req });

      expect(result).toBe(false);
      expect(isUser).toHaveBeenCalledWith({ req });
      expect(rbacHas).toHaveBeenCalledWith(ROLE_ADMIN);
    });
  });

  describe("admin check functionality", () => {
    it("should return true when user is an admin", () => {
      (isUser as jest.Mock).mockReturnValue(false);
      const adminCheckMock = jest.fn().mockReturnValue(true);
      (rbacHas as jest.Mock).mockImplementation(() => adminCheckMock);

      const req = createMockRequest(
        { email: "admin@example.com", id: "123", roles: ROLE_ADMIN },
        { email: "user@example.com" },
      );

      const result = isSelf({ req });

      expect(result).toBe(true);
      expect(isUser).toHaveBeenCalledWith({ req });
      expect(rbacHas).toHaveBeenCalledWith(ROLE_ADMIN);
      expect(adminCheckMock).toHaveBeenCalledWith({ req });
    });

    it("should return false when user is neither self nor admin", () => {
      (isUser as jest.Mock).mockReturnValue(false);
      const adminCheckMock = jest.fn().mockReturnValue(false);
      (rbacHas as jest.Mock).mockImplementation(() => adminCheckMock);

      const req = createMockRequest(
        { email: "other@example.com", id: "123", roles: ROLE_EDITOR },
        { email: "user@example.com" },
      );

      const result = isSelf({ req });

      expect(result).toBe(false);
      expect(isUser).toHaveBeenCalledWith({ req });
      expect(rbacHas).toHaveBeenCalledWith(ROLE_ADMIN);
      expect(adminCheckMock).toHaveBeenCalledWith({ req });
    });
  });

  describe("edge cases", () => {
    it("should handle missing user data", () => {
      (isUser as jest.Mock).mockReturnValue(false);
      const adminCheckMock = jest.fn().mockReturnValue(false);
      (rbacHas as jest.Mock).mockImplementation(() => adminCheckMock);

      const req = createMockRequest(undefined, { email: "test@example.com" });

      const result = isSelf({ req });

      expect(result).toBe(false);
      expect(rbacHas).toHaveBeenCalledWith(ROLE_ADMIN);
    });

    it("should handle missing request data", () => {
      (isUser as jest.Mock).mockReturnValue(true);
      const adminCheckMock = jest.fn().mockReturnValue(false);
      (rbacHas as jest.Mock).mockImplementation(() => adminCheckMock);

      const req = createMockRequest({ email: "test@example.com", id: "123" });

      const result = isSelf({ req });

      expect(result).toBe(false);
      expect(rbacHas).toHaveBeenCalledWith(ROLE_ADMIN);
    });
  });
});
