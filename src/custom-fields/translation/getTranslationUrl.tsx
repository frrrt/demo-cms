import { ROUTE_TRANSLATION_STRING } from "@/const/routes";

export const getTranslationUrl = (
  locale: string,
  term: string,
  context: string,
  imageUrl?: string,
) =>
  `/api${ROUTE_TRANSLATION_STRING}?${new URLSearchParams({
    locale,
    term,
    context: JSON.stringify(context),
    ...(imageUrl && { imageUrl }),
  })}`;
