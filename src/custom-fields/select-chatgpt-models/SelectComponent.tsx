"use client";
import { SelectInput, useField } from "@payloadcms/ui";
import { OptionObject } from "payload";

export default function SelectComponent({ path, options }: { path: string; options: OptionObject[] }) {
  const { value = "", setValue } = useField<string>({ path });

  return (
    <SelectInput
      path={path}
      name={path}
      options={options}
      value={value}
      onChange={(e) => {
        if (!Array.isArray(e)) {
          setValue(e.value);
        }
      }}
    />
  );
}
