import { validateTranslationResponse } from "./validateTranslationResponse";
import type OpenAI from "openai";

describe("validateTranslationResponse", () => {
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const createMockCompletion = (args: string): OpenAI.Chat.Completions.ChatCompletion => ({
    id: "test-id",
    choices: [
      {
        message: {
          role: "assistant",
          content: null,
          tool_calls: [
            {
              id: "call-id",
              type: "function",
              function: {
                name: "translate",
                arguments: args,
              },
            },
          ],
        },
        finish_reason: "stop",
        index: 0,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any,
    created: 123456789,
    model: "gpt-4",
    object: "chat.completion",
  });

  describe("valid responses", () => {
    it("should return translations array for valid response", () => {
      const mockCompletion = createMockCompletion(
        JSON.stringify({
          translations: ["Hello", "World"],
        }),
      );

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual(["Hello", "World"]);
    });

    it("should handle single translation", () => {
      const mockCompletion = createMockCompletion(
        JSON.stringify({
          translations: ["Hello"],
        }),
      );

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual(["Hello"]);
    });
  });

  describe("invalid responses", () => {
    it("should return empty array for undefined completion", () => {
      const result = validateTranslationResponse(undefined);
      expect(result).toEqual([]);
    });

    it("should return empty array and log error for invalid JSON", () => {
      const mockCompletion = createMockCompletion("invalid json");

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error processing response:", expect.any(String));
    });

    it("should return empty array and log error for missing translations field", () => {
      const mockCompletion = createMockCompletion(
        JSON.stringify({
          wrongField: ["Hello"],
        }),
      );

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error processing response:", expect.any(String));
    });

    it("should return empty array and log error for non-array translations", () => {
      const mockCompletion = createMockCompletion(
        JSON.stringify({
          translations: "not an array",
        }),
      );

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error processing response:", expect.any(String));
    });

    it("should return empty array and log error for non-string array elements", () => {
      const mockCompletion = createMockCompletion(
        JSON.stringify({
          translations: [1, 2, 3],
        }),
      );

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error processing response:", expect.any(String));
    });

    it("should return empty array and log error for empty translations array", () => {
      const mockCompletion = createMockCompletion(
        JSON.stringify({
          translations: [],
        }),
      );

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Empty translations array from ChatGPT");
    });
  });

  describe("edge cases", () => {
    it("should handle missing tool_calls", () => {
      const mockCompletion: OpenAI.Chat.Completions.ChatCompletion = {
        id: "test-id",
        choices: [
          {
            message: {
              role: "assistant",
              content: null,
            },
            finish_reason: "stop",
            index: 0,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any,
        created: 123456789,
        model: "gpt-4",
        object: "chat.completion",
      };

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
    });

    it("should handle null arguments in tool_calls", () => {
      const mockCompletion = createMockCompletion("null");

      const result = validateTranslationResponse(mockCompletion);
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Error processing response:", expect.any(String));
    });

    it("should handle unknown error types", () => {
      const originalJSONParse = JSON.parse;
      JSON.parse = jest.fn().mockImplementation(() => {
        throw "some error";
      });

      const mockCompletion = createMockCompletion("{}");
      const result = validateTranslationResponse(mockCompletion);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith("Unknown error processing response");

      JSON.parse = originalJSONParse;
    });
  });
});
