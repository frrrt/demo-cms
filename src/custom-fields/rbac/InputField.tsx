"use client";
import React from "react";
import { ROLES } from "./roles";
import { useField } from "@payloadcms/ui";

export default function RolesField({ path, readOnly }: { path: string; readOnly: boolean }) {
  const { value = 0, setValue } = useField<number>({
    path,
  });

  return (
    <div className="field-type checkbox">
      <div>
        {ROLES.map((role) => (
          <div key={role.value}>
            <input
              type="checkbox"
              disabled={readOnly}
              id={`${path}-${role.value}`}
              checked={(value & role.value) === role.value}
              onChange={() => setValue(value ^ role.value)}
            />
            <label htmlFor={`${path}-${role.value}`}>{role.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
