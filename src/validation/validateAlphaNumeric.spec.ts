import { validateAlphaNumeric } from "./validateAlphaNumeric";

describe("validateAlphaNumeric", () => {
  describe("type validation", () => {
    it("should return error message when value is not a string", () => {
      const validate = validateAlphaNumeric("username");

      expect(validate(123)).toBe("username must be a string");
      expect(validate(null)).toBe("username must be a string");
      expect(validate(undefined)).toBe("username must be a string");
      expect(validate({})).toBe("username must be a string");
      expect(validate([])).toBe("username must be a string");
    });
  });

  describe("empty value validation", () => {
    it("should return error message when string is empty", () => {
      const validate = validateAlphaNumeric("username");
      expect(validate("")).toBe("username cannot be empty");
    });
  });

  describe("character validation", () => {
    it("should return true for valid alphanumeric strings", () => {
      const validate = validateAlphaNumeric("username");

      expect(validate("user123")).toBe(true);
      expect(validate("USER123")).toBe(true);
      expect(validate("user-123")).toBe(true);
      expect(validate("123")).toBe(true);
      expect(validate("abc")).toBe(true);
      expect(validate("a-b-c")).toBe(true);
    });

    it("should return error message for strings with invalid characters", () => {
      const validate = validateAlphaNumeric("username");
      const errorMsg = "username can only contain alphanumeric characters and hyphens";

      expect(validate("user_123")).toBe(errorMsg);
      expect(validate("user 123")).toBe(errorMsg);
      expect(validate("user@123")).toBe(errorMsg);
      expect(validate("user.123")).toBe(errorMsg);
      expect(validate("user#123")).toBe(errorMsg);
      expect(validate("user$123")).toBe(errorMsg);
      expect(validate("user+123")).toBe(errorMsg);
    });
  });

  describe("field name customization", () => {
    it("should include custom field name in error messages", () => {
      const validateEmail = validateAlphaNumeric("email");
      const validatePassword = validateAlphaNumeric("password");

      expect(validateEmail("user@123")).toBe("email can only contain alphanumeric characters and hyphens");
      expect(validatePassword("")).toBe("password cannot be empty");
      expect(validatePassword(123)).toBe("password must be a string");
    });
  });
});
