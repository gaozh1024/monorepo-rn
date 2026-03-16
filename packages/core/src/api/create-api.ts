import type { APICreateConfig, EndpointConfig } from './types';
import { ZodError } from 'zod';
import { ErrorCode, type AppError } from '../error';

function parseZodError(error: ZodError): AppError {
  const first = error.errors[0];
  return {
    code: ErrorCode.VALIDATION,
    message: first?.message || 'Validation failed',
    field: first?.path.join('.'),
  };
}

export function createAPI<TEndpoints extends Record<string, EndpointConfig<any, any>>>(
  config: APICreateConfig<TEndpoints>
): { [K in keyof TEndpoints]: (input?: any) => Promise<any> } {
  const endpoints = {} as any;

  for (const [name, ep] of Object.entries(config.endpoints)) {
    endpoints[name] = async (input?: any) => {
      if (ep.input) {
        const result = ep.input.safeParse(input);
        if (!result.success) throw parseZodError(result.error);
      }

      const url = config.baseURL + ep.path;
      const response = await fetch(url, { method: ep.method });
      const data = await response.json();

      if (ep.output) {
        return ep.output.parse(data);
      }
      return data;
    };
  }

  return endpoints;
}
