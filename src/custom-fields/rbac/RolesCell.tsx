import React from "react";
import { ROLES } from "./roles";

export default function RolesCell(props: { cellData: number }) {
  const { cellData } = props;

  const roleLabels = ROLES.filter((role) => (Number(cellData) & role.value) === role.value)
    .map((role) => role.label)
    .join(", ");

  return <>{roleLabels}</>;
}
