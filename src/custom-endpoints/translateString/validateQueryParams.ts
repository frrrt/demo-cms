import { LOCALES } from "@/const/locales";
import type { PayloadRequest } from "payload";
import { object, string, picklist, parse } from "valibot";

const translateStringValidationSchema = object({
  locale: picklist(LOCALES),
  term: string(),
  context: string(),
});

export function validateQueryParams(req: PayloadRequest) {
  let validated;

  try {
    validated = parse(translateStringValidationSchema, req.query);
  } catch (_e) {
    return false;
  }

  return validated;
}
