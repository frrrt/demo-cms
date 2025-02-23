import { render, screen, fireEvent } from "@testing-library/react";
import { TranslationSelect } from "./TranslationSelect";

describe("TranslationSelect", () => {
  const mockSetValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render select with default option", () => {
    render(<TranslationSelect setValue={mockSetValue} translations={[]} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    const defaultOption = screen.getByText("Translations:");
    expect(defaultOption).toBeInTheDocument();
    expect(defaultOption).toHaveValue("");
  });

  it("should render all translation options", () => {
    const translations = ["Hello", "Bonjour", "Hola"];

    render(<TranslationSelect setValue={mockSetValue} translations={translations} />);

    translations.forEach((translation) => {
      expect(screen.getByText(translation)).toBeInTheDocument();
    });
  });

  it("should call setValue when selection changes", () => {
    const translations = ["Hello", "Bonjour", "Hola"];

    render(<TranslationSelect setValue={mockSetValue} translations={translations} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Bonjour" } });

    expect(mockSetValue).toHaveBeenCalledWith("Bonjour");
  });

  it("should generate unique keys for duplicate translations", () => {
    const translations = ["Hello", "Hello", "Hello"];

    render(<TranslationSelect setValue={mockSetValue} translations={translations} />);

    const options = screen.getAllByText("Hello");
    expect(options).toHaveLength(3);
  });

  it("should handle empty translations array", () => {
    render(<TranslationSelect setValue={mockSetValue} translations={[]} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1); // Only default option
    expect(options[0]).toHaveTextContent("Translations:");
  });

  it("should handle special characters in translations", () => {
    const translations = ["Hello & Hi", "Bonjour!", "¡Hola!"];

    render(<TranslationSelect setValue={mockSetValue} translations={translations} />);

    translations.forEach((translation) => {
      expect(screen.getByText(translation)).toBeInTheDocument();
    });
  });

  it("should pass the selected value to setValue", () => {
    const translations = ["Hello", "Bonjour", "Hola"];

    render(<TranslationSelect setValue={mockSetValue} translations={translations} />);

    // Test selecting each option
    translations.forEach((translation) => {
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: translation } });
      expect(mockSetValue).toHaveBeenLastCalledWith(translation);
    });
  });
});
