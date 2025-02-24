import { validateQueryParams } from "./validateQueryParams";
import { LOCALES } from "@/const/locales";
import type { PayloadRequest } from "payload";

describe("validateQueryParams", () => {
  const createMockRequest = (query: Record<string, unknown>): PayloadRequest =>
    ({
      query,
    }) as PayloadRequest;

  describe("valid queries", () => {
    it("should validate query with all required fields", () => {
      const mockRequest = createMockRequest({
        locale: LOCALES[0],
        term: "hello",
        context: "greeting",
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toEqual({
        locale: LOCALES[0],
        term: "hello",
        context: "greeting",
      });
    });

    it("should validate query with different valid locale", () => {
      const mockRequest = createMockRequest({
        locale: LOCALES[1],
        term: "test",
        context: "testing",
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toEqual({
        locale: LOCALES[1],
        term: "test",
        context: "testing",
      });
    });
  });

  describe("invalid queries", () => {
    it("should return false for missing locale", () => {
      const mockRequest = createMockRequest({
        term: "hello",
        context: "greeting",
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for invalid locale", () => {
      const mockRequest = createMockRequest({
        locale: "invalid-locale",
        term: "hello",
        context: "greeting",
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for missing term", () => {
      const mockRequest = createMockRequest({
        locale: LOCALES[0],
        context: "greeting",
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for missing context", () => {
      const mockRequest = createMockRequest({
        locale: LOCALES[0],
        term: "hello",
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should return false for empty query object", () => {
      const mockRequest = createMockRequest({});
      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for null query values", () => {
      const mockRequest = createMockRequest({
        locale: null,
        term: null,
        context: null,
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for undefined query values", () => {
      const mockRequest = createMockRequest({
        locale: undefined,
        term: undefined,
        context: undefined,
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for non-string values", () => {
      const mockRequest = createMockRequest({
        locale: LOCALES[0],
        term: 123,
        context: true,
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });

    it("should return false for array values", () => {
      const mockRequest = createMockRequest({
        locale: LOCALES[0],
        term: ["hello"],
        context: ["greeting"],
      });

      const result = validateQueryParams(mockRequest);
      expect(result).toBe(false);
    });
  });
});
