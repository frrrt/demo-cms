"use client";
import "./translate-field.scss";
import { DEFAULT_LOCALE } from "@/const/locales";
import { Button, FieldLabel, TextInput, useDocumentInfo, useField, useLocale } from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import { useState, type ChangeEvent } from "react";
import useSWR from "swr";
import { fetcher } from "../../helper/fetcher";
import { TranslationSelect } from "./TranslationSelect";
import { getTranslationUrl } from "./getTranslationUrl";

export default function InputField({ path, readOnly }: TextFieldClientProps) {
  const documentInfo = useDocumentInfo();
  const { code: locale } = useLocale();
  const [shouldFetchTranslations, setShouldFetchTranslations] = useState(false);

  const { data: documentData, error: documentError } = useSWR(
    documentInfo?.id ? `/api/${documentInfo.collectionSlug}/${documentInfo.id}?draft=false&depth=1` : null,
    fetcher,
  );

  const term = documentData?.[path] || "";
  const context = documentData?.description || "";

  const {
    data: translations,
    isLoading: isLoadingTranslations,
    error: translationError,
  } = useSWR(shouldFetchTranslations && term ? getTranslationUrl(locale, term, context) : null, fetcher);

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
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        readOnly={readOnly}
      />

      {documentError && <div className="translation-error">Failed to load document data</div>}

      {locale !== DEFAULT_LOCALE && (
        <div className="translation-picker">
          <Button
            size="small"
            buttonStyle="secondary"
            onClick={() => setShouldFetchTranslations(true)}
            disabled={readOnly || !term || isLoadingTranslations}
          >
            {isLoadingTranslations ? "Translating..." : "Ask ChatGPT"}
          </Button>

          {translationError && <div className="translation-error">Translation request failed. Please try again.</div>}

          {translations && <TranslationSelect setValue={setValue} translations={translations} />}
        </div>
      )}
    </div>
  );
}
