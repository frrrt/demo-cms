"use client";
import { DEFAULT_LOCALE } from "@/const/locales";
import { FieldLabel, useDocumentInfo, useField, useLocale } from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import React, { useState, type MouseEvent } from "react";
import useSWR from "swr";
import { fetcher } from "../../helper/fetcher";

export default function InputField({ path, readOnly }: TextFieldClientProps) {
  const documentInfo = useDocumentInfo();
  const { code: locale } = useLocale();
  const [shouldFetchTranslations, setShouldFetchTranslations] = useState(false);

  const { data: documentData } = useSWR(
    documentInfo?.id ? `/api/${documentInfo.collectionSlug}/${documentInfo.id}?draft=false&depth=1` : null,
    fetcher,
  );

  const term = documentData?.[path] || "";
  const context = documentData?.description || "";

  const { data: translations, isLoading: isLoadingTranslations } = useSWR(
    shouldFetchTranslations && term
      ? `/api/translate-string?${new URLSearchParams({
          locale,
          term,
          context: JSON.stringify(context),
        }).toString()}`
      : null,
    fetcher,
  );

  const { value = "", setValue } = useField<string>({
    path,
  });

  if (!documentInfo?.id) {
    return null;
  }

  return (
    <div className="custom-translation-picker field-type text">
      <FieldLabel path={path} label={`Text (${locale})`} />

      <input type="text" id={path} value={value} onChange={(e) => setValue(e.target.value)} disabled={readOnly} />

      {locale !== DEFAULT_LOCALE && (
        <div style={{ marginTop: "calc(var(--base) / 4)" }}>
          <button
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              setShouldFetchTranslations(true);
            }}
            style={{ marginRight: "calc(var(--base) / 2)" }}
            disabled={readOnly || !term}
          >
            Ask ChatGPT
          </button>

          {isLoadingTranslations && <span>Loading...</span>}

          {translations && (
            <select name="translations" id="translation-select" onChange={(e) => setValue(e.target.value)}>
              <option value="">Translations:</option>
              {translations.map((translation: string, i: number) => (
                <option key={`${translation}-${i}`} value={translation}>
                  {translation}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
