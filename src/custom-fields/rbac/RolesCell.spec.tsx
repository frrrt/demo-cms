import { render, screen } from "@testing-library/react";
import RolesCell from "./RolesCell";
import { ROLES } from "./roles";

describe("Cell", () => {
  describe("role display", () => {
    it("should display nothing when no roles are selected", () => {
      const { container } = render(<RolesCell cellData={0} />);
      expect(container).toHaveTextContent("");
    });

    it("should display single role correctly", () => {
      render(<RolesCell cellData={ROLES[0].value} />);
      expect(screen.getByText(ROLES[0].label)).toBeInTheDocument();
    });

    it("should display multiple roles with comma separation", () => {
      const roleValue = ROLES[0].value | ROLES[1].value; // Combine first two roles
      const expectedText = `${ROLES[0].label}, ${ROLES[1].label}`;

      render(<RolesCell cellData={roleValue} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it("should handle all roles selected", () => {
      const allRolesValue = ROLES.reduce((acc, role) => acc | role.value, 0);
      const expectedText = ROLES.map((role) => role.label).join(", ");

      render(<RolesCell cellData={allRolesValue} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle undefined cellData", () => {
      const { container } = render(<RolesCell cellData={undefined as unknown as number} />);
      expect(container).toHaveTextContent("");
    });

    it("should handle non-matching role values", () => {
      const nonExistentRoleValue = Math.max(...ROLES.map((r) => r.value)) * 2;
      const { container } = render(<RolesCell cellData={nonExistentRoleValue} />);
      expect(container).toHaveTextContent("");
    });

    it("should handle negative values", () => {
      const { container } = render(<RolesCell cellData={-1} />);
      const expectedRoles = ROLES.filter((role) => (-1 & role.value) === role.value)
        .map((role) => role.label)
        .join(", ");
      expect(container).toHaveTextContent(expectedRoles);
    });
  });

  describe("type coercion", () => {
    it("should handle string numbers", () => {
      const roleValue = ROLES[0].value;
      const { container } = render(<RolesCell cellData={roleValue.toString() as unknown as number} />);
      expect(container).toHaveTextContent(ROLES[0].label);
    });

    it("should handle role combinations with string input", () => {
      const roleValue = (ROLES[0].value | ROLES[1].value).toString();
      const expectedText = `${ROLES[0].label}, ${ROLES[1].label}`;

      render(<RolesCell cellData={roleValue as unknown as number} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});
