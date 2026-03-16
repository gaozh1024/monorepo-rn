import React from 'react';
import { AppView, AppText } from '../primitives';

export interface FormItemProps {
  name: string;
  label?: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormItem({ name: _name, label, error, help, required, children }: FormItemProps) {
  return (
    <AppView className="mb-4">
      {label && (
        <AppView row items="center" gap={1} className="mb-2">
          <AppText size="sm" weight="medium" color="gray-700">
            {label}
          </AppText>
          {required && <AppText color="error-500">*</AppText>}
        </AppView>
      )}
      {children}
      {error && (
        <AppText size="sm" color="error-500" className="mt-1">
          {error}
        </AppText>
      )}
      {help && !error && (
        <AppText size="sm" color="gray-400" className="mt-1">
          {help}
        </AppText>
      )}
    </AppView>
  );
}
