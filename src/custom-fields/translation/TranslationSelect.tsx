// Custom select component, as the Payload UI select component behaves more like a full width input field
// instead of this smaller inline select.
export function TranslationSelect({
  setValue,
  translations,
}: {
  setValue: (val: unknown, disableModifyingForm?: boolean) => void;
  translations: string[];
}): React.ReactNode {
  return (
    <select name="translations" onChange={(e) => setValue(e.target.value)}>
      <option value="">Translations:</option>
      {translations.map((translation: string, i: number) => (
        <option key={`${translation}-${i}`} value={translation}>
          {translation}
        </option>
      ))}
    </select>
  );
}
