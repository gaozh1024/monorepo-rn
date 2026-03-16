import { useState, useCallback, useMemo } from 'react';
import type { ZodSchema } from 'zod';

interface UseFormOptions<T extends Record<string, any>> {
  schema: ZodSchema<T>;
  defaultValues: T;
}

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, any>>({
  schema,
  defaultValues,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(defaultValues);
  }, [values, defaultValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[name as string];
      return next;
    });
  }, []);

  const getValue = useCallback(
    (name: keyof T) => {
      return values[name];
    },
    [values]
  );

  const validateField = useCallback(
    async (name: keyof T) => {
      try {
        const shape = (schema as any).shape;
        if (shape && shape[name as string]) {
          await shape[name as string].parseAsync(values[name]);
          setErrors(prev => {
            const next = { ...prev };
            delete next[name as string];
            return next;
          });
          return true;
        }
        return true;
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors?.[0]?.message || '验证失败',
        }));
        return false;
      }
    },
    [schema, values]
  );

  const validate = useCallback(async () => {
    try {
      await schema.parseAsync(values);
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: FormErrors = {};
      error.errors?.forEach((err: any) => {
        const path = err.path.join('.');
        formErrors[path] = err.message;
      });
      setErrors(formErrors);
      return false;
    }
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
