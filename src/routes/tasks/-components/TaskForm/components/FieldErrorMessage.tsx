import type { AnyFieldApi } from "@tanstack/react-form";
import { getErrorMessage } from "../utils/getErrorMessage";

interface FieldErrorMessageProps {
  field: AnyFieldApi;
}

export default function FieldErrorMessage({ field }: FieldErrorMessageProps) {
  return (
    !field.state.meta.isValid &&
    field.state.meta.errors.map((error, index) => {
      const message = getErrorMessage(error);
      return (
        <p key={`${index}-${message}`} className="text-destructive text-sm">
          {message}
        </p>
      );
    })
  );
}
