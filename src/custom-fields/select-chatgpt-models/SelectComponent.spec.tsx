import { render, screen, fireEvent } from "@testing-library/react";
import SelectComponent from "./SelectComponent";
import { OptionObject } from "payload";

jest.mock("@payloadcms/ui", () => ({
  useField: jest.fn(),
  SelectInput: ({
    onChange,
    value = "",
    options,
    name,
  }: {
    onChange: (value: { value: string }) => void;
    value: string;
    options: OptionObject[];
    name: string;
  }) => (
    <select
      data-testid="select-input"
      value={value}
      name={name}
      onChange={(e) => onChange({ value: e.target.value })}
    >
      <option value="">Select an option</option>
      {options.map((opt: OptionObject) => (
        <option key={opt.value} value={opt.value}>
          {String(opt.label)}
        </option>
      ))}
    </select>
  ),
}));

import { useField } from "@payloadcms/ui";

describe("SelectComponent", () => {
  const mockPath = "test-field";
  const mockOptions: OptionObject[] = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ];
  const mockSetValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render with initial empty value", () => {
      (useField as jest.Mock).mockReturnValue({
        value: "",
        setValue: mockSetValue,
      });

      render(<SelectComponent path={mockPath} options={mockOptions} />);
      const select = screen.getByTestId("select-input");
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue("");
    });

    it("should render with initial value", () => {
      (useField as jest.Mock).mockReturnValue({
        value: "opt1",
        setValue: mockSetValue,
      });

      render(<SelectComponent path={mockPath} options={mockOptions} />);
      const select = screen.getByTestId("select-input");
      expect(select).toHaveValue("opt1");
    });

    it("should render all options", () => {
      (useField as jest.Mock).mockReturnValue({
        value: "",
        setValue: mockSetValue,
      });

      render(<SelectComponent path={mockPath} options={mockOptions} />);
      mockOptions.forEach((option) => {
        expect(screen.getByText(option.label as string)).toBeInTheDocument();
      });
    });
  });

  describe("value handling", () => {
    it("should handle undefined initial value", () => {
      (useField as jest.Mock).mockReturnValue({
        value: undefined,
        setValue: mockSetValue,
      });

      render(<SelectComponent path={mockPath} options={mockOptions} />);
      const select = screen.getByTestId("select-input");
      expect(select).toHaveValue("");
    });

    it("should handle null initial value", () => {
      (useField as jest.Mock).mockReturnValue({
        value: null,
        setValue: mockSetValue,
      });

      render(<SelectComponent path={mockPath} options={mockOptions} />);
      const select = screen.getByTestId("select-input");
      expect(select).toHaveValue("");
    });
  });

  describe("onChange behavior", () => {
    beforeEach(() => {
      (useField as jest.Mock).mockReturnValue({
        value: "",
        setValue: mockSetValue,
      });
    });

    it("should call setValue with new value when changed", () => {
      render(<SelectComponent path={mockPath} options={mockOptions} />);
      const select = screen.getByTestId("select-input");

      fireEvent.change(select, { target: { value: "opt2" } });
      expect(mockSetValue).toHaveBeenCalledWith("opt2");
    });
  });

  describe("props validation", () => {
    beforeEach(() => {
      (useField as jest.Mock).mockReturnValue({
        value: "",
        setValue: mockSetValue,
      });
    });

    it("should pass path prop correctly to SelectInput", () => {
      render(<SelectComponent path={mockPath} options={mockOptions} />);
      const select = screen.getByTestId("select-input");
      expect(select).toHaveAttribute("name", mockPath);
    });

    it("should pass options prop correctly to SelectInput", () => {
      const customOptions: OptionObject[] = [
        { label: "Custom 1", value: "custom1" },
        { label: "Custom 2", value: "custom2" },
      ];

      render(<SelectComponent path={mockPath} options={customOptions} />);
      customOptions.forEach((option) => {
        expect(screen.getByText(option.label as string)).toBeInTheDocument();
      });
    });
  });
});
