import React from "react";
import { OptionObject, SelectFieldServerProps } from "payload";
import { FieldLabel } from "@payloadcms/ui";
import OpenAI from "openai";
import SelectComponent from "./SelectComponent";

const openai = new OpenAI();

export default async function SelecField({ path }: SelectFieldServerProps) {
  const result = await openai.models.list();

  const options: OptionObject[] = result.data
    .sort((a, b) => b.created - a.created)
    .map((model) => ({ label: model.id, value: model.id }));

  return (
    <div style={{ marginBottom: "var(--spacing-field)" }}>
      <FieldLabel path={path} label="Select ChatGPT model used for Translations" />
      <SelectComponent path={path} options={options} />
    </div>
  );
}
