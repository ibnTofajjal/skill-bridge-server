import { ZodError } from "zod";

const getValidationMessage = (error: ZodError): string => {
  const extraFields = error.issues
    .filter((i) => i.code === "unrecognized_keys")
    .flatMap((i) => ("keys" in i ? (i.keys as string[]) : []));

  if (extraFields.length > 0) {
    return `Unexpected field(s) not allowed: ${extraFields.join(", ")}`;
  }

  const typeErrors = error.issues.filter((i) => i.code === "invalid_type");
  if (typeErrors.length > 0) {
    return typeErrors
      .map((i) => {
        const field = i.path.join(".");
        return `'${field}' must be of type ${i.expected}`;
      })
      .join("; ");
  }

  return error.issues
    .map((i) => `'${i.path.join(".")}': ${i.message}`)
    .join("; ");
};

export default getValidationMessage;
