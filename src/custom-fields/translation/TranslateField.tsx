"use client";
import "./translate-field.scss";
import { DEFAULT_LOCALE } from "@/const/locales";
import { Button, FieldLabel, TextInput, useDocumentInfo, useField, useLocale } from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import React, { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../helper/fetcher";
import { TranslationSelect } from "./TranslationSelect";

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

      <TextInput
        path={path}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />

      {locale !== DEFAULT_LOCALE && (
        <div className="translation-picker">
          <Button
            size="small"
            buttonStyle="secondary"
            onClick={() => setShouldFetchTranslations(true)}
            disabled={readOnly || !term}
          >
            Ask ChatGPT
          </Button>

          {isLoadingTranslations && <span>Loading...</span>}

          {translations && <TranslationSelect setValue={setValue} translations={translations} />}
        </div>
      )}
    </div>
  );
}
