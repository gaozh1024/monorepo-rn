import type { LoggerLike } from '../logger';

export type TelemetrySeverity = 'debug' | 'info' | 'warn' | 'error';

export interface TelemetryEvent {
  name: string;
  category?: string;
  severity?: TelemetrySeverity;
  timestamp?: number;
  durationMs?: number;
  attributes?: Record<string, unknown>;
  data?: unknown;
  error?: unknown;
}

export type TelemetryTransport<TEvent = TelemetryEvent> = (
  event: Readonly<TEvent>
) => void | Promise<void>;

export type TelemetrySanitizer<TEvent = TelemetryEvent> = (event: Readonly<TEvent>) => TEvent;

export interface TelemetryEmitOptions<TEvent = TelemetryEvent> {
  sanitize?: TelemetrySanitizer<TEvent>;
}

export interface TelemetryClient<TEvent = TelemetryEvent> {
  readonly enabled: boolean;
  emit: (event: TEvent, options?: TelemetryEmitOptions<TEvent>) => Promise<void>;
}

export interface TelemetryClientConfig<TEvent = TelemetryEvent> {
  enabled?: boolean;
  transports?: TelemetryTransport<TEvent>[];
  logger?: LoggerLike | null;
  namespace?: string;
}
