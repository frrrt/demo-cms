import { getTranslationUrl } from "./getTranslationUrl";

describe("getTranslationUrl", () => {
  it("should construct URL with basic parameters", () => {
    const url = getTranslationUrl("en", "hello", "greeting");

    expect(url).toBe(`/api/translate-string?locale=en&term=hello&context=%22greeting%22`);
  });

  it("should properly encode special characters in term", () => {
    const url = getTranslationUrl("de", "hello & goodbye", "greeting");

    expect(url).toBe(
      `/api/translate-string?locale=de&term=hello+%26+goodbye&context=%22greeting%22`,
    );
  });

  it("should handle special characters in locale", () => {
    const url = getTranslationUrl("zh-CN", "welcome", "greeting");

    expect(url).toBe(`/api/translate-string?locale=zh-CN&term=welcome&context=%22greeting%22`);
  });

  it("should handle empty context", () => {
    const url = getTranslationUrl("es", "cancel", "");

    expect(url).toBe(`/api/translate-string?locale=es&term=cancel&context=%22%22`);
  });

  it("should handle context with special characters", () => {
    const context = "button/primary&secondary";
    const url = getTranslationUrl("it", "save", context);

    expect(url).toBe(
      `/api/translate-string?locale=it&term=save&context=%22button%2Fprimary%26secondary%22`,
    );
  });
});
