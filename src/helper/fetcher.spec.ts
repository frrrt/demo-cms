import { fetcher } from "./fetcher";

describe("fetcher", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should call fetch with the provided URL", async () => {
    const mockData = { test: "data" };
    const mockResponse = { json: () => Promise.resolve(mockData) };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const url = "https://api.example.com/data";
    const result = await fetcher(url);

    expect(global.fetch).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockData);
  });

  it("should return JSON response from the fetch call", async () => {
    const mockData = { key: "value", numbers: [1, 2, 3] };
    const mockResponse = { json: () => Promise.resolve(mockData) };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await fetcher("https://api.example.com/data");

    expect(result).toEqual(mockData);
  });

  it("should throw an error when fetch fails", async () => {
    const mockError = new Error("Network error");
    global.fetch = jest.fn().mockRejectedValue(mockError);

    await expect(fetcher("https://api.example.com/data")).rejects.toThrow("Network error");
  });

  it("should throw an error when json parsing fails", async () => {
    const mockResponse = {
      json: () => Promise.reject(new Error("Invalid JSON")),
    };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    await expect(fetcher("https://api.example.com/data")).rejects.toThrow("Invalid JSON");
  });
});
