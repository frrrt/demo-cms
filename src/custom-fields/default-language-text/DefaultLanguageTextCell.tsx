import React from "react";

import { type DefaultCellComponentProps, getPayload } from "payload";
import config from "@payload-config";
const payload = await getPayload({ config });

import { DEFAULT_LOCALE } from "@/const/locales";
import { UISTRING_SLUG } from "@/collections/UIString";

export default async function DefaultLanguageTextCell({
  rowData,
}: Pick<DefaultCellComponentProps, "rowData">) {
  if (!rowData?.id) {
    return null;
  }

  const { text } = await payload.findByID({
    collection: UISTRING_SLUG,
    id: rowData.id,
    locale: DEFAULT_LOCALE,
  });

  return <span>{text || "<No Default Text>"}</span>;
}
