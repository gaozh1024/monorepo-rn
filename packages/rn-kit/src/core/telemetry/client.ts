import type {
  TelemetryClient,
  TelemetryClientConfig,
  TelemetryEmitOptions,
  TelemetryEvent,
} from './types';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function warnTelemetryFailure(
  config: Pick<TelemetryClientConfig<any>, 'logger' | 'namespace'>,
  message: string,
  data: Record<string, unknown>
) {
  config.logger?.warn(message, data, config.namespace ?? 'telemetry');
}

export function createTelemetryClient<TEvent = TelemetryEvent>(
  config: TelemetryClientConfig<TEvent> = {}
): TelemetryClient<TEvent> {
  const transports = config.transports ?? [];
  const enabled = (config.enabled ?? true) && transports.length > 0;

  return {
    enabled,
    async emit(event: TEvent, options: TelemetryEmitOptions<TEvent> = {}) {
      if (!enabled) return;

      let nextEvent = event;

      if (options.sanitize) {
        try {
          nextEvent = options.sanitize(event);
        } catch (error) {
          warnTelemetryFailure(config, 'Telemetry sanitizer failed', {
            error: getErrorMessage(error),
          });
        }
      }

      await Promise.all(
        transports.map(async (transport, transportIndex) => {
          try {
            await transport(nextEvent);
          } catch (error) {
            warnTelemetryFailure(config, 'Telemetry transport failed', {
              transportIndex,
              error: getErrorMessage(error),
            });
          }
        })
      );
    },
  };
}

export function createNoopTelemetryClient<TEvent = TelemetryEvent>(): TelemetryClient<TEvent> {
  return {
    enabled: false,
    async emit() {
      // noop by design
    },
  };
}
