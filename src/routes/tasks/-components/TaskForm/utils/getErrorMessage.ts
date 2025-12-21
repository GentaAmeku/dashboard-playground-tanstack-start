/**
 * TanStack Form + Zod のエラー型定義
 */
interface FormError {
  form: string;
  fields?: Record<string, unknown>;
}

interface ZodIssue {
  message: string;
  code?: string;
  path?: (string | number)[];
}

type FormValidationError = string | FormError | ZodIssue | unknown;

/**
 * 型ガード: TanStack Form の setErrorMap で設定されたエラー
 */
function isFormError(error: unknown): error is FormError {
  return (
    error !== null &&
    typeof error === "object" &&
    "form" in error &&
    typeof (error as FormError).form === "string"
  );
}

/**
 * 型ガード: Zod バリデーションエラー
 */
function isZodIssue(error: unknown): error is ZodIssue {
  return (
    error !== null &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as ZodIssue).message === "string"
  );
}

/**
 * TanStack Form + Zod のエラーからメッセージを抽出する
 */
export function getErrorMessage(error: FormValidationError): string {
  if (isFormError(error)) {
    return error.form;
  }

  if (isZodIssue(error)) {
    return error.message;
  }

  return String(error);
}
