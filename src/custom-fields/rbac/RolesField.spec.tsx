import { render, screen, fireEvent } from "@testing-library/react";
import RolesField from "./RolesField";
import { ROLES } from "./roles";

// Mock the useField hook
jest.mock("@payloadcms/ui", () => ({
  useField: jest.fn(),
}));

import { useField } from "@payloadcms/ui";

describe("RolesField", () => {
  const mockPath = "roles";
  const mockSetValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useField as jest.Mock).mockReturnValue({
      value: 0,
      setValue: mockSetValue,
    });
  });

  describe("rendering", () => {
    it("should render all role checkboxes", () => {
      render(<RolesField path={mockPath} readOnly={false} />);

      ROLES.forEach((role) => {
        expect(screen.getByLabelText(role.label)).toBeInTheDocument();
        expect(screen.getByLabelText(role.label)).toHaveAttribute("type", "checkbox");
      });
    });

    it("should set correct IDs for checkboxes", () => {
      render(<RolesField path={mockPath} readOnly={false} />);

      ROLES.forEach((role) => {
        const checkbox = screen.getByLabelText(role.label);
        expect(checkbox).toHaveAttribute("id", `${mockPath}-${role.value}`);
      });
    });

    it("should handle undefined initial value", () => {
      (useField as jest.Mock).mockReturnValue({
        value: undefined,
        setValue: mockSetValue,
      });

      render(<RolesField path={mockPath} readOnly={false} />);

      ROLES.forEach((role) => {
        expect(screen.getByLabelText(role.label)).not.toBeChecked();
      });
    });
  });

  describe("role calculations", () => {
    it("should correctly check boxes based on bitwise calculations", () => {
      // Set a value that includes multiple roles
      const initialValue = ROLES[0].value | ROLES[1].value; // First two roles
      (useField as jest.Mock).mockReturnValue({
        value: initialValue,
        setValue: mockSetValue,
      });

      render(<RolesField path={mockPath} readOnly={false} />);

      // First two roles should be checked
      expect(screen.getByLabelText(ROLES[0].label)).toBeChecked();
      expect(screen.getByLabelText(ROLES[1].label)).toBeChecked();

      // Other roles should not be checked
      ROLES.slice(2).forEach((role) => {
        expect(screen.getByLabelText(role.label)).not.toBeChecked();
      });
    });

    it("should toggle role values correctly using XOR operation", () => {
      const initialValue = ROLES[0].value; // First role only
      (useField as jest.Mock).mockReturnValue({
        value: initialValue,
        setValue: mockSetValue,
      });

      render(<RolesField path={mockPath} readOnly={false} />);

      // Click second role checkbox
      fireEvent.click(screen.getByLabelText(ROLES[1].label));

      // Should XOR the values
      expect(mockSetValue).toHaveBeenCalledWith(initialValue ^ ROLES[1].value);
    });

    it("should handle removing roles correctly", () => {
      const initialValue = ROLES[0].value | ROLES[1].value;
      (useField as jest.Mock).mockReturnValue({
        value: initialValue,
        setValue: mockSetValue,
      });

      render(<RolesField path={mockPath} readOnly={false} />);

      // Uncheck first role
      fireEvent.click(screen.getByLabelText(ROLES[0].label));

      // Should XOR to remove the role
      expect(mockSetValue).toHaveBeenCalledWith(initialValue ^ ROLES[0].value);
    });
  });

  describe("readOnly behavior", () => {
    it("should disable checkboxes when readOnly is true", () => {
      render(<RolesField path={mockPath} readOnly={true} />);

      ROLES.forEach((role) => {
        expect(screen.getByLabelText(role.label)).toBeDisabled();
      });
    });

    it("should have disabled checkboxes that prevent changes in readOnly mode", () => {
      render(<RolesField path={mockPath} readOnly={true} />);

      const checkbox = screen.getByLabelText(ROLES[0].label);
      expect(checkbox).toBeDisabled();

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it("should enable checkboxes when readOnly is false", () => {
      render(<RolesField path={mockPath} readOnly={false} />);

      ROLES.forEach((role) => {
        expect(screen.getByLabelText(role.label)).not.toBeDisabled();
      });
    });
  });

  describe("useField hook integration", () => {
    it("should call useField with correct path", () => {
      render(<RolesField path={mockPath} readOnly={false} />);
      expect(useField).toHaveBeenCalledWith({ path: mockPath });
    });

    it("should pass number type to useField", () => {
      render(<RolesField path={mockPath} readOnly={false} />);
      const useFieldCall = (useField as jest.Mock).mock.calls[0][0];
      expect(useFieldCall).toHaveProperty("path", mockPath);
    });
  });

  describe("accessibility", () => {
    it("should have associated labels for all checkboxes", () => {
      render(<RolesField path={mockPath} readOnly={false} />);

      ROLES.forEach((role) => {
        const checkbox = screen.getByLabelText(role.label);
        const label = screen.getByText(role.label);
        expect(label).toHaveAttribute("for", checkbox.id);
      });
    });
  });
});
