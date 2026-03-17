import { z } from 'zod';

export interface ApiEndpointConfig<TInput, TOutput> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  input?: z.ZodSchema<TInput>;
  output?: z.ZodSchema<TOutput>;
}

export interface ApiConfig<TEndpoints extends Record<string, ApiEndpointConfig<any, any>>> {
  baseURL: string;
  endpoints: TEndpoints;
}
