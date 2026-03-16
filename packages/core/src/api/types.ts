import { z } from 'zod';

export interface EndpointConfig<TInput, TOutput> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  input?: z.ZodSchema<TInput>;
  output?: z.ZodSchema<TOutput>;
}

export interface APICreateConfig<TEndpoints extends Record<string, EndpointConfig<any, any>>> {
  baseURL: string;
  endpoints: TEndpoints;
}
