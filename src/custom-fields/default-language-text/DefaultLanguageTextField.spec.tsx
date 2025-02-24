import React from "react";
import { render, screen } from "@testing-library/react";
import DefaultLanguageTextField from "./DefaultLanguageTextField";
import { DEFAULT_LOCALE } from "@/const/locales";

jest.mock("@payloadcms/ui", () => ({
  FieldLabel: ({ path, label }: { path: string; label: string }) => (
    <div data-testid="field-label">
      {path}: {label}
    </div>
  ),
}));

jest.mock("./DefaultLanguageTextCell", () => {
  return jest.fn(({ rowData }) => <div data-testid="default-language-text-cell">ID: {rowData.id}</div>);
});

describe("DefaultLanguageTextField", () => {
  const defaultProps = {
    path: "test-path",
    data: { id: "123" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render when data.id is present", () => {
      render(<DefaultLanguageTextField {...defaultProps} />);

      expect(screen.getByTestId("field-label")).toBeInTheDocument();
      expect(screen.getByTestId("default-language-text-cell")).toBeInTheDocument();
    });

    it("should not render anything when data.id is missing", () => {
      const { container } = render(<DefaultLanguageTextField path={defaultProps.path} data={{}} />);

      expect(container.firstChild).toBeNull();
    });

    it("should render correct label with DEFAULT_LOCALE", () => {
      render(<DefaultLanguageTextField {...defaultProps} />);

      expect(screen.getByTestId("field-label")).toHaveTextContent(
        `${defaultProps.path}: Default Language Text ${DEFAULT_LOCALE}`,
      );
    });
  });

  describe("component structure", () => {
    it("should pass correct props to DefaultLanguageTextCell", () => {
      render(<DefaultLanguageTextField {...defaultProps} />);

      const cell = screen.getByTestId("default-language-text-cell");
      expect(cell).toHaveTextContent(`ID: ${defaultProps.data.id}`);
    });

    it("should have correct className", () => {
      render(<DefaultLanguageTextField {...defaultProps} />);

      const container = screen.getByTestId("field-label").parentElement;
      expect(container).toHaveClass("field-type");
      expect(container).toHaveClass("default-language-text-field");
    });
  });
});
