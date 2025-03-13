"use client";
import { ROUTE_ALT_TEXT } from "@/const/routes";
import "./alt-text-field.scss";
import {
  Button,
  FieldDescription,
  FieldLabel,
  TextInput,
  useField,
  useDocumentInfo,
  useLocale,
} from "@payloadcms/ui";
import { TextFieldClientProps } from "payload";
import { useState, type ChangeEvent } from "react";
import CharacterCounter from "@/components/CharacterCounter";

// Custom field that extends the standard text field to add an "Generate Alt Text" button
// This component will be used for alt text input with automatic generation capability
export default function AltTextField({ path, readOnly, field }: TextFieldClientProps) {
  const [isGeneratingAltText, setIsGeneratingAltText] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { initialData } = useDocumentInfo();
  const imageUrl = initialData?.url;

  const { code: locale } = useLocale();

  const { value = "", setValue } = useField<string>({
    path,
  });

  const generateAltText = async () => {
    setIsGeneratingAltText(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/${ROUTE_ALT_TEXT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, locale }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate alt text");
      }

      const { altText } = await response.json();

      setValue(altText);
    } catch (error) {
      console.error("Error generating alt text:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate alt text");
    } finally {
      setIsGeneratingAltText(false);
    }
  };

  return (
    <div className="custom-alt-text-field field-type text">
      <FieldLabel path={path} {...field} />

      <TextInput
        path={path}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        readOnly={readOnly}
      />

      <div className="alt-text-controls">
        {imageUrl && (
          <Button
            size="small"
            buttonStyle="secondary"
            onClick={generateAltText}
            disabled={readOnly || isGeneratingAltText}
          >
            {isGeneratingAltText ? "Generating..." : "Generate Alt Text"}
          </Button>
        )}

        <CharacterCounter currentLength={value.length} min={125} max={150} />

        {errorMessage && <div className="alt-text-error">{errorMessage}</div>}
      </div>

      <FieldDescription path={path} description={field.admin?.description} />
    </div>
  );
}
