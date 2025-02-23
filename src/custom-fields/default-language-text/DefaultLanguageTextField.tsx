import React from "react";
import "./styles.scss";
import { FieldLabel } from "@payloadcms/ui";
import DefaultLanguageTextCell from "./DefaultLanguageTextCell";
import type { UIFieldServerProps } from "payload";

export default function DefaultLanguageTextField({ path, data }: UIFieldServerProps) {
  return (
    data.id && (
      <div className="field-type default-language-text-field">
        <FieldLabel path={path} label="Default Language Text" />

        <div>
          <DefaultLanguageTextCell rowData={{ id: data.id }} />
        </div>
      </div>
    )
  );
}
