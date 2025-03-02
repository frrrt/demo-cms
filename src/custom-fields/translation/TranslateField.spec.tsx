import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TranslateField from "./TranslateField";
import { DEFAULT_LOCALE } from "@/const/locales";
import * as PayloadUI from "@payloadcms/ui";
import useSWR from "swr";
import type { ReactNode, ChangeEvent } from "react";

jest.mock("swr");
jest.mock("@payloadcms/ui", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  FieldLabel: ({ label }: { label: string }) => <label>{label}</label>,
  TextInput: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    readOnly: boolean;
  }) => <input value={value} onChange={onChange} readOnly={readOnly} />,
  useDocumentInfo: jest.fn(),
  useField: jest.fn(),
  useLocale: jest.fn(),
}));

describe("TranslateField", () => {
  const mockSetValue = jest.fn();
  const mockPath = "title";

  beforeEach(() => {
    jest.clearAllMocks();

    (PayloadUI.useDocumentInfo as jest.Mock).mockReturnValue({
      id: "123",
      collectionSlug: "posts",
    });

    (PayloadUI.useField as jest.Mock).mockReturnValue({
      value: "",
      setValue: mockSetValue,
    });

    (PayloadUI.useLocale as jest.Mock).mockReturnValue({
      code: "en",
    });

    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key && key.includes("/api/posts/")) {
        return {
          data: { [mockPath]: "" },
          error: null,
          isLoading: false,
        };
      }
      return {
        data: null,
        error: null,
        isLoading: false,
      };
    });
  });

  it("should not render when document ID is missing", () => {
    (PayloadUI.useDocumentInfo as jest.Mock).mockReturnValue({});

    const { container } = render(
      <TranslateField path={mockPath} readOnly={false} field={{ name: "test" }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render input field with correct locale label", () => {
    (PayloadUI.useLocale as jest.Mock).mockReturnValue({
      code: "fr",
    });

    render(<TranslateField path={mockPath} readOnly={false} field={{ name: "test" }} />);

    expect(screen.getByText("Text (fr)")).toBeInTheDocument();
  });

  it("should not show translation options for default locale", () => {
    (PayloadUI.useLocale as jest.Mock).mockReturnValue({
      code: DEFAULT_LOCALE,
    });

    render(<TranslateField path={mockPath} readOnly={false} field={{ name: "test" }} />);

    expect(screen.queryByText("Ask ChatGPT")).not.toBeInTheDocument();
  });

  it("should show disabled translation button when term is empty", () => {
    (PayloadUI.useLocale as jest.Mock).mockReturnValue({
      code: "fr",
    });

    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key && key.includes("/api/posts/")) {
        return {
          data: { [mockPath]: "" },
          error: null,
        };
      }
      return {
        data: null,
        error: null,
      };
    });

    render(<TranslateField path={mockPath} readOnly={false} field={{ name: "test" }} />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Ask ChatGPT");
  });

  it("should show error when translation fetch fails", async () => {
    (PayloadUI.useLocale as jest.Mock).mockReturnValue({
      code: "fr",
    });

    let fetchCount = 0;
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key && key.includes("/api/posts/")) {
        return {
          data: { [mockPath]: "Hello" },
          error: null,
        };
      }

      fetchCount++;
      if (fetchCount > 1) {
        return {
          data: null,
          error: new Error("Translation failed"),
          isLoading: false,
        };
      }
      return { data: null, error: null, isLoading: false };
    });

    render(<TranslateField path={mockPath} readOnly={false} field={{ name: "test" }} />);

    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Translation request failed/i)).toBeInTheDocument();
    });
  });

  it("should display translation select when translations are available", async () => {
    (PayloadUI.useLocale as jest.Mock).mockReturnValue({
      code: "fr",
    });

    const mockTranslations = ["Bonjour", "Salut"];
    let fetchCount = 0;

    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key && key.includes("/api/posts/")) {
        return {
          data: { [mockPath]: "Hello" },
          error: null,
        };
      }

      fetchCount++;
      if (fetchCount > 1) {
        return {
          data: mockTranslations,
          error: null,
          isLoading: false,
        };
      }
      return { data: null, error: null, isLoading: false };
    });

    render(<TranslateField path={mockPath} readOnly={false} field={{ name: "test" }} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
      mockTranslations.forEach((translation) => {
        expect(screen.getByText(translation)).toBeInTheDocument();
      });
    });
  });

  it("should handle readOnly prop correctly", () => {
    render(<TranslateField path={mockPath} readOnly={true} field={{ name: "test" }} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");

    const button = screen.queryByText("Ask ChatGPT");
    expect(button).toBeDisabled();
  });
});
