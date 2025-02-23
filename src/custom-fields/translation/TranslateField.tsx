"use client";
import { DEFAULT_LOCALE } from "@/const/locales";
import { FieldLabel, useDocumentInfo, useField, useLocale } from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import React, { useState, useEffect } from "react";

export default function InputField({ path, readOnly }: TextFieldClientProps) {
  const documentInfo = useDocumentInfo();
  const { code: locale } = useLocale();
  const [translations, setTranslations] = useState([]);
  const [load, setLoad] = useState("");
  const [term, setTerm] = useState("");
  const [context, setContext] = useState("");

  useEffect(() => {
    const call = async () => {
      if (!documentInfo?.id) {
        return;
      }

      await fetch(`/api/${documentInfo.collectionSlug}/${documentInfo.id}?draft=false&depth=1`)
        .then((response) => response.json())
        .then((data) => {
          setContext(data.description);
          setTerm(data[path]);
        });
    };
    call();
  }, [documentInfo, path]);

  useEffect(() => {
    if (load === "loading") {
      if (term === "") {
        console.error("Term is empty. Either the default is not set or there was an error fetching it.");
      }

      const call = async () => {
        const params = new URLSearchParams({
          locale,
          term,
          context: JSON.stringify(context),
        }).toString();

        await fetch(`/api/translate-string?${params}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            setTranslations(data);
            setLoad("done");
          });
      };

      call();
    }
  }, [context, load, locale, term]);

  const { value = "", setValue } = useField<string>({
    path,
  });

  return (
    <div className="custom-translation-picker field-type text">
      <FieldLabel path={path} label={`Text (${locale})`} />

      <input type="text" id={path} value={value} onChange={(e) => setValue(e.target.value)} disabled={readOnly} />

      {locale !== DEFAULT_LOCALE && documentInfo.id && (
        <>
          <div style={{ marginTop: "calc(var(--base) / 4)" }}>
            <button
              onClick={(e) => {
                setLoad("loading");
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ marginRight: "calc(var(--base) / 2)" }}
              disabled={readOnly || term === ""}
            >
              Ask ChatGPT
            </button>
            {load === "loading" && <span>Loading...</span>}
            {load === "done" && (
              <select
                name="translations"
                id="translation-select"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              >
                {["Translations:", ...translations].map((translation, i) => (
                  <option key={translation + i} value={translation}>
                    {translation}
                  </option>
                ))}
              </select>
            )}
          </div>
        </>
      )}
    </div>
  );
}
