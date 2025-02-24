import React from "react";
import "./styles.scss";
import { FieldLabel } from "@payloadcms/ui";
import DefaultLanguageTextCell from "./DefaultLanguageTextCell";
import type { UIFieldServerProps } from "payload";
import { DEFAULT_LOCALE } from "@/const/locales";

export default function DefaultLanguageTextField({ path, data }: Pick<UIFieldServerProps, "path" | "data">) {
  return (
    data.id && (
      <div className="field-type default-language-text-field">
        <FieldLabel path={path} label={`Default Language Text ${DEFAULT_LOCALE}`} />

        <div>
          <DefaultLanguageTextCell rowData={{ id: data.id }} />
        </div>
      </div>
    )
  );
}
