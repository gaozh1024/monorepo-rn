import { useState, useCallback, useMemo } from 'react';
import type { ZodIssue, ZodSchema } from 'zod';

type FormValues = Record<string, unknown>;
type FieldName<T extends FormValues> = Extract<keyof T, string>;

export interface UseFormOptions<T extends FormValues> {
  schema: ZodSchema<T>;
  defaultValues: T;
}

export interface FormErrors {
  [key: string]: string;
}

const getIssuePath = (issue: ZodIssue) => issue.path.map(String).join('.');

const getFieldError = <T extends FormValues>(issues: ZodIssue[], name: FieldName<T>) => {
  const exactIssue = issues.find(issue => getIssuePath(issue) === name);
  if (exactIssue) return exactIssue.message;

  const nestedIssue = issues.find(issue => issue.path[0] === name);
  return nestedIssue?.message;
};

const buildFormErrors = (issues: ZodIssue[]): FormErrors => {
  return issues.reduce<FormErrors>((acc, issue) => {
    const path = getIssuePath(issue);
    acc[path || 'root'] = issue.message;
    return acc;
  }, {});
};

export function useForm<T extends FormValues>({ schema, defaultValues }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(defaultValues);
  }, [values, defaultValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const clearFieldError = useCallback((name: FieldName<T>) => {
    setErrors(prev => {
      if (!(name in prev)) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const setValue = useCallback(
    <K extends FieldName<T>>(name: K, value: T[K]) => {
      setValues(prev => ({ ...prev, [name]: value }));
      clearFieldError(name);
    },
    [clearFieldError]
  );

  const getValue = useCallback(
    <K extends FieldName<T>>(name: K) => {
      return values[name];
    },
    [values]
  );

  const validateField = useCallback(
    async (name: FieldName<T>) => {
      const fieldName = name;
      const result = await schema.safeParseAsync(values);

      if (result.success) {
        clearFieldError(fieldName);
        return true;
      }

      const errorMessage = getFieldError<T>(result.error.issues, fieldName);
      if (!errorMessage) {
        clearFieldError(fieldName);
        return true;
      }

      setErrors(prev => ({
        ...prev,
        [fieldName]: errorMessage,
      }));
      return false;
    },
    [schema, values, clearFieldError]
  );

  const validate = useCallback(async () => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      setErrors({});
      return true;
    }

    setErrors(buildFormErrors(result.error.issues));
    return false;
  }, [schema, values]);

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setIsSubmitting(false);
  }, [defaultValues]);

  const handleSubmit = useCallback(
    async (onSubmit?: (values: T) => void | Promise<void>) => {
      const valid = await validate();
      if (!valid) return;

      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values]
  );

  return {
    values,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    setValue,
    getValue,
    validate,
    validateField,
    reset,
    handleSubmit,
  };
}
