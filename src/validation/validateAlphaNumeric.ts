export const validateAlphaNumeric = (field: string) => (value: unknown) => {
  if (typeof value !== "string") {
    return field + " must be a string";
  }

  if (value.length === 0) {
    return field + " cannot be empty";
  }

  // limit to alphanumeric characters and hyphens:
  if (!/^[a-zA-Z0-9-]+$/.test(value)) {
    return field + " can only contain alphanumeric characters and hyphens";
  }

  return true;
};
